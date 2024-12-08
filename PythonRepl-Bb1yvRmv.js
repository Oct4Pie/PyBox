import{K as e,al as t,aj as n,h as r,y as i,u as o,b as s,a9 as l,am as a}from"./assets/index-DaUXl7r4.js";import{x as c,a as d}from"./xterm-BkZOsaGq.js";import{B as y}from"./heading-CJOt8PSV.js";import"./ace-Fk63Tb3T.js";const w=()=>{const w=e(null),{pyodide:h,isLoading:p,error:f}=t(),{colorMode:m}=n(),[g,u]=r(0),[b,k]=r(null),_={background:"dark"===m?"#2D3748":"white",foreground:"dark"===m?"#E2E8F0":"#2D3748",cursor:"dark"===m?"rgba(255, 255, 255, 0.8)":"rgba(0, 0, 0, 0.8)",selectionBackground:"dark"===m?"rgba(255, 255, 255, 0.2)":"rgba(0, 0, 0, 0.2)"};return i((()=>{b&&(b.options.theme=_)}),[m]),i((()=>{if(!h||p||f)return;let e,t,n,r,i=[],o=-1,s="",l="",a=">>> ",y=null,m=0;const g=()=>{e.write("\r"),e.write(a+s),e.write("[K");const t=a.length+m,n=a.length+s.length-t;n>0&&e.write(`[${n}D`)},u=t=>{const{key:n,domEvent:r}=t,i=!r.altKey&&!r.ctrlKey&&!r.metaKey&&1===r.key.length;"Enter"===r.key?b():"Backspace"===r.key?E():"ArrowUp"===r.key?j("up"):"ArrowDown"===r.key?j("down"):"ArrowLeft"===r.key?m>0&&(m--,e.write("[D")):"ArrowRight"===r.key?m<s.length&&(m++,e.write("[C")):"Home"===r.key?(e.write(`[${m}D`),m=0):"End"===r.key?(e.write(`[${s.length-m}C`),m=s.length):"Tab"===r.key?C():r.ctrlKey&&"c"===r.key?x():i&&(s=s.slice(0,m)+n+s.slice(m),m++,g()),r.preventDefault()},b=async()=>{e.write("\r\n"),""!==(l+s).trim()&&i.push(l+s),o=i.length;const r=s;s="",m=0,e.options.disableStdin=!0;try{if(y=t.push(r+"\n"),"syntax-error"===y.syntax_check)e.writeln(y.formatted_error.trimEnd()),l="",a=">>> ",e.write(a),e.options.disableStdin=!1;else if("incomplete"===y.syntax_check)l+=r+"\n",a="... ",e.write(a),e.options.disableStdin=!1;else if("complete"===y.syntax_check){l+=r+"\n";try{const t=n(y),[r]=await t;if(void 0!==r){const t=h.runPython("repr(_)");e.writeln(t)}}catch(c){if("PythonError"===c.constructor.name){const t=y.formatted_error||c.message;e.writeln(t.trimEnd())}else e.writeln(`Error: ${c.message}`)}finally{y.destroy(),y=null}l="",a=">>> ",e.write(a),e.options.disableStdin=!1}}catch(c){e.writeln(`Error: ${c.message}`),l="",a=">>> ",e.write(a),e.options.disableStdin=!1}},x=()=>{if(s.length>0||l.length>0)s="",l="",m=0,e.write("^C\r\n"),a=">>> ",e.write(a),e.options.disableStdin=!1;else if(y&&!y.f_done)try{y.cancel(),h.runPython("\nimport sys\nimport _asyncio\n_asyncio.set_fatal_error_handler(lambda *args: None)\nraise KeyboardInterrupt\n"),e.write("^C\r\nExecution interrupted\r\n")}catch(t){}finally{y.destroy(),y=null,a=">>> ",e.write(a),e.options.disableStdin=!1}else e.write("^C\r\n"),a=">>> ",e.write(a),e.options.disableStdin=!1},E=()=>{m>0&&(s=s.slice(0,m-1)+s.slice(m),m--,g())},j=e=>{if("up"===e&&o>0){o--;const e=i[o];l="",a=">>> ",s=e,m=s.length,g()}else if("down"===e){if(o<i.length-1){o++;const e=i[o];l="",a=">>> ",s=e}else o=i.length,l="",a=">>> ",s="";m=s.length,g()}},C=()=>{const e=s.slice(0,m).match(/([a-zA-Z0-9_\.]+)$/);if(""===(e?e[1]:"")){const e="    ";s=s.slice(0,m)+e+s.slice(m),m+=e.length,g()}else v()},v=()=>{const n=s.slice(0,m),r=t.complete(n).toJs(),i=r[0],o=r[1];if(0===i.length);else if(1===i.length){const e=i[0].slice(o);s=s.slice(0,m)+e+s.slice(m),m+=e.length,g()}else if(i.length>1){e.write("\r\n"),e.writeln(i.join("  ")),e.write(a+s);const t=a.length+m,n=a.length+s.length;t<n&&e.write(`[${n-t}D`)}};return(async()=>{e=new c.Terminal({cursorBlink:!0,convertEol:!0,fontFamily:'"Fira Code", monospace',fontSize:14,theme:_}),k(e),r=new d.FitAddon,e.loadAddon(r),e.open(w.current),e.element.style.padding="16px",r.fit(),e.focus(),setTimeout((()=>r.fit()),0),new ResizeObserver((()=>{r.fit()})).observe(w.current);const p=h.pyimport("pyodide.console"),{BANNER:f,PyodideConsole:g}=p;t=g(h.globals),n=h.runPython("\nimport builtins\nfrom pyodide.ffi import to_js\n\nasync def await_fut(fut):\n    try:\n        res = await fut\n        if res is not None:\n            builtins._ = res\n        return to_js([res], depth=1)\n    except KeyboardInterrupt:\n        return to_js([None], depth=1)\n\nawait_fut\n"),t.stdout_callback=t=>e.write(t.replace(/\n/g,"\r\n")),t.stderr_callback=t=>e.write(t.replace(/\n/g,"\r\n")),e.writeln(`Welcome to the Pyodide ${h.version} terminal emulator 🐍`),e.writeln(f),a=">>> ",i=[],o=-1,s="",l="",m=0,y=null,e.write(a),e.onKey(u)})(),()=>{e?.dispose()}}),[h,p,f,g]),o(y,{position:"relative",children:[o(y,{ref:w,style:{width:"100%",maxHeight:"350px"},bg:s("gray.900","gray.800"),borderRadius:"lg",overflow:"scroll"}),o(l,{justifyContent:"center",mb:2,children:o(a,{mt:"2",size:"sm",onClick:()=>{u((e=>e+1))},children:"Clear"})})]},g)};export{w as default};
