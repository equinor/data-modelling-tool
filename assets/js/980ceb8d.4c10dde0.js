"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[906],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>m});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},l=Object.keys(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,l=e.originalType,s=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),d=u(r),m=o,g=d["".concat(s,".").concat(m)]||d[m]||c[m]||l;return r?n.createElement(g,i(i({ref:t},p),{},{components:r})):n.createElement(g,i({ref:t},p))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var l=r.length,i=new Array(l);i[0]=d;var a={};for(var s in t)hasOwnProperty.call(t,s)&&(a[s]=t[s]);a.originalType=e,a.mdxType="string"==typeof e?e:o,i[1]=a;for(var u=2;u<l;u++)i[u]=r[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},999:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>c,frontMatter:()=>l,metadata:()=>a,toc:()=>u});var n=r(7462),o=(r(7294),r(3905));const l={title:"Core development",slug:"./"},i=void 0,a={unversionedId:"guides/development/index",id:"guides/development/index",title:"Core development",description:"This page explains how to get DMT running on a local system for development or testing.",source:"@site/docs/guides/development/index.md",sourceDirName:"guides/development",slug:"/guides/development/",permalink:"/data-modelling-tool/docs/guides/development/",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/guides/development/index.md",tags:[],version:"current",frontMatter:{title:"Core development",slug:"./"},sidebar:"tutorialSidebar",previous:{title:"Deployment",permalink:"/data-modelling-tool/docs/guides/administration/deployment"},next:{title:"Initial Setup",permalink:"/data-modelling-tool/docs/guides/development/initial-setup"}},s={},u=[{value:"What you&#39;ll need",id:"what-youll-need",level:3},{value:"Repositories",id:"repositories",level:2}],p={toc:u};function c(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"This page explains how to get DMT running on a local system for development or testing."),(0,o.kt)("h3",{id:"what-youll-need"},"What you'll need"),(0,o.kt)("p",null,"In order to run DMT you need to have installed:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://www.docker.com/"},"Docker")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.docker.com/compose/"},"Docker Compose")),(0,o.kt)("li",{parentName:"ul"},"Git"),(0,o.kt)("li",{parentName:"ul"},"Make sure you have Python installed. version 3.10 or higher is required.")),(0,o.kt)("h2",{id:"repositories"},"Repositories"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/equinor/data-modelling-tool"},"https://github.com/equinor/data-modelling-tool")," - The Data Modelling Tool"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/equinor/data-modelling-storage-service"},"https://github.com/equinor/data-modelling-storage-service")," - Storage Service for documents")))}c.isMDXComponent=!0}}]);