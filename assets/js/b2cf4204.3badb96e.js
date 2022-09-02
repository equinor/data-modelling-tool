"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[757],{3905:(e,t,r)=>{r.d(t,{Zo:()=>d,kt:()=>m});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},i=Object.keys(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var s=a.createContext({}),l=function(e){var t=a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},d=function(e){var t=l(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,s=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),p=l(r),m=n,h=p["".concat(s,".").concat(m)]||p[m]||u[m]||i;return r?a.createElement(h,o(o({ref:t},d),{},{components:r})):a.createElement(h,o({ref:t},d))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,o=new Array(i);o[0]=p;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:n,o[1]=c;for(var l=2;l<i;l++)o[l]=r[l];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}p.displayName="MDXCreateElement"},3128:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>c,toc:()=>l});var a=r(7462),n=(r(7294),r(3905));const i={title:"Architecture",slug:"./"},o=void 0,c={unversionedId:"guides/development/architecture/architecture",id:"guides/development/architecture/architecture",title:"Architecture",description:"This is a short canned synopsis of architecture.",source:"@site/docs/guides/development/architecture/architecture.md",sourceDirName:"guides/development/architecture",slug:"/guides/development/architecture/",permalink:"/data-modelling-tool/docs/guides/development/architecture/",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/guides/development/architecture/architecture.md",tags:[],version:"current",frontMatter:{title:"Architecture",slug:"./"},sidebar:"tutorialSidebar",previous:{title:"Running",permalink:"/data-modelling-tool/docs/guides/development/running"},next:{title:"Authentication and Authorization",permalink:"/data-modelling-tool/docs/guides/development/architecture/authentication"}},s={},l=[{value:"Architecture Overview",id:"architecture-overview",level:2},{value:"Architecture Diagrams",id:"architecture-diagrams",level:2},{value:"Level 1 - System Context diagram",id:"level-1---system-context-diagram",level:3},{value:"Level 2 - Container diagram",id:"level-2---container-diagram",level:3}],d={toc:l};function u(e){let{components:t,...i}=e;return(0,n.kt)("wrapper",(0,a.Z)({},d,i,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"This is a short canned synopsis of architecture."),(0,n.kt)("p",null,"We follow the Clean Architecture style and structure the codebase accordingly the API."),(0,n.kt)("h2",{id:"architecture-overview"},"Architecture Overview"),(0,n.kt)("p",null,"The long term goal of Data Modelling Tool is to have a federated, standardized, and well defined StorageService that can handle the storing and retrieving of data of different nature and requirements."),(0,n.kt)("p",null,"For this to work, we need some components with responsibility of different layers of abstraction. All these components will need to support basic CRUD (crate, read, update, delete) functionality."),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"Context diagram",src:r(8567).Z,width:"911",height:"501"})),(0,n.kt)("p",null,(0,n.kt)("em",{parentName:"p"},"DocumentService (Data Modelling Storage Service):")),(0,n.kt)("p",null,"The Data Modelling Storage Service will get requests like ",(0,n.kt)("inlineCode",{parentName:"p"},"Fetch document with id 8962045 from the Data Source A"),".\nThis can be a complex document, containing references to documents in different DataSources. It will then be Data Modelling Storage Service's job to construct this document in it's entirety."),(0,n.kt)("p",null,(0,n.kt)("em",{parentName:"p"},"DataSource:")),(0,n.kt)("p",null,'The DataSource, and components to the left of the DataSource, are the "self-hosted" components. Different organizations can setup their own DataSource, which they can control access to.\nThe job of the DataSource is to determine which storage backend (Repository) should be used for the data.\nHere, there are no complex documents, but the DataSource will make choices based on the StorageRecipe tied to the data.\nRequests coming into the DataSource will look something like this; ',(0,n.kt)("inlineCode",{parentName:"p"},"Fetch document with id 8962045"),"."),(0,n.kt)("p",null,(0,n.kt)("em",{parentName:"p"},"Repository:")),(0,n.kt)("p",null,"This is a plugin based component, that has one interface towards the DataSource, and one to the given storage driver(MongoDB, Postgress, AzureFiles, e.g.)"),(0,n.kt)("h2",{id:"architecture-diagrams"},"Architecture Diagrams"),(0,n.kt)("p",null,"We are using ",(0,n.kt)("a",{parentName:"p",href:"https://c4model.com"},"https://c4model.com")," for showing architecture diagrams."),(0,n.kt)("h3",{id:"level-1---system-context-diagram"},"Level 1 - System Context diagram"),(0,n.kt)("p",null,"The Context diagram is a good starting point for diagramming and documenting a software system, allowing you to step back and see the big picture. Here we draw a diagram showing the system as a box in the centre, surrounded by its users and the other systems that it interacts with."),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"Context diagram",src:r(2081).Z,width:"699",height:"908"})),(0,n.kt)("h3",{id:"level-2---container-diagram"},"Level 2 - Container diagram"),(0,n.kt)("p",null,"Once you understand how your system fits in to the overall IT environment, a really useful next step is to zoom-in to the system boundary with a Container diagram. A container is something like a server-side web application, single-page application, desktop application, mobile app, database schema, file system, etc. Essentially, a container is a separately runnable/deployable unit (e.g. a separate process space) that executes code or stores data."),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"Context diagram",src:r(2698).Z,width:"699",height:"1151"})),(0,n.kt)("p",null,"Next is to setup dedicated data sources."),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"Context diagram",src:r(8655).Z,width:"701",height:"1038"})))}u.isMDXComponent=!0},8567:(e,t,r)=>{r.d(t,{Z:()=>a});const a=r.p+"assets/images/architecture-b4cf6828731b4facebc6f67535acb8f2.png"},8655:(e,t,r)=>{r.d(t,{Z:()=>a});const a=r.p+"assets/images/container-diagram-v2-afcf96ba166eecb998c525531bab642e.png"},2698:(e,t,r)=>{r.d(t,{Z:()=>a});const a=r.p+"assets/images/container-digram-5c585daa46a7ae60f4e1dec865b28e35.png"},2081:(e,t,r)=>{r.d(t,{Z:()=>a});const a=r.p+"assets/images/context-digram-6e6e99195f88976d67156376fc214007.png"}}]);