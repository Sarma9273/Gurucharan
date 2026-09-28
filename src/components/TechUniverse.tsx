import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, OrbitControls } from '@react-three/drei';
import { Component, useRef, useState, type ErrorInfo, type ReactNode } from 'react';
import * as THREE from 'three';
import { techClusters } from '../data';

const palette=['#55e6ff','#9f7cff','#f7b955','#67f0b8','#ff7a90'];

class WebGLErrorBoundary extends Component<{children:ReactNode},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(error:Error,info:ErrorInfo){console.error('GURUVERSE technology-universe error:',error,info);}
  render(){if(this.state.failed)return <div className="tech-fallback"><span>WEBGL / FALLBACK MODE</span><strong>Interactive technology universe unavailable in this browser.</strong><p>The rest of GURUVERSE remains fully available.</p></div>;return this.props.children;}
}
function TechNode({name,position,colour,onSelect}:{name:string;position:[number,number,number];colour:string;onSelect:()=>void}){
 const group=useRef<THREE.Group>(null!);
 useFrame(({pointer},delta)=>{group.current.rotation.y+=delta*.2;group.current.position.x=THREE.MathUtils.damp(group.current.position.x,position[0]+pointer.x*.12,3,delta);});
 return <Float speed={1.2+Math.random()} rotationIntensity={.4} floatIntensity={.65}><group ref={group} position={position} onClick={onSelect}><mesh><icosahedronGeometry args={[.46,1]}/><meshStandardMaterial color="#0a1119" emissive={colour} emissiveIntensity={1.1} metalness={.8} roughness={.2}/></mesh><mesh scale={1.06}><icosahedronGeometry args={[.46,1]}/><meshBasicMaterial color={colour} wireframe transparent opacity={.7}/></mesh><Html center transform distanceFactor={7}><button type="button" className="tech-label" onClick={onSelect}>{name}</button></Html></group></Float>;
}
export default function TechUniverse(){
 const [cluster,setCluster]=useState<keyof typeof techClusters>('Security');
 const [selected,setSelected]=useState(0);
 const items=techClusters[cluster];
 const positions:[number,number,number][]=[[-2.2,1.1,0],[0,1.7,-.5],[2.1,.8,.2],[-1.4,-1.2,.4],[1.4,-1.3,-.2]];
 return <section className="tech section"><div className="section-heading compact"><span className="micro-label">04 / TECHNOLOGY UNIVERSE</span><h2>Tools connected<br/>to real evidence.</h2></div><div className="tech-shell"><div className="tech-tabs">{(Object.keys(techClusters) as (keyof typeof techClusters)[]).map(name=><button type="button" key={name} className={cluster===name?'active':''} onClick={()=>{setCluster(name);setSelected(0);}}>{name}</button>)}</div><div className="tech-canvas"><WebGLErrorBoundary><Canvas camera={{position:[0,0,8],fov:46}} dpr={[1,1.5]}><ambientLight intensity={.35}/><pointLight position={[3,4,5]} intensity={35} color="#55e6ff"/><pointLight position={[-4,-3,4]} intensity={25} color="#9f7cff"/>{items.map(([name],index)=><TechNode key={cluster+'-'+name} name={name} position={positions[index]} colour={palette[index]} onSelect={()=>setSelected(index)}/>) }<OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={.35}/></Canvas></WebGLErrorBoundary></div><div className="tech-evidence"><span>{cluster} / ACTIVE NODE</span><h3>{items[selected][0]}</h3><p>{items[selected][1]}</p><small>Click another node to inspect where it appears in my work.</small></div></div></section>;
}