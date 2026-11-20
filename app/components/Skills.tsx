'use client';
import { useState } from 'react';

const groups = [
  { name: 'Data & analytics', tools: ['SQL', 'Python', 'Alteryx', 'SAS', 'Machine Learning'] },
  { name: 'Business intelligence', tools: ['Tableau', 'Power BI', 'Qlik Sense', 'Sigma', 'KPI Reporting', 'Dashboarding'] },
  { name: 'Platforms & innovation', tools: ['AWS', 'Databricks', 'ServiceNow', 'Generative AI', 'Agentic AI', 'Data Governance'] },
];
export default function Skills() {
  const [selected, setSelected] = useState('All capabilities');
  const visible = selected === 'All capabilities' ? groups : groups.filter(group => group.name === selected);
  return <>
    <div className="skill-filters" role="group" aria-label="Filter skills by category">
      {['All capabilities', ...groups.map(group => group.name)].map(name => <button key={name} type="button" aria-pressed={selected === name} onClick={() => setSelected(name)}>{name}</button>)}
    </div>
    <p className="skill-result" role="status">{selected === 'All capabilities' ? 'Explore the complete toolkit' : `${visible[0].tools.length} skills in ${selected.toLowerCase()}`}</p>
    <div className={`skills-grid ${visible.length === 1 ? 'filtered-skills' : ''}`}>
      {visible.map(group => <div className="skill-group" key={group.name}><span className="skill-number">0{groups.indexOf(group) + 1}</span><h3>{group.name}</h3><div className="tags">{group.tools.map(tool => <span key={tool}>{tool}</span>)}</div></div>)}
    </div>
  </>;
}
