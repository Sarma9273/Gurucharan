import { useState } from 'react';
import { answerGuruQuery, type GuruProjectContext } from '../services/guruBot';
import { projects } from '../data';
export default function GuruBot(){
 const [open,setOpen]=useState(false); const [active,setActive]=useState(0); const [query,setQuery]=useState('');
 const [messages,setMessages]=useState<Array<{role:'user'|'bot';text:string}>>([]);
 const project=projects[active];
 const ctx=project as GuruProjectContext;
 const ask=(text:string)=>{if(!text.trim())return;const answer=answerGuruQuery(text,ctx);setMessages(m=>[...m,{role:'user',text},{role:'bot',text:answer.text}]);setQuery('')};
 const quick=(q:string)=>ask(q);
 return <><button type="button" className="guru-bot-launcher" onClick={()=>setOpen(true)} aria-expanded={open} aria-controls="guru-bot-panel"><span className="guru-bot-orbit"/><span className="guru-bot-core"><i/><i/></span><span className="guru-bot-label">GURU-BOT</span></button>
 {open&&<div id="guru-bot-panel" className="guru-bot-panel" role="dialog" aria-modal="true" aria-label="GURU-BOT"><div className="guru-bot-card">
  <header><div><span className="micro-label">GURUVERSE AI</span><h2>GURU-BOT</h2></div><button type="button" onClick={()=>setOpen(false)} aria-label="Close GURU-BOT">×</button></header>
  <label className="guru-bot-select"><span>ACTIVE SYSTEM</span><select value={active} onChange={e=>{setActive(Number(e.target.value));setMessages([])}}>{projects.map((p,i)=><option key={p.number} value={i}>{p.title}</option>)}</select></label>
  <div className="guru-bot-actions"><button type="button" onClick={()=>quick('What is this project?')}>Overview</button><button type="button" onClick={()=>quick('Explain the architecture')}>Architecture</button><button type="button" onClick={()=>quick('Explain the workflow')}>Workflow</button><button type="button" onClick={()=>quick('Show the technology stack')}>Tech stack</button><button type="button" onClick={()=>quick('What problem does it solve?')}>Problem</button><button type="button" onClick={()=>quick('What are the results?')}>Results</button></div>
  <div className="guru-bot-conversation" aria-live="polite">{!messages.length&&<p className="guru-bot-empty">Ask about the active system or use a quick command.</p>}{messages.map((m,i)=><div key={i} className={`guru-msg guru-msg--${m.role}`}><span>{m.role==='user'?'YOU':'GURU-BOT'}</span><p>{m.text}</p></div>)}</div>
  <form onSubmit={e=>{e.preventDefault();ask(query)}}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ask about architecture, workflow, stack…" /><button type="submit">ASK</button></form>
  <footer>SYSTEM ONLINE · LOCAL PROJECT INTELLIGENCE</footer>
 </div></div>}</>
}