const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["Editor-tbAS7Vy1.js","assets/index-DUqEvd1Q.js","ace-Fk63Tb3T.js","PythonRepl-C7QcVDM3.js","xterm-BkZOsaGq.js","xterm-Dieqgwuu.css","Terminal-uBhGBRHN.js"])))=>i.map(i=>d[i]);
import{a8 as e,h as n,_ as t,y as a,l as i,d as s,m as o,q as r,a3 as l,j as d,f as c,g as u,s as h,n as m,a2 as b,T as p,u as f,v as g,t as y,a9 as v,E as x,D as I,aa as N,O as C,Q as w,ab as T,ac as O,M as _,U as E,x as k,V as D,B as P,W as z,S,k as M,ad as A,ae as L,af as R,ag as F,a0 as U,a5 as B,ah as j}from"./assets/index-DUqEvd1Q.js";import{D as V,C as K,E as H,A as $,P as G,a as W,b as X}from"./MainLayout-DT6FxHLb.js";import{g as Y,a as Q,I as Z}from"./heading-i-vg81v5.js";import"./ace-Fk63Tb3T.js";import"./transition-utils-D6SWC1os.js";function q(e){return e.sort(((e,n)=>{const t=e.compareDocumentPosition(n);if(t&Node.DOCUMENT_POSITION_FOLLOWING||t&Node.DOCUMENT_POSITION_CONTAINED_BY)return-1;if(t&Node.DOCUMENT_POSITION_PRECEDING||t&Node.DOCUMENT_POSITION_CONTAINS)return 1;if(t&Node.DOCUMENT_POSITION_DISCONNECTED||t&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC)throw Error("Cannot sort the given nodes.");return 0}))}function J(e,n,t){let a=e+1;return t&&a>=n&&(a=0),a}function ee(e,n,t){let a=e-1;return t&&a<0&&(a=n),a}const ne="undefined"!=typeof window?t:a;var te=Object.defineProperty,ae=(e,n,t)=>(((e,n,t)=>{n in e?te(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t})(e,"symbol"!=typeof n?n+"":n,t),t);class ie{constructor(){ae(this,"descendants",new Map),ae(this,"register",(e=>{var n;if(null!=e)return"object"==typeof(n=e)&&"nodeType"in n&&n.nodeType===Node.ELEMENT_NODE?this.registerNode(e):n=>{this.registerNode(n,e)}})),ae(this,"unregister",(e=>{this.descendants.delete(e);const n=q(Array.from(this.descendants.keys()));this.assignIndex(n)})),ae(this,"destroy",(()=>{this.descendants.clear()})),ae(this,"assignIndex",(e=>{this.descendants.forEach((n=>{const t=e.indexOf(n.node);n.index=t,n.node.dataset.index=n.index.toString()}))})),ae(this,"count",(()=>this.descendants.size)),ae(this,"enabledCount",(()=>this.enabledValues().length)),ae(this,"values",(()=>Array.from(this.descendants.values()).sort(((e,n)=>e.index-n.index)))),ae(this,"enabledValues",(()=>this.values().filter((e=>!e.disabled)))),ae(this,"item",(e=>{if(0!==this.count())return this.values()[e]})),ae(this,"enabledItem",(e=>{if(0!==this.enabledCount())return this.enabledValues()[e]})),ae(this,"first",(()=>this.item(0))),ae(this,"firstEnabled",(()=>this.enabledItem(0))),ae(this,"last",(()=>this.item(this.descendants.size-1))),ae(this,"lastEnabled",(()=>{const e=this.enabledValues().length-1;return this.enabledItem(e)})),ae(this,"indexOf",(e=>e?this.descendants.get(e)?.index??-1:-1)),ae(this,"enabledIndexOf",(e=>null==e?-1:this.enabledValues().findIndex((n=>n.node.isSameNode(e))))),ae(this,"next",((e,n=!0)=>{const t=J(e,this.count(),n);return this.item(t)})),ae(this,"nextEnabled",((e,n=!0)=>{const t=this.item(e);if(!t)return;const a=J(this.enabledIndexOf(t.node),this.enabledCount(),n);return this.enabledItem(a)})),ae(this,"prev",((e,n=!0)=>{const t=ee(e,this.count()-1,n);return this.item(t)})),ae(this,"prevEnabled",((e,n=!0)=>{const t=this.item(e);if(!t)return;const a=ee(this.enabledIndexOf(t.node),this.enabledCount()-1,n);return this.enabledItem(a)})),ae(this,"registerNode",((e,n)=>{if(!e||this.descendants.has(e))return;const t=q(Array.from(this.descendants.keys()).concat(e));n?.disabled&&(n.disabled=!!n.disabled);const a={node:e,index:-1,...n};this.descendants.set(e,a),this.assignIndex(t)}))}}function se(e){const n=e.composedPath?.()?.[0]??e.target,{tagName:t,isContentEditable:a}=n;return"INPUT"!==t&&"TEXTAREA"!==t&&!0!==a}function oe(e={}){const{ref:t,isDisabled:i,isFocusable:d,clickOnEnter:c=!0,clickOnSpace:u=!0,onMouseDown:h,onMouseUp:m,onClick:b,onKeyDown:p,onKeyUp:f,tabIndex:g,onMouseOver:y,onMouseLeave:v,...x}=e,[I,N]=n(!0),[C,w]=n(!1),T=function(){const e=s(new Map),n=e.current,t=r(((n,t,a,i)=>{e.current.set(a,{type:t,el:n,options:i}),n.addEventListener(t,a,i)}),[]),i=r(((n,t,a,i)=>{n.removeEventListener(t,a,i),e.current.delete(a)}),[]);return a((()=>()=>{n.forEach(((e,n)=>{i(e.el,e.type,n,e.options)}))}),[i,n]),{add:t,remove:i}}(),O=I?g:g||0,_=i&&!d,E=r((e=>{if(i)return e.stopPropagation(),void e.preventDefault();e.currentTarget.focus(),b?.(e)}),[i,b]),k=r((e=>{C&&se(e)&&(e.preventDefault(),e.stopPropagation(),w(!1),T.remove(document,"keyup",k,!1))}),[C,T]),D=r((e=>{if(p?.(e),i||e.defaultPrevented||e.metaKey)return;if(!se(e.nativeEvent)||I)return;const n=c&&"Enter"===e.key;u&&" "===e.key&&(e.preventDefault(),w(!0)),n&&(e.preventDefault(),e.currentTarget.click()),T.add(document,"keyup",k,!1)}),[i,I,p,c,u,T,k]),P=r((e=>{f?.(e),i||e.defaultPrevented||e.metaKey||se(e.nativeEvent)&&!I&&u&&" "===e.key&&(e.preventDefault(),w(!1),e.currentTarget.click())}),[u,I,i,f]),z=r((e=>{0===e.button&&(w(!1),T.remove(document,"mouseup",z,!1))}),[T]),S=r((e=>{if(0===e.button){if(i)return e.stopPropagation(),void e.preventDefault();I||w(!0),e.currentTarget.focus({preventScroll:!0}),T.add(document,"mouseup",z,!1),h?.(e)}}),[i,I,h,T,z]),M=r((e=>{0===e.button&&(I||w(!1),m?.(e))}),[m,I]),A=r((e=>{i?e.preventDefault():y?.(e)}),[i,y]),L=r((e=>{C&&(e.preventDefault(),w(!1)),v?.(e)}),[C,v]),R=o(t,(e=>{e&&"BUTTON"!==e.tagName&&N(!1)}));return I?{...x,ref:R,type:"button","aria-disabled":_?void 0:i,disabled:_,onClick:E,onMouseDown:h,onMouseUp:m,onKeyUp:f,onKeyDown:p,onMouseOver:y,onMouseLeave:v}:{...x,ref:R,role:"button","data-active":l(C),"aria-disabled":i?"true":void 0,tabIndex:_?void 0:O,onClick:E,onMouseDown:S,onMouseUp:M,onKeyUp:P,onKeyDown:D,onMouseOver:A,onMouseLeave:L}}const[re,le,de,ce]=function(){const[e,t]=i({name:"DescendantsProvider",errorMessage:"useDescendantsContext must be used within DescendantsProvider"});return[e,t,()=>{const e=s(new ie);return ne((()=>()=>e.current.destroy())),e.current},e=>{const a=t(),[i,r]=n(-1),l=s(null);ne((()=>()=>{l.current&&a.unregister(l.current)}),[]),ne((()=>{if(!l.current)return;const e=Number(l.current.dataset.index);i==e||Number.isNaN(e)||r(e)}));const d=e?a.register(e):a.register;return{descendants:a,index:i,enabledIndex:a.enabledIndexOf(l.current),register:o(d,l)}}]}();const[ue,he]=i({name:"TabsContext",errorMessage:"useTabsContext: `context` is undefined. Seems you forgot to wrap all tabs components within <Tabs />"}),[me,be]=i({});function pe(e,n){return`${e}--tab-${n}`}function fe(e,n){return`${e}--tabpanel-${n}`}const[ge,ye]=i({name:"TabsStylesContext",errorMessage:"useTabsStyles returned is 'undefined'. Seems you forgot to wrap the components in \"<Tabs />\" "}),ve=h((function(t,i){const s=m("Tabs",t),{children:o,className:r,...l}=b(t),{htmlProps:c,descendants:u,...h}=function(t){const{defaultIndex:i,onChange:s,index:o,isManual:r,isLazy:l,lazyBehavior:c="unmount",orientation:u="horizontal",direction:h="ltr",...m}=t,[b,p]=n(i??0),[f,g]=function(t){const{value:a,defaultValue:i,onChange:s,shouldUpdate:o=(e,n)=>e!==n}=t,r=e(s),l=e(o),[d,c]=n(i),u=void 0!==a,h=u?a:d,m=e((e=>{const n="function"==typeof e?e(h):e;l(h,n)&&(u||c(n),r(n))}),[u,r,h,l]);return[h,m]}({defaultValue:i??0,value:o,onChange:s});a((()=>{null!=o&&p(o)}),[o]);const y=de(),v=d();return{id:`tabs-${t.id??v}`,selectedIndex:f,focusedIndex:b,setSelectedIndex:g,setFocusedIndex:p,isManual:r,isLazy:l,lazyBehavior:c,orientation:u,descendants:y,direction:h,htmlProps:m}}(l),v=p((()=>h),[h]),{isFitted:x,...I}=c,N={position:"relative",...s.root};return f(re,{value:u,children:f(ue,{value:v,children:f(ge,{value:s,children:f(g.div,{className:y("chakra-tabs",r),ref:i,...I,__css:N,children:o})})})})}));ve.displayName="Tabs";const xe=h((function(e,n){const t=ye(),a=function(e){const{isDisabled:n=!1,isFocusable:t=!1,...a}=e,{setSelectedIndex:i,isManual:s,id:r,setFocusedIndex:l,selectedIndex:d}=he(),{index:u,register:h}=ce({disabled:n&&!t}),m=u===d;return{...oe({...a,ref:o(h,e.ref),isDisabled:n,isFocusable:t,onClick:c(e.onClick,(()=>{i(u)}))}),id:pe(r,u),role:"tab",tabIndex:m?0:-1,type:"button","aria-selected":m,"aria-controls":fe(r,u),onFocus:n?void 0:c(e.onFocus,(()=>{l(u),!s&&(!n||!t)&&i(u)}))}}({...e,ref:n}),i=v({outline:"0",display:"flex",alignItems:"center",justifyContent:"center",...t.tab});return f(g.button,{...a,className:y("chakra-tabs__tab",e.className),__css:i})}));xe.displayName="Tab";const Ie=h((function(e,n){const t=function(e){const{focusedIndex:n,orientation:t,direction:a}=he(),i=le(),s=r((e=>{const s=()=>{const e=i.nextEnabled(n);e&&e.node?.focus()},o=()=>{const e=i.prevEnabled(n);e&&e.node?.focus()},r="horizontal"===t,l="vertical"===t,d=e.key,c="ltr"===a?"ArrowLeft":"ArrowRight",u="ltr"===a?"ArrowRight":"ArrowLeft",h={[c]:()=>r&&o(),[u]:()=>r&&s(),ArrowDown:()=>l&&s(),ArrowUp:()=>l&&o(),Home:()=>{const e=i.firstEnabled();e&&e.node?.focus()},End:()=>{const e=i.lastEnabled();e&&e.node?.focus()}}[d];h&&(e.preventDefault(),h(e))}),[i,n,t,a]);return{...e,role:"tablist","aria-orientation":t,onKeyDown:c(e.onKeyDown,s)}}({...e,ref:n}),a=ye(),i=v({display:"flex",...a.tablist});return f(g.div,{...t,className:y("chakra-tabs__tablist",e.className),__css:i})}));Ie.displayName="TabList";const Ne=h((function(e,n){const t=function(e){const{children:n,...t}=e,{isLazy:a,lazyBehavior:i}=he(),{isSelected:o,id:r,tabId:l}=be(),d=s(!1);o&&(d.current=!0);const c=function(e){const{wasSelected:n,enabled:t,isSelected:a,mode:i="unmount"}=e;return!t||!!a||!("keepMounted"!==i||!n)}({wasSelected:d.current,isSelected:o,enabled:a,mode:i});return{tabIndex:0,...t,children:c?n:null,role:"tabpanel","aria-labelledby":l,hidden:!o,id:r}}({...e,ref:n}),a=ye();return f(g.div,{outline:"0",...t,className:y("chakra-tabs__tab-panel",e.className),__css:a.tabpanel})}));Ne.displayName="TabPanel";const Ce=h((function(e,n){const t=function(e){const n=he(),{id:t,selectedIndex:a}=n,i=Y(e.children).map(((e,n)=>u(me,{key:e.key??n,value:{isSelected:n===a,id:fe(t,n),tabId:pe(t,n),selectedIndex:a}},e)));return{...e,children:i}}(e),a=ye();return f(g.div,{...t,width:"100%",ref:n,className:y("chakra-tabs__tab-panels",e.className),__css:a.tabpanels})}));Ce.displayName="TabPanels";const we=x({displayName:"CloseIcon",d:"M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z"}),Te=({output:e,clearOutput:t})=>{const[a,i]=n(!1),s=I("gray.100","gray.800");return f(_,{h:"100%",bg:s,p:"4",overflowY:"auto",children:[f(N,{justifyContent:"space-between",alignItems:"center",mb:"2",children:[f(Q,{size:"md",children:"Output"}),f(N,{children:[f(C,{label:"Clear Output",children:f(w,{icon:f(V,{}),size:"sm",onClick:t,"aria-label":"Clear Output",variant:"ghost"})}),f(C,{label:a?"Expand":"Collapse",children:f(w,{icon:f(a?T:O,{}),size:"sm",onClick:()=>i(!a),"aria-label":"Toggle Output",variant:"ghost"})})]})]}),f(K,{in:!a,animateOpacity:!0,children:f(_,{as:"pre",fontFamily:"monospace",fontSize:"sm",whiteSpace:"pre-wrap",overflow:"auto",bg:I("gray.200","gray.700"),maxHeight:"300px",p:"2",borderRadius:"md",h:"full",color:"white",children:f(E,{color:I("gray.800","white"),fontFamily:"monospace",decoration:"bold",children:e})})})]})},Oe=k.memo((({filename:e,isActive:t,onClick:a,onClose:i,onRename:s,hasUnsavedChanges:o})=>{const[r,l]=n(!1),[d,c]=n(e),u=()=>{r&&d.trim()&&d!==e&&s(e,d.trim()),l(!r)},h=I("teal.300","teal.700"),m=I("gray.200","gray.700"),b=I("teal.200","teal.600"),p=I("teal.500","teal.300"),g=I("red.600","red.500");return f(N,{align:"center",px:"4",py:"2",bg:t?h:m,borderBottom:t?`2px solid ${p}`:"none",_hover:{bg:b,cursor:"pointer"},onClick:a,transition:"background 0.2s",position:"relative",children:[r?f(Z,{value:d,onChange:e=>c(e.target.value),onBlur:u,onKeyPress:e=>"Enter"===e.key&&u(),size:"sm",autoFocus:!0}):f(N,{align:"center",children:[f(E,{mr:"2",isTruncated:!0,children:e}),o&&f(_,{as:D,color:g,ml:1,w:"6px",h:"6px",borderRadius:"full"})]}),f(C,{label:"Rename Tab",children:f(w,{icon:f(H,{}),size:"xs",onClick:e=>{e.stopPropagation(),u()},"aria-label":"Rename Tab",variant:"ghost",ml:2})}),f(C,{label:"Close Tab",children:f(w,{icon:f(we,{}),size:"xs",onClick:e=>{e.stopPropagation(),i()},"aria-label":"Close Tab",variant:"ghost",ml:1})})]})})),_e=k.lazy((()=>P((()=>import("./Editor-tbAS7Vy1.js")),__vite__mapDeps([0,1,2])))),Ee=k.lazy((()=>P((()=>import("./PythonRepl-C7QcVDM3.js")),__vite__mapDeps([3,1,2,4,5])))),ke=k.lazy((()=>P((()=>import("./Terminal-uBhGBRHN.js")),__vite__mapDeps([6,1,2,4,5])))),De=({panelBgColor:e,activeFile:t,openFiles:i,setActiveFile:s,handleCloseFile:o,handleRenameFile:r,handleAddNewFile:l,unsavedFiles:d,markFileAsUnsaved:c,handleSaveFile:u,isBottomPanelVisible:h,setIsBottomPanelVisible:m,activeBottomPanel:b,setActiveBottomPanel:p,output:g,clearOutput:y,editorRef:v})=>{const[x,T]=n(null);return a((()=>{const e=document.getElementById("plot-container");document.pyodideMplTarget=e,x&&-1!==x.indexOf("matplotlib_")&&(e.innerHTML=x)}),[]),a((()=>{const e=document.pyodideMplTarget;if(e){x&&-1!==x.indexOf("matplotlib_")&&(e.innerHTML=x);const n=new MutationObserver((()=>{const n=Array.from(e.children).at(-1),t=n?n.innerHTML.trim():"";t?-1!==t.indexOf("matplotlib_")&&T(t):T(null)}));return n.observe(e,{childList:!0,subtree:!0}),()=>n.disconnect()}}),[x]),f(N,{direction:"column",h:"100%",children:[f(_,{bg:e,borderBottom:"1px",borderColor:"gray.300",px:4,py:2,transition:"background-color 0.3s"}),f(_,{bg:e,borderBottom:"1px",borderColor:"gray.300",px:4,py:1,transition:"background-color 0.3s",children:f(N,{alignItems:"center",overflowX:"auto",children:[f(ve,{variant:"soft-rounded",colorScheme:"teal",isLazy:!0,index:i.indexOf(t),onChange:e=>s(i[e]),children:f(Ie,{children:i.map((e=>f(Oe,{filename:e,isActive:t===e,onClick:()=>s(e),onClose:()=>o(e),onRename:r,hasUnsavedChanges:d.has(e)},e)))})}),f(C,{label:"Add New File","aria-label":"Add New File Tooltip",children:f(w,{icon:f($,{}),size:"xs",variant:"ghost","aria-label":"Add New File",onClick:e=>{e.stopPropagation(),l()},_hover:{bg:"teal.500",color:"white"},ml:2})})]})}),f(G,{direction:"vertical",style:{flex:1,display:"flex"},children:[f(W,{minSize:1,className:"panel-editor",style:{display:"flex",flexDirection:"column",overflow:"hidden"},children:f(_,{position:"relative",h:"100%",children:f(z,{fallback:f(S,{}),children:f(_e,{ref:v,activeFile:t,markFileAsUnsaved:c})})})}),f(M,{children:[f(X,{className:"resize-handle-horizontal",style:{display:h?"flex":"none",cursor:"row-resize",backgroundColor:e,height:"5px"}}),f(W,{defaultSize:30,minSize:5,className:"panel-bottom",style:{display:h?"flex":"none",flexDirection:"column",backgroundColor:e,overflow:"hidden"},children:f(_,{h:"100%",overflow:"hidden",children:f(ve,{variant:"enclosed",size:"sm",index:(()=>{switch(b){case"Output":default:return 0;case"Visual":return 1;case"Terminal":return 2;case"Python REPL":return 3}})(),onChange:e=>{p(["Output","Visual","Terminal","Python REPL"][e])},children:[f(N,{alignItems:"center",children:[f(Ie,{children:[f(xe,{children:f(N,{align:"center",children:[f(A,{size:16,style:{marginRight:"8px"}}),"Output"]})}),f(xe,{children:f(N,{align:"center",children:[f(L,{size:16,style:{marginRight:"8px"}}),"Visual"]})}),f(xe,{children:f(N,{align:"center",children:[f(R,{size:16,style:{marginRight:"8px"}}),"Terminal"]})}),f(xe,{children:f(N,{align:"center",children:[f(F,{size:16,style:{marginRight:"8px"}}),"Python REPL"]})})]}),f(w,{"aria-label":"Close Panel",icon:f(we,{}),size:"sm",onClick:()=>m(!1),ml:"auto",variant:"ghost",_hover:{bg:"red.500",color:"white"},mt:1,mr:2})]}),f(Ce,{children:[f(Ne,{p:"2",children:g?f(Te,{output:g,clearOutput:y}):f(U,{h:"100%",children:f(N,{direction:"column",align:"center",color:"gray.500",children:[f(A,{size:50,style:{marginBottom:"16px"}}),f(E,{fontSize:"md",mb:2,children:"Run your code"}),f(E,{fontSize:"sm",children:"Results of your code will appear here when you run the project."})]})})}),f(Ne,{p:"2",overflow:"scroll",maxH:"65vh",children:f(_,{w:"100%",h:"100%",borderRadius:"md",overflow:"auto",boxShadow:"sm",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",fontSize:"sm",children:[x&&-1===x.indexOf("matplotlib_")&&f(M,{children:[f(B,{as:j,boxSize:10,mb:2,color:"gray.500"}),f(E,{color:"gray.500",children:"Render a graph and it will show here"})]}),f(_,{id:"plot-container",w:"95%",h:"100%",borderRadius:"md",overflow:"auto",boxShadow:"sm",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",fontSize:"sm",children:x&&x.includes("matplotlib_")?null:f(E,{color:I("gray.500","gray.300"),textAlign:"center",my:4,children:[f(B,{as:j,boxSize:10,mb:2}),f("br",{}),"When a graph is rendered into the container, it will show here"]})})]})}),f(Ne,{p:"2",children:f(z,{fallback:f(S,{}),children:f(ke,{})})}),f(Ne,{p:"2",children:f(z,{fallback:f(S,{}),children:f(Ee,{})})})]})]})})})]})]})]})};export{De as default};