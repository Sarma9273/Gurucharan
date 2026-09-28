import { useEffect, useState } from 'react';
import { projects } from '../data';
type Mode='explore'|'recruiter'|'engineer';
const destinations=[
 ['TOP','top'],['JOURNEY','journey'],['ABOUT','about'],['EXPERIENCE','experience'],['PROJECTS','projects'],
 ['ARCHITECTURE','architecture'],['RESEARCH','research'],['TECHNOLOGY','technology'],['JOURNAL','journal'],['CONTACT','contact']
] as const;
export default function ExperienceSystem(){
 const [mode,setModeState]=useState<Mode>(()=>{try{return (localStorage.getItem('guruverse-experience-mode') as Mode)||'explore'}catch{return 'explore'}});
 const [open,setOpen]=useState(false); const [query,setQuery]=useState('');
 useEffect(()=>{document.documentElement.dataset.experienceMode=mode;try{localStorage.setItem('guruverse-experience-mode',mode)}catch{}},[mode]);
 useEffect(()=>{const fn=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setOpen(true)}if(e.key==='Escape')setOpen(false)};document.addEventListener('keydown',fn);return()=>document.removeEventListener('keydown',fn)},[]);
 const q=query.trim().toLowerCase();
 const projectHits=projects.filter(p=>(p.title+' '+p.category+' '+p.subtitle+' '+p.technologies.join(' ')).toLowerCase().includes(q)).slice(0,8);
 const navHits=destinations.filter(([label])=>label.toLowerCase().includes(q));
 const jump=(id:string)=>{setOpen(false);document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});};
 return <div className="experience-system" aria-label="Portfolio controls">
  <div className="experience-modes" role="group" aria-label="Experience mode">
   {(['explore','recruiter','engineer'] as Mode[]).map(m=><button key={m} type="button" className={mode===m?'active':''} aria-pressed={mode===m} onClick={()=>setModeState(m)}>{m}</button>)}
  </div>
  <button type="button" className="command-button" onClick={()=>setOpen(true)} aria-label="Open command palette"><span>⌘</span><span>K</span></button>
  {open&&<div className="command-overlay" role="presentation" onMouseDown={()=>setOpen(false)}>
   <section className="command-panel" role="dialog" aria-modal="true" aria-labelledby="command-title" onMouseDown={e=>e.stopPropagation()}>
    <div className="command-panel__header"><div><span className="micro-label">GURUVERSE NAVIGATION</span><h2 id="command-title">What do you want to explore?</h2></div><button type="button" onClick={()=>setOpen(false)} aria-label="Close command palette">×</button></div>
    <input autoFocus type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search projects, technologies, sections…" />
    <div className="command-results">
     {navHits.map(([label,id])=><button key={id} type="button" onClick={()=>jump(id)}><span>{label}</span><span>↗</span></button>)}
     {projectHits.map(p=><button key={p.number} type="button" onClick={()=>jump('projects')}><span>{p.title}</span><span>{p.category}</span></button>)}
     {!navHits.length&&!projectHits.length&&<p>No matching destination.</p>}
    </div>
    <small>Ctrl/⌘ K to open · Esc to close</small>
   </section>
  </div>}
 </div>
}