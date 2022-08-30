"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[103,918],{5203:(e,n,t)=>{t.r(n),t.d(n,{default:()=>h});var r=t(7294),o=t(6010),a=t(1944),i=t(5281),l=t(9460),c=t(9058),s=t(390),d=t(7462),p=t(5999),m=t(2244);function u(e){const{nextItem:n,prevItem:t}=e;return r.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,p.I)({id:"theme.blog.post.paginator.navAriaLabel",message:"Blog post page navigation",description:"The ARIA label for the blog posts pagination"})},t&&r.createElement(m.Z,(0,d.Z)({},t,{subLabel:r.createElement(p.Z,{id:"theme.blog.post.paginator.newerPost",description:"The blog post button label to navigate to the newer/previous post"},"Newer Post")})),n&&r.createElement(m.Z,(0,d.Z)({},n,{subLabel:r.createElement(p.Z,{id:"theme.blog.post.paginator.olderPost",description:"The blog post button label to navigate to the older/next post"},"Older Post"),isNext:!0})))}function g(){var e;const{assets:n,metadata:t}=(0,l.C)(),{title:o,description:i,date:c,tags:s,authors:d,frontMatter:p}=t,{keywords:m}=p,u=null!=(e=n.image)?e:p.image;return r.createElement(a.d,{title:o,description:i,keywords:m,image:u},r.createElement("meta",{property:"og:type",content:"article"}),r.createElement("meta",{property:"article:published_time",content:c}),d.some((e=>e.url))&&r.createElement("meta",{property:"article:author",content:d.map((e=>e.url)).filter(Boolean).join(",")}),s.length>0&&r.createElement("meta",{property:"article:tag",content:s.map((e=>e.label)).join(",")}))}var f=t(9407);function v(e){let{sidebar:n,children:t}=e;const{metadata:o,toc:a}=(0,l.C)(),{nextItem:i,prevItem:d,frontMatter:p}=o,{hide_table_of_contents:m,toc_min_heading_level:g,toc_max_heading_level:v}=p;return r.createElement(c.Z,{sidebar:n,toc:!m&&a.length>0?r.createElement(f.Z,{toc:a,minHeadingLevel:g,maxHeadingLevel:v}):void 0},r.createElement(s.Z,null,t),(i||d)&&r.createElement(u,{nextItem:i,prevItem:d}))}function h(e){const n=e.content;return r.createElement(l.n,{content:e.content,isBlogPostPage:!0},r.createElement(a.FG,{className:(0,o.Z)(i.k.wrapper.blogPages,i.k.page.blogPostPage)},r.createElement(g,null),r.createElement(v,{sidebar:e.sidebar},r.createElement(n,null))))}},9407:(e,n,t)=>{t.d(n,{Z:()=>c});var r=t(7462),o=t(7294),a=t(6010),i=t(3743);const l="tableOfContents_bqdL";function c(e){let{className:n,...t}=e;return o.createElement("div",{className:(0,a.Z)(l,"thin-scrollbar",n)},o.createElement(i.Z,(0,r.Z)({},t,{linkClassName:"table-of-contents__link toc-highlight",linkActiveClassName:"table-of-contents__link--active"})))}},3743:(e,n,t)=>{t.d(n,{Z:()=>g});var r=t(7462),o=t(7294),a=t(6668);function i(e){const n=e.map((e=>({...e,parentIndex:-1,children:[]}))),t=Array(7).fill(-1);n.forEach(((e,n)=>{const r=t.slice(2,e.level);e.parentIndex=Math.max(...r),t[e.level]=n}));const r=[];return n.forEach((e=>{const{parentIndex:t,...o}=e;t>=0?n[t].children.push(o):r.push(o)})),r}function l(e){let{toc:n,minHeadingLevel:t,maxHeadingLevel:r}=e;return n.flatMap((e=>{const n=l({toc:e.children,minHeadingLevel:t,maxHeadingLevel:r});return function(e){return e.level>=t&&e.level<=r}(e)?[{...e,children:n}]:n}))}function c(e){const n=e.getBoundingClientRect();return n.top===n.bottom?c(e.parentNode):n}function s(e,n){var t;let{anchorTopOffset:r}=n;const o=e.find((e=>c(e).top>=r));if(o){var a;return function(e){return e.top>0&&e.bottom<window.innerHeight/2}(c(o))?o:null!=(a=e[e.indexOf(o)-1])?a:null}return null!=(t=e[e.length-1])?t:null}function d(){const e=(0,o.useRef)(0),{navbar:{hideOnScroll:n}}=(0,a.L)();return(0,o.useEffect)((()=>{e.current=n?0:document.querySelector(".navbar").clientHeight}),[n]),e}function p(e){const n=(0,o.useRef)(void 0),t=d();(0,o.useEffect)((()=>{if(!e)return()=>{};const{linkClassName:r,linkActiveClassName:o,minHeadingLevel:a,maxHeadingLevel:i}=e;function l(){const e=function(e){return Array.from(document.getElementsByClassName(e))}(r),l=function(e){let{minHeadingLevel:n,maxHeadingLevel:t}=e;const r=[];for(let o=n;o<=t;o+=1)r.push("h"+o+".anchor");return Array.from(document.querySelectorAll(r.join()))}({minHeadingLevel:a,maxHeadingLevel:i}),c=s(l,{anchorTopOffset:t.current}),d=e.find((e=>c&&c.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)));e.forEach((e=>{!function(e,t){t?(n.current&&n.current!==e&&n.current.classList.remove(o),e.classList.add(o),n.current=e):e.classList.remove(o)}(e,e===d)}))}return document.addEventListener("scroll",l),document.addEventListener("resize",l),l(),()=>{document.removeEventListener("scroll",l),document.removeEventListener("resize",l)}}),[e,t])}function m(e){let{toc:n,className:t,linkClassName:r,isChild:a}=e;return n.length?o.createElement("ul",{className:a?void 0:t},n.map((e=>o.createElement("li",{key:e.id},o.createElement("a",{href:"#"+e.id,className:null!=r?r:void 0,dangerouslySetInnerHTML:{__html:e.value}}),o.createElement(m,{isChild:!0,toc:e.children,className:t,linkClassName:r}))))):null}const u=o.memo(m);function g(e){let{toc:n,className:t="table-of-contents table-of-contents__left-border",linkClassName:c="table-of-contents__link",linkActiveClassName:s,minHeadingLevel:d,maxHeadingLevel:m,...g}=e;const f=(0,a.L)(),v=null!=d?d:f.tableOfContents.minHeadingLevel,h=null!=m?m:f.tableOfContents.maxHeadingLevel,b=function(e){let{toc:n,minHeadingLevel:t,maxHeadingLevel:r}=e;return(0,o.useMemo)((()=>l({toc:i(n),minHeadingLevel:t,maxHeadingLevel:r})),[n,t,r])}({toc:n,minHeadingLevel:v,maxHeadingLevel:h});return p((0,o.useMemo)((()=>{if(c&&s)return{linkClassName:c,linkActiveClassName:s,minHeadingLevel:v,maxHeadingLevel:h}}),[c,s,v,h])),o.createElement(u,(0,r.Z)({toc:b,className:t,linkClassName:c},g))}},6922:(e,n,t)=>{t.d(n,{Z:()=>a});var r=t(7294),o=t(7112);const a={React:r,...r,Dialog:o.Vq,Loading:o.gb}},7112:(e,n,t)=>{t.d(n,{Vq:()=>z,tM:()=>te,gb:()=>oe});var r,o,a,i,l,c,s=t(1880),d=t(1192);d.ZP.button(r||(r=(0,s.Z)(["\n  display: inline-block;\n  padding: 4px 10px;\n  margin: 3px 5px;\n  font-size: 14px;\n  font-weight: normal;\n  line-height: 1.42857143;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: middle;\n  -ms-touch-action: manipulation;\n  touch-action: manipulation;\n  cursor: pointer;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n\n  color: #333;\n  background-color: #fff;\n\n  :disabled {\n    opacity: 0.4;\n  }\n\n  :hover {\n    box-shadow: 0 0 2px gray;\n  }\n\n  ","\n\n  ","\n  \n  ","\n  \n  ","\n  \n   ","\n"])),(e=>e.primary&&(0,d.iv)(o||(o=(0,s.Z)(["\n      color: #fff;\n      background: #45c0dc;\n      border-color: #45c0dc;\n    "])))),(e=>e.success&&(0,d.iv)(a||(a=(0,s.Z)(["\n      color: #fff;\n      background: #5cb85c;\n      border-color: #5cb85c;\n    "])))),(e=>e.info&&(0,d.iv)(i||(i=(0,s.Z)(["\n      color: #fff;\n      background: #5bc0de;\n      border-color: #5bc0de;\n    "])))),(e=>e.warning&&(0,d.iv)(l||(l=(0,s.Z)(["\n      color: #fff;\n      background: #f0ad4e;\n      border-color: #f0ad4e;\n    "])))),(e=>e.danger&&(0,d.iv)(c||(c=(0,s.Z)(["\n      color: #fff;\n      background: #d9534f;\n      border-color: #d9534f;\n    "])))));var p,m=t(7294);d.ZP.pre(p||(p=(0,s.Z)(["\n  white-space: -moz-pre-wrap; /* Mozilla, supported since 1999 */\n  white-space: -pre-wrap; /* Opera */\n  white-space: -o-pre-wrap; /* Opera */\n  white-space: pre-wrap; /* CSS3 - Text module (Candidate Recommendation) http://www.w3.org/TR/css3-text/#white-space */\n  word-wrap: break-word; /* IE 5.5+ */\n"])));t(4379);let u,g;!function(e){e.BLUEPRINT="system/SIMOS/Blueprint",e.ATTRIBUTE="system/SIMOS/BlueprintAttribute",e.PACKAGE="system/SIMOS/Package",e.ENTITY="system/SIMOS/Entity",e.ENUM="system/SIMOS/Enum",e.JOB="WorkflowDS/Blueprints/Job"}(u||(u={})),function(e){e.CREATED="created",e.STARTING="starting",e.RUNNING="running",e.FAILED="failed",e.COMPLETED="completed",e.UNKNOWN="unknown"}(g||(g={}));var f;d.ZP.div(f||(f=(0,s.Z)(["\n  display: flex;\n  &:hover {\n    background-color: #acb7da;\n  }\n"])));var v;d.ZP.select(v||(v=(0,s.Z)(["\n  position: relative;\n  font-size: medium;\n  padding: 6px 8px;\n  border: 0;\n  border-bottom: 2px solid #dbdbdb;\n  cursor: pointer;\n  height: 34px;\n  background-color: #f7f7f7;\n  width: ",";\n"])),"285px");t(9669);"http://localhost".replace(/\/+$/,"");class h extends Error{constructor(e,n){super(n),this.name="RequiredError",this.field=e}}let b,x,E;!function(e){e[e.WRITE=2]="WRITE",e[e.READ=1]="READ",e[e.NONE=0]="NONE"}(b||(b={})),function(e){e.MongoDb="mongo-db",e.AzureBlobStorage="azure-blob-storage",e.LocalStorage="localStorage"}(x||(x={})),function(e){e.Default="default",e.Large="large",e.VeryLarge="veryLarge",e.Video="video",e.Blob="blob"}(E||(E={}));var y=t(3852),w=t(7383);t(4155);var Z,k,L,N,P,C,I;let R;y.J.add({edit_text:w.OmT,save:w.a1L}),function(e){e.READ="READ",e.WRITE="WRITE",e.NONE="NONE"}(R||(R={}));d.ZP.div(Z||(Z=(0,s.Z)(["\n  max-width: 650px;\n  padding: 10px;\n"]))),d.ZP.div(k||(k=(0,s.Z)(["\n  border: black 1px solid;\n  border-radius: 3px;\n  max-height: 200px;\n  overflow: auto;\n  margin-bottom: 10px;\n"]))),d.ZP.div(L||(L=(0,s.Z)(["\n  display: flex;\n  flex-flow: row;\n  align-items: center;\n  padding: 5px;\n  justify-content: space-around;\n  background-color: ",";\n"])),(e=>e.even?"#F7F7F7":"inherit")),d.ZP.div(N||(N=(0,s.Z)(["\n  display: flex;\n  flex-flow: row;\n  align-items: center;\n  padding-bottom: 10px;\n  justify-content: ",";\n  width: ",";\n  background-color: ",";\n"])),(e=>e.justifyContent||"space-between"),(e=>e.width||"inherit"),(e=>e.even?"#F7F7F7":"inherit")),d.ZP.div(P||(P=(0,s.Z)(["\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  justify-items: center;\n  align-items: center;\n  background-color: ",";\n"])),(e=>e.even?"#F7F7F7":"inherit")),d.ZP.option(C||(C=(0,s.Z)(["\n  font-weight: 700;\n"]))),d.ZP.select(I||(I=(0,s.Z)(["\n  font-weight: 700;\n  width: 80px;\n  padding: 3px;\n  border-radius: 3px;\n  background-color: transparent;\n"])));var _,T,A,H,S,O;const B="#d3d3d3";d.ZP.div(_||(_=(0,s.Z)(["\n  display: flex;\n  justify-content: space-evenly;\n"]))),d.ZP.div(T||(T=(0,s.Z)(["\n  align-self: start;\n  justify-content: space-evenly;\n  width: 100%;\n"]))),d.ZP.div(A||(A=(0,s.Z)(["\n  display: flex;\n  opacity: 60%;\n  justify-content: center;\n  font-size: 14px;\n  height: 20px;\n  overflow: hidden;\n"]))),d.ZP.a(H||(H=(0,s.Z)(["\n  color: #007079;\n  &:hover {\n    color: #004f55;\n    font-weight: bold;\n  }\n"]))),d.ZP.div(S||(S=(0,s.Z)(["\n  margin-top: 0;\n  margin-right: 15px;\n"])));d.ZP.div(O||(O=(0,s.Z)(["\n  padding: 5px 10px;\n  text-align: center;\n  width: 100%;\n  border-bottom: ",";\n  &:hover {\n    background: ",";\n    cursor: pointer;\n  }\n"])),(e=>1==e.active?"2px #017078FF solid":"2px #d3d3d3 solid"),B);"http://localhost".replace(/\/+$/,"");class M extends Error{constructor(e,n){super(n),this.name="RequiredError",this.field=e}}let D;!function(e){e.Registered="registered",e.Starting="starting",e.Waiting="Waiting",e.Running="running",e.Failed="failed",e.Completed="completed",e.Removed="removed",e.Unknown="unknown"}(D||(D={}));var F,j=t(1691);y.J.add({close:w.xvD});const U=d.ZP.div(F||(F=(0,s.Z)(["\n  &:hover {\n    color: gray;\n    cursor: pointer;\n  }\n"]))),z=e=>{const{closeScrim:n,isOpen:t,children:r,header:o,width:a,height:i}=e;return m.createElement(j.V,{isDismissable:!0,open:t,onClose:n,style:{width:a||"100%",height:i||"100%",overflow:"auto"}},m.createElement("div",{style:{display:"flex",flexDirection:"column"}},m.createElement("div",{style:{display:"flex",justifyContent:"space-between",borderBottom:"#E6E6E6 1px solid",paddingTop:"10px"}},m.createElement("h3",{style:{paddingLeft:"20px"}},o),m.createElement(U,{style:{float:"right",paddingRight:"20px"},onClick:n},m.createElement(y.J,{name:"close",size:24,title:"Close"}))),r))};var W;d.ZP.div(W||(W=(0,s.Z)(["\n  display: flex;\n  flex-direction: column;\n  justifycontent: space-between;\n  margin: 20px;\n  & > * {\n    padding-top: 8px;\n  }\n"])));var q=t(3727);t(4155);const G=["domain-developer","domain-expert","dmss-admin"],J=["expert-operator",...G],K=["operator",...J];var V,$,Q,Y,X,ee;y.J.add({grid_on:w.bQl,info_circle:w.Oi_,account_circle:w.S59});d.ZP.div(V||(V=(0,s.Z)(["\n  display: flex;\n  align-items: center;\n  flex-direction: row-reverse;\n\n  > * {\n    margin-left: 40px;\n  }\n"]))),d.ZP.div($||($=(0,s.Z)(["\n  position: absolute;\n  top: 60px;\n  left: 0;\n  min-width: 300px;\n  max-width: 300px;\n  background: #ffffff;\n  border: 1px solid gray;\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: row;\n  padding: 10px;\n  width: min-content;\n"]))),d.ZP.div(Q||(Q=(0,s.Z)(["\n  border: 3px solid grey;\n  padding: 8px;\n  margin: 5px;\n  height: 80px;\n  width: 80px;\n  background: #b3dae0;\n  color: black;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n\n  &:hover {\n    background: #4f878d;\n  }\n"]))),d.ZP.div(Y||(Y=(0,s.Z)(["\n  &:hover {\n    color: gray;\n    cursor: pointer;\n  }\n"]))),d.ZP.ul(X||(X=(0,s.Z)(["\n  margin: 0;\n  padding: 0;\n  list-style-type: none;\n  display: inline-flex;\n"]))),(0,d.ZP)(q.rU)(ee||(ee=(0,s.Z)(["\n  text-decoration: none;\n  color: black;\n\n  &:focus,\n  &:hover {\n    text-decoration: none;\n    color: black;\n  }\n\n  &:visited,\n  &:link,\n  &:active {\n    text-decoration: none;\n  }\n"])));var ne=t(8266);const te=e=>{const{columns:n,rows:t}=e,r=e.onRowClicked?e.onRowClicked:e=>document.location=e.target.parentElement.accessKey,o=(e=>{const n=[];return e.forEach((e=>{n.push({name:e,accessor:e.replace(/ /g,"")})})),n})(n),a=["_id","index","url"];return m.createElement(m.Fragment,null,m.createElement(ne.i,{style:{width:"100%"}},m.createElement(ne.i.Head,{sticky:!0},m.createElement(ne.i.Row,null,o.map((e=>m.createElement(ne.i.Cell,{key:"head-"+e.accessor},e.name))))),m.createElement(ne.i.Body,{onClick:r,style:{cursor:"pointer"}},null==t?void 0:t.map(((e,n)=>m.createElement(ne.i.Row,{key:e._id,id:e._id,tabIndex:e.index||n,accessKey:e.url||e._id},Object.keys(e).filter((e=>!a.includes(e))).map((n=>m.createElement(ne.i.Cell,{key:n},e[n])))))))))};var re=t(5042);const oe=()=>m.createElement("div",{style:{alignSelf:"center",padding:"50px"}},m.createElement(re.D,null));let ae;!function(e){e[e.UI=0]="UI",e[e.PAGE=1]="PAGE"}(ae||(ae={}));t(107);let ie,le;u.ATTRIBUTE,u.PACKAGE,u.ATTRIBUTE;ie=Symbol.iterator;le=Symbol.iterator;var ce,se;d.ZP.div(ce||(ce=(0,s.Z)(["\n  margin: 0 3px;\n  width: 15px;\n"]))),d.ZP.div(se||(se=(0,s.Z)(["\n  align-items: center;\n  display: flex;\n  padding-left: ","px;\n  cursor: pointer;\n  width: -webkit-fill-available;\n  &:hover {\n    background-color: #acb7da;\n  }\n"])),(e=>20*e.level));class de extends m.Component{constructor(e){super(e),this.fallBack=()=>React.createElement("h4",{style:{color:"red"}},"This component crashed..."),this.fallBack=e.fallBack,this.state={hasError:!1}}static getDerivedStateFromError(){return{hasError:!0}}render(){return this.state.hasError?this.fallBack():this.props.children}}}}]);