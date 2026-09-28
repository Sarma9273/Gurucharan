import { Component, StrictMode, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

class AppErrorBoundary extends Component<{children:ReactNode},{error:Error|null}> {
  state={error:null as Error|null};
  static getDerivedStateFromError(error:Error){return {error};}
  componentDidCatch(error:Error,info:ErrorInfo){console.error('GURUVERSE startup error:',error,info);}
  render(){
    if(this.state.error)return <div style={{minHeight:'100vh',background:'#05070b',color:'#f4f1e8',padding:'48px 24px',fontFamily:'system-ui,sans-serif'}}><div style={{maxWidth:900,margin:'0 auto'}}><div style={{color:'#55e6ff',fontSize:12,letterSpacing:'.16em'}}>GURUVERSE / STARTUP DIAGNOSTIC</div><h1 style={{fontSize:'clamp(42px,8vw,86px)',lineHeight:.95}}>The interface hit a runtime error.</h1><p style={{color:'#9aa5b1',lineHeight:1.7}}>The deployment is reachable, but a browser-side component failed during startup.</p><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',padding:20,border:'1px solid rgba(173,218,255,.16)',background:'#090d14',color:'#f7b955'}}>{this.state.error.message}</pre><button type="button" onClick={()=>window.location.reload()} style={{marginTop:20,padding:'14px 18px',border:'1px solid #55e6ff',background:'transparent',color:'#55e6ff',cursor:'pointer'}}>RETRY GURUVERSE</button></div></div>;
    return this.props.children;
  }
}
const root=document.getElementById('root');
if(!root)throw new Error('GURUVERSE root element was not found.');
createRoot(root).render(<StrictMode><AppErrorBoundary><App/></AppErrorBoundary></StrictMode>);
