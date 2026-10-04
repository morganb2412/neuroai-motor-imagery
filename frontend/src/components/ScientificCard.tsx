import eegEmpty from '../assets/icons/empty-eeg.svg';
import modelEmpty from '../assets/icons/empty-model.svg';
import experimentEmpty from '../assets/icons/empty-experiment.svg';
import resultsEmpty from '../assets/icons/empty-results.svg';
import type {ReactNode} from 'react';
import {Info} from 'lucide-react';
export function ScientificCard({title,subtitle,controls,children,className='',help}:{title:string;subtitle?:string;controls?:ReactNode;children:ReactNode;className?:string;help?:string}){
 return <section className={`scientific-card ${className}`}><header className="card-header"><div><h2>{title} {help&&<span title={help} tabIndex={0} className="help-icon"><Info size={14}/></span>}</h2>{subtitle&&<p>{subtitle}</p>}</div>{controls&&<div className="card-controls">{controls}</div>}</header>{children}</section>;
}
export function DemoBadge(){return <span className="demo-badge"><span/>Demo Data</span>}
export function PageHeader({eyebrow,title,description,actions}:{eyebrow:string;title:string;description:string;actions?:ReactNode}){return <header className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{actions}</header>}
export function EmptyState({title,description}:{title:string;description:string}){return <div className="empty-state"><img src={title.toLowerCase().includes("model")||title.toLowerCase().includes("training")?modelEmpty:title.toLowerCase().includes("result")?resultsEmpty:title.toLowerCase().includes("experiment")?experimentEmpty:eegEmpty} alt=""/><h3>{title}</h3><p>{description}</p></div>}
