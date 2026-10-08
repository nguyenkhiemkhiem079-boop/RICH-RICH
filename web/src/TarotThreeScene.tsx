import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { TarotCard } from "./tarot";

export type TarotPull = { card: TarotCard; reversed: boolean };
type Props = { pulls: TarotPull[]; mode: "preview" | "pick" | "reveal"; selected: number[]; onSelect?: (index: number) => void };

function makeBackTexture() {
  const canvas=document.createElement("canvas");canvas.width=512;canvas.height=768;const ctx=canvas.getContext("2d")!;
  const gradient=ctx.createRadialGradient(256,320,20,256,380,500);gradient.addColorStop(0,"#403a70");gradient.addColorStop(.55,"#252847");gradient.addColorStop(1,"#101626");ctx.fillStyle=gradient;ctx.fillRect(0,0,512,768);
  ctx.strokeStyle="#d3c48c";ctx.lineWidth=7;ctx.strokeRect(26,26,460,716);ctx.strokeStyle="#aaa4ff";ctx.lineWidth=2;ctx.strokeRect(43,43,426,682);
  ctx.translate(256,350);for(let i=0;i<12;i++){ctx.save();ctx.rotate(i*Math.PI/6);ctx.beginPath();ctx.ellipse(0,0,52,205,0,0,Math.PI*2);ctx.strokeStyle=i%2?"#8ad7c877":"#d9c98688";ctx.lineWidth=2;ctx.stroke();ctx.restore();}
  ctx.beginPath();ctx.arc(0,0,88,0,Math.PI*2);ctx.strokeStyle="#e6d59a";ctx.lineWidth=3;ctx.stroke();ctx.fillStyle="#e8defd";ctx.font="72px serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("✧",0,0);ctx.font="bold 21px sans-serif";ctx.fillStyle="#e4def8";ctx.fillText("V I E T L O T T   L A B",0,268);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}

function makeFrontTexture(pull:TarotPull) {
  const canvas=document.createElement("canvas");canvas.width=512;canvas.height=768;const ctx=canvas.getContext("2d")!;
  const g=ctx.createLinearGradient(20,10,500,750);g.addColorStop(0,"#f8f1da");g.addColorStop(.5,"#e8d7b1");g.addColorStop(1,"#c7b27e");ctx.fillStyle=g;ctx.fillRect(0,0,512,768);
  ctx.strokeStyle="#65577b";ctx.lineWidth=4;ctx.strokeRect(22,22,468,724);ctx.strokeStyle="#927c51";ctx.lineWidth=2;ctx.strokeRect(34,34,444,700);
  ctx.textAlign="center";ctx.fillStyle="#625577";ctx.font="20px sans-serif";ctx.fillText(pull.card.arcana.toLocaleUpperCase("vi-VN"),256,88);
  ctx.save();if(pull.reversed){ctx.translate(256,384);ctx.rotate(Math.PI);ctx.translate(-256,-384);}ctx.font="180px serif";ctx.fillStyle="#665887";ctx.textBaseline="middle";ctx.fillText(pull.card.symbol,256,340);ctx.restore();
  ctx.fillStyle="#302942";ctx.font="bold 32px sans-serif";ctx.textBaseline="middle";const name=pull.card.name;ctx.fillText(name.length>19?name.slice(0,18)+"…":name,256,608);
  ctx.font="17px sans-serif";ctx.fillStyle="#685f72";ctx.fillText(pull.reversed?"L Á   N G Ư Ợ C":"L Á   X U Ô I",256,658);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}

function roundedCardShape(width:number,height:number,radius:number){const x=-width/2,y=-height/2;const shape=new THREE.Shape();shape.moveTo(x+radius,y);shape.lineTo(x+width-radius,y);shape.quadraticCurveTo(x+width,y,x+width,y+radius);shape.lineTo(x+width,y+height-radius);shape.quadraticCurveTo(x+width,y+height,x+width-radius,y+height);shape.lineTo(x+radius,y+height);shape.quadraticCurveTo(x,y+height,x,y+height-radius);shape.lineTo(x,y+radius);shape.quadraticCurveTo(x,y,x+radius,y);return shape;}

export function TarotThreeScene({pulls,mode,selected,onSelect}:Props){
  const host=useRef<HTMLDivElement|null>(null);const selectedRef=useRef(selected);selectedRef.current=selected;const [fallback,setFallback]=useState(false);
  useEffect(()=>{
    const element=host.current;if(!element||!pulls.length)return;
    let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:"low-power"});}catch{setFallback(true);return;}
    setFallback(false);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;renderer.setClearColor(0x080d18,0);
    element.replaceChildren(renderer.domElement);renderer.domElement.setAttribute("aria-hidden","true");renderer.domElement.style.width="100%";renderer.domElement.style.height="100%";
    const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x080d18,.018);
    const camera=new THREE.PerspectiveCamera(34,1,.1,80);camera.position.set(0,7.1,15.5);camera.lookAt(0,.65,0);
    scene.add(new THREE.HemisphereLight(0xdcd8ff,0x172018,2));const key=new THREE.DirectionalLight(0xffe7b7,3.2);key.position.set(-4,8,7);scene.add(key);const fill=new THREE.PointLight(0x918cff,28,18);fill.position.set(4,4,1);scene.add(fill);
    const table=new THREE.Mesh(new THREE.BoxGeometry(12,.35,7.6),new THREE.MeshStandardMaterial({color:0x121d25,roughness:.84,metalness:.06}));table.position.y=-.22;scene.add(table);
    const felt=new THREE.Mesh(new THREE.PlaneGeometry(11.75,7.35),new THREE.MeshStandardMaterial({color:0x17272a,roughness:.96,metalness:.02}));felt.rotation.x=-Math.PI/2;felt.position.y=-.035;scene.add(felt);
    const rim=new THREE.Mesh(new THREE.RingGeometry(3.9,4,.025,128),new THREE.MeshBasicMaterial({color:0xb9a56e,transparent:true,opacity:.32,side:THREE.DoubleSide}));rim.rotation.x=-Math.PI/2;rim.position.y=-.02;scene.add(rim);
    const starGeometry=new THREE.SphereGeometry(.018,6,6),starMaterial=new THREE.MeshBasicMaterial({color:0xd8d0ff});for(let i=0;i<54;i++){const star=new THREE.Mesh(starGeometry,starMaterial);star.position.set((Math.random()-.5)*11.1,.005,(Math.random()-.5)*6.8);scene.add(star);}
    const backTexture=makeBackTexture();const cardShape=roundedCardShape(1.12,1.68,.065);const bodyGeometry=new THREE.ExtrudeGeometry(cardShape,{depth:.075,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.025,bevelThickness:.025,curveSegments:5});bodyGeometry.computeVertexNormals();
    const sideMaterial=new THREE.MeshStandardMaterial({color:0xc8b987,roughness:.55,metalness:.22});const planeGeometry=new THREE.PlaneGeometry(1.035,1.59);const groups:THREE.Group[]=[];const pickMeshes:THREE.Object3D[]=[];const disposables:Array<{dispose:()=>void}>=[];disposables.push(backTexture,bodyGeometry,planeGeometry,starGeometry,starMaterial);
    pulls.forEach((pull,index)=>{
      const group=new THREE.Group();const body=new THREE.Mesh(bodyGeometry,sideMaterial);body.position.set(-.56,-.84,-.0375);group.add(body);
      const back=new THREE.Mesh(planeGeometry,new THREE.MeshBasicMaterial({map:backTexture}));back.position.z=.079;back.userData.cardIndex=index;group.add(back);pickMeshes.push(back);disposables.push(back.material);
      if(mode==="reveal"){
        const faceTexture=makeFrontTexture(pull);const face=new THREE.Mesh(planeGeometry,new THREE.MeshBasicMaterial({map:faceTexture}));face.position.z=-.068;face.rotation.y=Math.PI;group.add(face);disposables.push(faceTexture,face.material);
      }
      if(mode!=="reveal"){
        const col=index%6,row=Math.floor(index/6);group.position.set((col-2.5)*1.68,selected.includes(index)?1.27:1.02,(row-.5)*2.02);group.rotation.y=(Math.random()-.5)*.12;group.rotation.z=(Math.random()-.5)*.055;
      }else{
        const col=pulls.length===1?0:index-(pulls.length-1)/2;group.position.set(col*2.35,1.05,.1);group.rotation.z=(index-(pulls.length-1)/2)*-.025;
      }
      group.userData={baseY:group.position.y,selected:selectedRef.current.includes(index),reveal:mode==="reveal",phase:Math.random()*Math.PI*2};scene.add(group);groups.push(group);
    });
    const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let hoverIndex=-1;let pointerX=0,pointerY=0;
    const pick=(event:PointerEvent)=>{if(mode!=="pick"||!onSelect)return;const rect=renderer.domElement.getBoundingClientRect();pointer.x=((event.clientX-rect.left)/rect.width)*2-1;pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(pickMeshes,false)[0];if(hit){const index=hit.object.userData.cardIndex as number;onSelect(index);}};
    const move=(event:PointerEvent)=>{const rect=renderer.domElement.getBoundingClientRect();pointerX=(event.clientX-rect.left)/rect.width-.5;pointerY=(event.clientY-rect.top)/rect.height-.5;if(mode==="pick"){pointer.x=pointerX*2;pointer.y=-pointerY*2;raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(pickMeshes,false)[0];hoverIndex=hit?(hit.object.userData.cardIndex as number):-1;renderer.domElement.style.cursor=hit&&onSelect?"pointer":"default";}};
    renderer.domElement.addEventListener("pointerdown",pick);renderer.domElement.addEventListener("pointermove",move);
    let frame=0;const clock=new THREE.Clock();const animate=()=>{frame=requestAnimationFrame(animate);const elapsed=clock.getElapsedTime();camera.position.x+=(pointerX*.38-camera.position.x)*.025;camera.position.z+=(15.5+Math.abs(pointerX)*.2-camera.position.z)*.025;camera.lookAt(pointerX*.12,.65,0);groups.forEach((group,index)=>{const data=group.userData as {baseY:number;selected:boolean;reveal:boolean;phase:number};data.selected=mode==="pick"&&selectedRef.current.includes(index);const bob=Math.sin(elapsed*1.2+data.phase)*.035;const lift=data.selected?1.18:0;group.position.y+=(data.baseY+lift+bob-group.position.y)*.08;if(index===hoverIndex&&!data.selected){group.rotation.z+=(Math.sin(elapsed*2)*.04-group.rotation.z)*.08;group.position.y+=.025;}if(data.reveal){const progress=Math.min(1,elapsed/.95);const eased=1-Math.pow(1-progress,3);group.rotation.y=Math.PI*eased;group.position.y=data.baseY+Math.sin(Math.min(1,progress)*Math.PI)*.42;}});renderer.render(scene,camera);};
    const resize=()=>{const width=Math.max(element.clientWidth,320),height=Math.max(element.clientHeight,310);renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();};const observer=new ResizeObserver(resize);observer.observe(element);resize();animate();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();renderer.domElement.removeEventListener("pointerdown",pick);renderer.domElement.removeEventListener("pointermove",move);disposables.forEach(item=>item.dispose());sideMaterial.dispose();renderer.dispose();element.replaceChildren();};
  },[pulls,mode,onSelect]);
  return <div className={`tarot-three-shell scene-${mode}`}><div className="tarot-three-stage" ref={host} role="img" aria-label={mode==="pick"?"Bàn trải bài Tarot 3D, nhấp một lá để chọn":mode==="reveal"?"Bàn trải bài Tarot 3D đang lật các lá đã chọn":"Bộ bài Tarot được dựng trong không gian 3D"}/>{fallback&&<p className="tarot-webgl-fallback">Thiết bị chưa bật được WebGL; bạn vẫn có thể chọn bài bằng các nút đánh số bên dưới.</p>}</div>;
}
