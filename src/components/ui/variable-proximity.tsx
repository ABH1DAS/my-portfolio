// Variable Proximity from 000h by Cojeev — MIT licence — docs, variants and the full library: https://cojeev.com/ui/docs/variable-proximity/
"use client";

import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ---- registry/cojeev/motion/refs.ts (inlined) ----
/** React 19 callback refs may return their own teardown; object refs are mutable commit targets. */
function assignMotionRef<T>(ref:React.Ref<T>|undefined,value:T|null):()=>void{
 if(typeof ref==='function'){
  const cleanup=ref(value)
  return ()=>{if(typeof cleanup==='function')cleanup();else ref(null)}
 }
 if(ref)ref.current=value
 return ()=>{if(ref)ref.current=null}
}

// ---- registry/cojeev/lib/reference-ref.ts (inlined) ----
/** Preserve caller refs while the effect observes the same DOM element. */
function useReferenceRef<T>(hostRef: React.RefObject<T | null>, forwardedRef: React.Ref<T> | undefined) {
  return React.useCallback((node: T | null) => {
    hostRef.current = node;
    const cleanup = assignMotionRef(forwardedRef, node);
    return () => { hostRef.current = null; cleanup(); };
  }, [hostRef, forwardedRef]);
}

// ---- registry/cojeev/lib/utils.ts (inlined) ----
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---- registry/cojeev/lib/reference-text-math.ts (inlined) ----
const bounded = (value: number, min: number, max: number, fallback: number) => Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
const graphemes = (text: string) => Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), item => item.segment);
function proximityWeight(distance: number, radius: number, from: number, to: number) {
  const p = 1 - bounded(distance / bounded(radius, 1, 1000, 120), 0, 1, 1);
  return from + (to - from) * p * p * (3 - 2 * p);
}

// ---- registry/cojeev/motion/settings.ts (inlined) ----
const RUNTIME={cfg:{rest:false,reach:true,merge:true,hold:true,jiggleOn:true,press:true,echo:false,dots:0,grain:.08,sheen:.6,curve:1.2,lobeK:130,lobeZ:1,mergeZ:.8,arcK:40,holdK:80,pressK:170,jiggle:.35,jiggleDecay:1.6,restSpeed:1,drift:1,quality:2.5},
 tier:{pill:{amp:0,reach:3,inside:1.2,press:.02},tile:{amp:0,reach:2.4,inside:1,press:.02},nav:{amp:0,reach:1.2,inside:.5,press:.008},card:{amp:0,reach:1,inside:.4,press:.004},blob:{amp:.006,reach:3,inside:1.2,press:.03}}};
