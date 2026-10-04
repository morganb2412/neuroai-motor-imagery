import {Link} from 'react-router-dom';
import type {Subject} from '../types/scientific';
import {subjectLabel} from '../utils/format';
export function DatasetTable({subjects}:{subjects:Subject[]}){return <div className="table-scroll"><table className="dataset-table"><thead><tr><th>Subject</th><th>Available Runs</th><th>Trials (demo)</th><th>Status</th><th><span className="sr-only">Action</span></th></tr></thead><tbody>{subjects.map(s=><tr key={s.id}><td><strong>{subjectLabel(s.id)}</strong><small>S{String(s.id).padStart(3,'0')}</small></td><td>{s.availableRuns}</td><td>{s.trials}</td><td><span className="status-tag">{s.status}</span></td><td><Link to="/explore">Explore</Link></td></tr>)}</tbody></table></div>}
