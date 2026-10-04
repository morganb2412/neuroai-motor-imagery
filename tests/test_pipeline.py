"""Offline checks for scientific invariants; no classification experiment."""
import unittest
import numpy as np
import mne
from src.preprocessing.epochs import create_imagery_epochs, extract_imagery_events
from src.preprocessing.filters import bandpass_filter
from src.features.spectral import compute_psd, band_power
from src.evaluation.metrics import classification_metrics

class PipelineTests(unittest.TestCase):
    def raw(self):
        sfreq = 160.
        times = np.arange(1600) / sfreq
        raw = mne.io.RawArray(np.array([1e-5*np.sin(2*np.pi*10*times)]),
                              mne.create_info(['C3'], sfreq, 'eeg'), verbose=False)
        raw.set_annotations(mne.Annotations([1., 5.], [4., 4.], ['T1', 'T2']))
        return raw

    def test_explicit_labels_and_run_metadata(self):
        raw = mne.concatenate_raws([self.raw(), self.raw()])
        epochs = create_imagery_epochs(raw, [4, 8])
        self.assertEqual(epochs.events[:, 2].tolist(), [1, 2, 1, 2])
        self.assertEqual(epochs.metadata['run'].tolist(), [4, 4, 8, 8])
        with self.assertRaises(ValueError):
            extract_imagery_events(raw, [6, 10])
        with self.assertRaises(ValueError):
            create_imagery_epochs(raw, [4])

    def test_boundaries_drop_crossing_trial(self):
        raw = mne.concatenate_raws([self.raw(), self.raw()])
        epochs = create_imagery_epochs(raw, [4, 8], tmin=1., tmax=6.)
        self.assertTrue(any('BAD boundary' in reasons for reasons in epochs.drop_log))

    def test_filter_copy_and_spectral_power(self):
        raw = self.raw()
        original = raw.get_data().copy()
        filtered = bandpass_filter(raw)
        np.testing.assert_array_equal(raw.get_data(), original)
        power = band_power(compute_psd(filtered, fmin=8., fmax=30.))
        epochs = create_imagery_epochs(filtered, [4])
        self.assertEqual(band_power(compute_psd(epochs, fmin=8., fmax=30.))['beta'].shape, (2, 1))
        self.assertGreater(power['mu_alpha'][0], power['beta'][0])
        with self.assertRaises(ValueError):
            bandpass_filter(raw, h_freq=100.)

    def test_positive_class_and_auc(self):
        result = classification_metrics(np.array([1,1,2,2]), np.array([1,2,2,2]),
                                        np.array([.1,.6,.8,.9]))
        self.assertEqual(result['recall'], 1.)
        self.assertEqual(result['roc_auc'], 1.)
        np.testing.assert_array_equal(result['confusion_matrix'], [[1,1],[0,2]])
        self.assertIsNone(classification_metrics(np.array([1,2]), np.array([1,2]))['roc_auc'])

if __name__ == '__main__':
    unittest.main()