const factoryTiers={pill:{amp:.008,reach:4,inside:2,sig:24,R:80,press:.03,lobes:0,depth:0,asym:0,spread:.55},tile:{amp:.008,reach:3.5,inside:1.6,sig:18,R:64,press:.035,lobes:0,depth:0,asym:0,spread:.55},nav:{amp:.0006,reach:3,inside:1.2,sig:24,R:64,press:.010,lobes:0,depth:0,asym:0,spread:.55},card:{amp:.0003,reach:2.5,inside:.9,sig:44,R:56,press:.004,lobes:0,depth:0,asym:0,spread:.55},blob:{amp:.012,reach:4,inside:1.8,sig:22,R:64,press:.05,lobes:0,depth:0,asym:0,spread:.55},spinner:{amp:.14,reach:0,inside:0,sig:1,R:0,press:0,lobes:0,depth:0,asym:0,spread:.55}};
const factoryCfg={quality:2.5,grain:.12,sheen:1,curve:1,lobeK:90,lobeZ:.9,mergeZ:.62,arcK:26,holdK:55,pressK:140,jiggle:.45,jiggleDecay:1.35,restSpeed:1,drift:1,rest:true,reach:true,merge:true,hold:true,jiggleOn:true,press:true,echo:false,echoOff:6,echoScale:1.04,dots:0};
type MorphConfig = typeof factoryCfg
type TierName = keyof typeof factoryTiers
type Tier = typeof factoryTiers.pill
type ProductCategory = "buttons" | "icons" | "pills" | "cards" | "skeleton"
type Category = ProductCategory | "nav" | "inputs" | "controls" | "surfaces"
type MotionSettings = {v:3;mode:"off"|"subtle";cats:Record<Category,boolean>}
type MorphProfile = {cfg:MorphConfig;TIER:Record<TierName,Tier>}
type FlowVariant = "glide"|"stretch"|"jelly"|"comet"|"drop"|"rubber"|"pebble"|"ripple"|"halo"|"off"
type FlowSettings = {variant:FlowVariant;hover:boolean;speed:number;intensity:number;hoverStrength:number}
type SettingsSnapshot = Readonly<{motion:MotionSettings;flow:FlowSettings;profile:MorphProfile;authored:boolean}>
const MOTION_KEY = "v-motion"
const MORPH_KEY = "v-morph-cfg-v3"
const FLOW_KEY = "v-flow-v1"
const PRODUCT_CATEGORIES:readonly ProductCategory[] = ["buttons","icons","pills","cards","skeleton"]
const FLOW_DEFAULTS:Readonly<FlowSettings> = Object.freeze({variant:"glide",hover:true,speed:1,intensity:1,hoverStrength:1})
const FLOW_CHARACTERS:Record<FlowVariant,{label:string;duration:number;ease:string;land:string;glow?:string}> = {
 glide:{label:"Glide",duration:.24,ease:"cubic-bezier(.2,.8,.2,1)",land:"none"},
 stretch:{label:"Stretch",duration:.3,ease:"cubic-bezier(.3,1.15,.4,1)",land:"vf-land"},
 jelly:{label:"Jelly",duration:.5,ease:"cubic-bezier(.3,1.3,.45,1)",land:"vf-jellyx"},
 comet:{label:"Comet",duration:.34,ease:"cubic-bezier(.2,.8,.2,1)",land:"vf-land"},
 drop:{label:"Ink drop",duration:.3,ease:"cubic-bezier(.3,1.25,.4,1)",land:"vf-bloom"},
 rubber:{label:"Rubber",duration:.36,ease:"cubic-bezier(.3,1.3,.4,1)",land:"vf-land"},
 pebble:{label:"Pebble",duration:.46,ease:"cubic-bezier(.32,1.25,.42,1)",land:"vf-lean"},
 ripple:{label:"Ripple",duration:.36,ease:"cubic-bezier(.2,.8,.2,1)",land:"vf-land",glow:"vf-ring"},
 halo:{label:"Halo",duration:.4,ease:"cubic-bezier(.3,1.2,.4,1)",land:"vf-land",glow:"vf-glow"},
 off:{label:"Off",duration:0,ease:"linear",land:"none"},
}
const defaultSettings:MotionSettings={v:3,mode:"subtle",cats:{buttons:true,icons:true,pills:true,cards:false,skeleton:true,nav:false,inputs:false,controls:false,surfaces:false}}
function runtime():MorphProfile {
 const TIER=structuredClone(factoryTiers)
 for(const name of Object.keys(RUNTIME.tier) as (keyof typeof RUNTIME.tier)[]) Object.assign(TIER[name],RUNTIME.tier[name])
 return {cfg:{...factoryCfg,...RUNTIME.cfg},TIER}
}
function immutable<T>(value:T):T {
 if(value && typeof value==="object"){Object.values(value).forEach(immutable);Object.freeze(value)}
 return value
}
const serverSnapshot:SettingsSnapshot=immutable({motion:structuredClone(defaultSettings),flow:{...FLOW_DEFAULTS},profile:runtime(),authored:false})
let settings=structuredClone(defaultSettings), profile=runtime(), flow={...FLOW_DEFAULTS}, authored=false, loaded=false
let snapshot=serverSnapshot
const listeners=new Set<()=>void>()
let releaseEvents:undefined|(()=>void), dispatching=false
function storage(){try{return typeof window==="undefined"?null:window.localStorage}catch{return null}}
function parse(key:string):unknown {try{return JSON.parse(storage()?.getItem(key)||"null")}catch{return null}}
function record(value:unknown):value is Record<string,unknown>{return !!value&&typeof value==="object"&&!Array.isArray(value)}
function mergeProfile(value:unknown,base:MorphProfile,strict=false):MorphProfile {
 if(!record(value)||(!record(value.cfg)&&!record(value.TIER)))throw new Error("Profile must contain a cfg or TIER object.")
 const next=structuredClone(base)
 if(record(value.cfg)) for(const key of Object.keys(next.cfg) as (keyof MorphConfig)[]){
  const v=value.cfg[key];if(v===undefined)continue
  if(typeof v!==typeof next.cfg[key]||(typeof v==="number"&&!Number.isFinite(v))){if(strict)throw new Error(`Invalid cfg.${key}: expected a finite ${typeof next.cfg[key]}.`);continue}
  Object.assign(next.cfg,{[key]:v})
 }
 if(record(value.TIER))for(const name of Object.keys(next.TIER) as TierName[]){const saved=value.TIER[name];if(!record(saved))continue
  for(const key of Object.keys(next.TIER[name]) as (keyof Tier)[]){const v=saved[key];if(v===undefined)continue
   if(typeof v!=="number"||!Number.isFinite(v)){if(strict)throw new Error(`Invalid TIER.${name}.${key}: expected a finite number.`);continue}
   next.TIER[name][key]=v
  }
 }
 return next
}
function normalizeFlow(value:unknown):FlowSettings {
 const v=record(value)?value:{},number=(key:string,fallback:number,min:number)=>typeof v[key]==="number"&&Number.isFinite(v[key])?Math.max(min,v[key] as number):fallback
 return {variant:typeof v.variant==="string"&&Object.hasOwn(FLOW_CHARACTERS,v.variant)?v.variant as FlowVariant:"glide",hover:typeof v.hover==="boolean"?v.hover:true,speed:number("speed",1,.25),intensity:number("intensity",1,0),hoverStrength:number("hoverStrength",1,0)}
}
function flowToken(name:string,fallback:string,el?:Element){try{return getComputedStyle(el??document.documentElement).getPropertyValue(name).trim()||fallback}catch{return fallback}}
function flowTokenMs(name:string,fallback:number,el?:Element){const v=flowToken(name,"",el),n=parseFloat(v);return Number.isFinite(n)?n*(v.endsWith("ms")?1:1000):fallback}
function applyFlowSettings(){
 if(typeof document==="undefined")return
 const h=document.documentElement,variant=settings.mode==="off"?"off":flow.variant,c=FLOW_CHARACTERS[variant],hover=flow.hover?"on":"off"
 const values:Record<string,string>={"--flow-speed":String(flow.speed),"--flow-intensity":String(flow.intensity),"--flow-hover":String(flow.hoverStrength),
  "--flow-ease":variant==="off"?c.ease:flowToken("--e-flow-"+variant,c.ease),
  "--flow-dur":((variant==="off"?0:flowTokenMs("--t-flow-"+variant,c.duration*1000))/1000/flow.speed).toFixed(3)+"s",
  "--flow-land":c.land,"--flow-glow":c.glow||"none"}
 if(h.dataset.flow!==variant)h.dataset.flow=variant
 if(h.dataset.flowHover!==hover)h.dataset.flowHover=hover
 for(const [name,value] of Object.entries(values))if(h.style.getPropertyValue(name)!==value)h.style.setProperty(name,value)
}
function publish(){
 const next={motion:settings,flow,profile,authored}
 if(JSON.stringify(next)===JSON.stringify(snapshot)){applyFlowSettings();return}
 snapshot=immutable(structuredClone(next));applyFlowSettings();listeners.forEach(fn=>fn())
}
function loadMotionSettings(){
 if(loaded||typeof window==="undefined")return
 loaded=true;settings=structuredClone(defaultSettings);profile=runtime();flow={...FLOW_DEFAULTS};authored=false
 const raw=parse(MOTION_KEY)
 if(record(raw)){
  if(raw.mode==="off"||raw.mode==="subtle")settings.mode=raw.mode
  if(raw.v===3&&record(raw.cats))for(const key of PRODUCT_CATEGORIES)if(typeof raw.cats[key]==="boolean")settings.cats[key]=raw.cats[key]
 }
 flow=normalizeFlow(parse(FLOW_KEY))
 const saved=parse(MORPH_KEY)
 if(saved)try{profile=mergeProfile(saved,{cfg:{...factoryCfg},TIER:structuredClone(factoryTiers)});authored=true}catch{/* Corrupt saved data keeps a usable runtime. */}
 try{for(const key of ["v-alive-settings","v-morph-cfg","v-morph-cfg-v2","v-motion-cfg"])storage()?.removeItem(key)}catch{}
 publish()
}
function getMotionSettings(){loadMotionSettings();return structuredClone(settings)}
function getFlowSettings(){loadMotionSettings();return {...flow}}
function getSettingsSnapshot(){loadMotionSettings();return snapshot}
function getServerSettingsSnapshot(){return serverSnapshot}
function reloadMotionSettings(){loaded=false;loadMotionSettings()}
function acquireEvents(){
 if(releaseEvents||typeof window==="undefined")return
 const onStorage=(event:StorageEvent)=>{if(event.key===null||[MOTION_KEY,MORPH_KEY,FLOW_KEY].includes(event.key))reloadMotionSettings()}
 const onEngine=()=>{if(!dispatching)reloadMotionSettings()}
 window.addEventListener("storage",onStorage);window.addEventListener("v-motion-change",onEngine);window.addEventListener("v-flow",onEngine)
 releaseEvents=()=>{window.removeEventListener("storage",onStorage);window.removeEventListener("v-motion-change",onEngine);window.removeEventListener("v-flow",onEngine);releaseEvents=undefined}
}
function subscribeSettings(fn:()=>void){loadMotionSettings();listeners.add(fn);acquireEvents();return ()=>{listeners.delete(fn);if(!listeners.size)releaseEvents?.()}}
function event(name:string){if(typeof window==="undefined")return;dispatching=true;try{window.dispatchEvent(new CustomEvent(name,{detail:name==="v-flow"?getFlowSettings():getMotionSettings()}))}finally{dispatching=false}}

