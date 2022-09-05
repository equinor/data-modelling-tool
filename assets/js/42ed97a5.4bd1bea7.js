"use strict";(self.webpackChunkmy_website=self.webpackChunkmy_website||[]).push([[499],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>f});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),p=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},l=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),d=p(r),f=o,m=d["".concat(s,".").concat(f)]||d[f]||u[f]||i;return r?n.createElement(m,a(a({ref:t},l),{},{components:r})):n.createElement(m,a({ref:t},l))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=d;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,a[1]=c;for(var p=2;p<i;p++)a[p]=r[p];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},6306:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>a,default:()=>u,frontMatter:()=>i,metadata:()=>c,toc:()=>p});var n=r(7462),o=(r(7294),r(3905));const i={title:"Recipes",sidebar_position:2},a=void 0,c={unversionedId:"concepts/recipes",id:"concepts/recipes",title:"Recipes",description:"To express how a model is stored and presented, we use a concept of recipes. Every blueprint can have two kind of recipes in the Data Modelling Tool.",source:"@site/docs/concepts/recipes.md",sourceDirName:"concepts",slug:"/concepts/recipes",permalink:"/data-modelling-tool/docs/concepts/recipes",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/concepts/recipes.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Recipes",sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Blueprints",permalink:"/data-modelling-tool/docs/concepts/blueprints"},next:{title:"Plugins",permalink:"/data-modelling-tool/docs/concepts/plugins"}},s={},p=[{value:"Storage Recipe",id:"storage-recipe",level:2},{value:"UI Recipe",id:"ui-recipe",level:2}],l={toc:p};function u(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"To express how a model is stored and presented, we use a concept of recipes. Every blueprint can have two kind of recipes in the Data Modelling Tool."),(0,o.kt)("p",null,"A recipe is just a specific instance of a recipe blueprint, and Libraries, plugins and services can use these recipes to make decisions and therefore become easy to replace."),(0,o.kt)("h2",{id:"storage-recipe"},"Storage Recipe"),(0,o.kt)("p",null,"A recipe for how to store the data for a blueprint."),(0,o.kt)("p",null,"Contained means the value is stored in-place, and all primitives are stored with default contained property. However, if a blueprint is referring to another blueprint, then that blueprint can be stored as own independent entity."),(0,o.kt)("h2",{id:"ui-recipe"},"UI Recipe"),(0,o.kt)("p",null,"A recipe for how to present data."))}u.isMDXComponent=!0}}]);