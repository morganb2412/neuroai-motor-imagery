"""Execute Phase 1 notebook cells headlessly; record real input/output provenance."""
from pathlib import Path
import sys, json, hashlib, platform, importlib.metadata, os
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
os.environ.setdefault('MPLBACKEND', 'Agg')
from IPython.core.interactiveshell import InteractiveShell
import matplotlib.pyplot as plt
shell = InteractiveShell.instance()
# Execute exactly the teaching notebook cells in order without starting a GUI/server.
figure_paths = []
for name in ['01_dataset_exploration', '02_eeg_preprocessing']:
    notebook = json.loads((ROOT / 'notebooks' / (name + '.ipynb')).read_text())
    ns = {'__name__': '__main__'}
    for index, cell in enumerate(notebook['cells']):
        if cell['cell_type'] != 'code':
            continue
        source = cell['source']
        if isinstance(source, list):
            source = ''.join(source)
        exec(compile(source, f'{name}:cell{index}', 'exec'), ns)
        for number in plt.get_fignums():
            path = ROOT / 'results/figures' / f'{name}-cell{index}-figure{number}.png'
            plt.figure(number).savefig(path, dpi=120)
            figure_paths.append(str(path.relative_to(ROOT)))
        plt.close('all')
    if name.startswith('02'):
        epochs = ns['epochs']
        counts = ns['epoch_counts'](epochs).to_dict()
        epochs.metadata.groupby(['run', 'condition']).size().rename('n_epochs').to_csv(
            ROOT / 'results/tables/phase1_epoch_counts.csv')
files = sorted((ROOT / 'data/raw').rglob('*.edf'))
record = {'status': 'passed', 'python': platform.python_version(),
          'packages': {x: importlib.metadata.version(x) for x in
                       ['mne','numpy','pandas','scipy','scikit-learn','matplotlib','jupyter','ipykernel']},
          'config': json.loads((ROOT / 'experiments/experiment_001/config.json').read_text()),
          'retained_epochs': counts, 'candidate_epochs': len(epochs.drop_log),
          'drop_reasons': ns['drop_summary'](epochs).to_dict(),
          'channels': len(ns['raw'].ch_names), 'sfreq': ns['raw'].info['sfreq'],
          'files': [{'path':str(f.relative_to(ROOT)), 'sha256':hashlib.sha256(f.read_bytes()).hexdigest()}
                    for f in files], 'figures': figure_paths,
          'scope': 'Retrieval/preprocessing only; no ML model fitted or hypotheses tested.'}
(ROOT / 'experiments/experiment_001/verification.json').write_text(json.dumps(record, indent=2)+'\n')
print(json.dumps({k: record[k] for k in ['status','retained_epochs','candidate_epochs','channels','sfreq']}))