// ---- registry/cojeev/motion/use-motion-visibility.ts (inlined) ----
function subscribePreferences(listener: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  document.addEventListener("visibilitychange", listener);
  return () => {
    media.removeEventListener("change", listener);
    document.removeEventListener("visibilitychange", listener);
  };
}
function readPreferences() {
  return document.visibilityState === "visible" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
/** A shared stillness boundary for optional landing-page effects. */
function useMotionVisibility(ref: React.RefObject<Element | null>, mountedElement?: Element | null) {
  const { motion, flow } = React.useSyncExternalStore(subscribeSettings, getSettingsSnapshot, getServerSettingsSnapshot);
  const permitted = React.useSyncExternalStore(subscribePreferences, readPreferences, () => false);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const element = mountedElement ?? ref.current;
    if (!element) { setInView(false); return; }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, mountedElement]);
  return { enabled: permitted && motion.mode !== "off" && flow.variant !== "off", inView };
}

// ---- registry/cojeev/lib/reference-text-motion.ts (inlined) ----
function useReferenceText(paused = false) {
  const host = React.useRef<HTMLDivElement>(null);
  const { enabled, inView } = useMotionVisibility(host);
  return { host, enabled, inView, running: enabled && inView && !paused };
}
type ReferenceTextSize = "sm" | "default" | "lg";

// ---- registry/cojeev/ui/variable-proximity.tsx ----
export type VariableProximityProps = Omit<React.ComponentProps<"div">,"children"> & {
  text: string; variant?: "weight" | "pressure"; size?: ReferenceTextSize; paused?: boolean;
  radius?: number; fromWeight?: number; toWeight?: number;
};
/** Local pointer distance changes the shipped Bricolage variable font's real wght/wdth axes. */
function VariableProximityImpl({text,variant="weight",size="default",paused=false,radius=150,fromWeight=350,toWeight=800,className,ref,onPointerMove,onPointerLeave,...props}:VariableProximityProps) {
  const {host:hostRef,running}=useReferenceText(paused);
  const frame=React.useRef(0), point=React.useRef<{x:number;y:number}|null>(null);
  const from=bounded(fromWeight,200,800,350),to=bounded(toWeight,200,800,800);
  const paint=React.useCallback(() => {
    hostRef.current?.querySelectorAll<HTMLElement>("[data-proximity-letter]").forEach(letter=>{
      const rect=letter.getBoundingClientRect();
      const distance=point.current&&running?Math.hypot(point.current.x-rect.x-rect.width/2,point.current.y-rect.y-rect.height/2):Infinity;
      const weight=proximityWeight(distance,radius,from,to);
      const width=variant==="pressure"?proximityWeight(distance,radius,75,100):100;
      letter.style.fontVariationSettings=`"wght" ${weight}, "wdth" ${width}`;
    });
  },[hostRef,running,radius,from,to,variant]);

  React.useEffect(()=>{paint();return()=>cancelAnimationFrame(frame.current);},[paint,text]);

  // Enhanced proximity field: observe pointer within radius buffer of the element
  React.useEffect(() => {
    if (!running) return;

    const handleWindowPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !hostRef.current) return;
      const rect = hostRef.current.getBoundingClientRect();
      const buffer = radius + 40;
      if (
        event.clientX >= rect.left - buffer &&
        event.clientX <= rect.right + buffer &&
        event.clientY >= rect.top - buffer &&
        event.clientY <= rect.bottom + buffer
      ) {
        point.current = { x: event.clientX, y: event.clientY };
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(paint);
      } else if (point.current !== null) {
        point.current = null;
        paint();
      }
    };

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      cancelAnimationFrame(frame.current);
    };
  }, [running, paint, radius, hostRef]);

  return <div {...props} ref={useReferenceRef(hostRef,ref)} data-slot="variable-proximity" data-variant={variant} data-size={size} data-running={running} className={cn("v-variable-proximity",className)}
    onPointerMove={event=>{onPointerMove?.(event);if(event.defaultPrevented||event.pointerType==="touch"||!running)return;point.current={x:event.clientX,y:event.clientY};cancelAnimationFrame(frame.current);frame.current=requestAnimationFrame(paint);}}
    onPointerLeave={event=>{onPointerLeave?.(event);point.current=null;paint();}}>
    <span className="v-variable-proximity__accessible">{text}</span>
    <span aria-hidden="true" className="v-variable-proximity__line">{text.split(/(\s+)/).map((word,i)=>/^\s+$/.test(word)?word:<span className="v-variable-proximity__word" key={i}>{graphemes(word).map((char,j)=><span key={j} data-proximity-letter="" style={{fontVariationSettings:`"wght" ${from}, "wdth" ${variant==="pressure"?75:100}`}}>{char}</span>)}</span>)}</span>
  </div>;
}
export function VariableProximity(props: Parameters<typeof VariableProximityImpl>[0]) {
  return (
    <>
      <CojeevStyles />
      {VariableProximityImpl(props)}
    </>
  );
}

// ---- Styles (React 19 hoists this <style> into <head> and renders it once per page) ----
const COJEEV_CSS = `/* Variable Proximity — styles for 000h by Cojeev (MIT). Plain CSS with native cascade layers; no Tailwind theme or config needed.
   Dark mode: put the \`dark\` class on <html> or an ancestor (shadcn convention); \`[data-mode="dark"]\` works too.
   Fonts: DM Sans and Bricolage Grotesque load from Google Fonts below (the full library embeds them instead). */
/* vietnamese */
@font-face {
  font-family: 'Bricolage Grotesque';
  font-style: normal;
  font-weight: 200 800;
  font-stretch: 75% 100%;
  font-display: swap;
  src: url(https://cdn.21st.dev/assets/mirror/e1/e1ad6fe7e770fe1587aa9911742429d456cb3e9c83969fbd9d92315667c3c5b7.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Bricolage Grotesque';
  font-style: normal;
  font-weight: 200 800;
  font-stretch: 75% 100%;
  font-display: swap;
  src: url(https://cdn.21st.dev/assets/mirror/10/104b93499342ede4da68d37234be0e5229345f0be0b9509328f3071f5fb9e8c8.woff2) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Bricolage Grotesque';
  font-style: normal;
  font-weight: 200 800;
  font-stretch: 75% 100%;
  font-display: swap;
  src: url(https://cdn.21st.dev/assets/mirror/9f/9fee080fcc2d2e0ea8c7ce2a58abaa8ba1f40c6e603643327cd5eb6f07db06a8.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* latin-ext */
@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 100 1000;
  font-display: swap;
  src: url(https://cdn.21st.dev/assets/mirror/0d/0d0609aee778d21b40bda1d27b7e6b5b3cb1a3e96b90b8831c681aca097c2219.woff2) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 100 1000;
  font-display: swap;
  src: url(https://cdn.21st.dev/assets/mirror/aa/aa530716b0d351866af7dbfa3eee4120fb36f2d071baff8c234185141865c7ff.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@layer theme, base, components, utilities, cojeev-states, cojeev-flow, cojeev-morph, cojeev-accessibility;

:root{
color-scheme:light;
--v-pink:#F0A4CC;--v-olive:#A8BC75;--v-blue:#95BAE8;--v-yellow:#F1D369;
--v-canvas:#F8F6F1;--v-paper:#FFFFFF;--v-beige:#EEE9E1;--v-beige-2:#f3efe8;--v-cream-pill:#FFFFFF;
--v-ink:#26282d;--v-structure:#14171B;--on-structure:#F9FAFC;--structure-quiet:#242931;--structure-line:#565D68;--structure-text:#E2E6ED;--v-ink-soft:#464951;--v-on-ink:#F8F6F1;
--v-text:#26282d;--v-text-2:#464951;--v-text-3:#52565e;--v-skel-face:#EEE9E1;--v-skel-sheen:#FFFFFF;--v-skel-edge:#b4b0ab;--v-disabled-ink:#52565e;--v-disabled-face:#EEE9E1;--v-disabled-edge:#706e6d;
--v-danger:#D7473C;
--v-danger-ink:#b2433b;--v-danger-fill:#B92D28;--v-olive-ink:#525d3d;--v-accent-ink:#704f63;
--v-brand:#845c73;
--v-border:#b4b0ab;
--v-edge:#706e6d;
--switch-knob:#FFFFFF;--switch-knob-on:#14171B;
--font-display:"Bricolage Grotesque",ui-sans-serif,system-ui,sans-serif;
--font-text:"DM Sans",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
--v-font-mono:ui-monospace,"SF Mono",Menlo,monospace;
--s-1:4px;--s-2:8px;--s-3:12px;--s-4:16px;--s-5:20px;--s-6:24px;--s-7:28px;--s-8:32px;--s-10:40px;--s-12:48px;--s-16:64px;
}

:root[data-mode="dark"], .dark{
color-scheme:dark;
--v-canvas:#15171A;--v-paper:#20242A;--v-beige:#292F37;--v-beige-2:#20242a;--v-cream-pill:#20242A;
--v-ink:#f3f4f4;--v-ink-soft:#bdc1c5;--v-on-ink:#15171A;--v-on-accent:#14171B;--v-text:#f3f4f4;--v-text-2:#bdc1c5;--v-text-3:#a9aeb4;
--v-border:#4e5359;--v-edge:#8c9094;--v-brand:#F0A4CC;--v-scrim:rgba(0,0,0,.66);
--v-pink:#F0A4CC;--v-pink-deep:#d693b7;--v-pink-soft:#3f3742;--v-olive:#A8BC75;--v-olive-deep:#96a86a;--v-olive-soft:#343b35;--v-olive-ink:#A8BC75;--v-blue:#95BAE8;--v-blue-deep:#86a6cf;--v-blue-soft:#323b47;--v-yellow:#F1D369;--v-yellow-deep:#d6bc60;--v-yellow-soft:#3f3e33;--v-accent-ink:#F0A4CC;
--v-danger:#D7473C;--v-danger-fill:#B92D28;--v-danger-ink:#e3786f;--v-danger-soft:#36282c;
--v-structure:#14171B;--on-structure:#F9FAFC;--structure-quiet:#242931;--structure-line:#565D68;--structure-text:#E2E6ED;--glide-bg:#14171B;--glide-fg:#F9FAFC;
}

@layer cojeev-states {
.v-variable-proximity { display:grid; position:relative; place-items:center; min-inline-size:0; inline-size:100%; min-block-size:260px; padding:var(--s-6); overflow:hidden; border-radius:var(--r-panel,24px); color:var(--v-text); background:var(--v-beige); font-family:var(--font-display,"Bricolage Grotesque",sans-serif); font-size:clamp(2rem,5vw,3.5rem); line-height:1.15; isolation:isolate; }
.v-variable-proximity[data-size="sm"] { min-block-size:200px; font-size:clamp(1.5rem,4vw,2.5rem); padding:var(--s-4); }
.v-variable-proximity[data-size="lg"] { min-block-size:340px; font-size:clamp(2.25rem,6vw,4.5rem); }
.v-variable-proximity__accessible { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; border:0; }
.v-variable-proximity__line {max-inline-size:100%;overflow-wrap:anywhere;text-align:center;}
.v-variable-proximity__word {display:inline-block;max-inline-size:100%;}
.v-variable-proximity [data-proximity-letter] {font-synthesis:none;transition:font-variation-settings 120ms ease-out;}
.v-variable-proximity[data-running="false"] [data-proximity-letter] {transition:none;}
@media(prefers-reduced-motion:reduce){.v-variable-proximity [data-proximity-letter]{transition:none;}}
}
`;

function CojeevStyles() {
  return (
    <style href="000h-variable-proximity" precedence="default">
      {COJEEV_CSS}
    </style>
  );
}

export { VariableProximityImpl };
export default VariableProximity;
