"use strict";(self.webpackChunkdevelopment_framework_docs=self.webpackChunkdevelopment_framework_docs||[]).push([[939],{3905:(e,n,t)=>{t.d(n,{Zo:()=>s,kt:()=>g});var i=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,i,r=function(e,n){if(null==e)return{};var t,i,r={},l=Object.keys(e);for(i=0;i<l.length;i++)t=l[i],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(i=0;i<l.length;i++)t=l[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var u=i.createContext({}),p=function(e){var n=i.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},s=function(e){var n=p(e.components);return i.createElement(u.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return i.createElement(i.Fragment,{},n)}},c=i.forwardRef((function(e,n){var t=e.components,r=e.mdxType,l=e.originalType,u=e.parentName,s=a(e,["components","mdxType","originalType","parentName"]),c=p(t),g=r,m=c["".concat(u,".").concat(g)]||c[g]||d[g]||l;return t?i.createElement(m,o(o({ref:n},s),{},{components:t})):i.createElement(m,o({ref:n},s))}));function g(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var l=t.length,o=new Array(l);o[0]=c;var a={};for(var u in n)hasOwnProperty.call(n,u)&&(a[u]=n[u]);a.originalType=e,a.mdxType="string"==typeof e?e:r,o[1]=a;for(var p=2;p<l;p++)o[p]=t[p];return i.createElement.apply(null,o)}return i.createElement.apply(null,t)}c.displayName="MDXCreateElement"},1090:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>o,default:()=>d,frontMatter:()=>l,metadata:()=>a,toc:()=>p});var i=t(7462),r=(t(7294),t(3905));const l={title:"Plugin development",sidebar_position:1},o=void 0,a={unversionedId:"guides/plugin-development",id:"guides/plugin-development",title:"Plugin development",description:"Adding plugins",source:"@site/docs/guides/plugin-development.md",sourceDirName:"guides",slug:"/guides/plugin-development",permalink:"/data-modelling-tool/docs/guides/plugin-development",draft:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Plugin development",sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Guides",permalink:"/data-modelling-tool/docs/guides/"},next:{title:"Administration",permalink:"/data-modelling-tool/docs/guides/administration/"}},u={},p=[{value:"Adding plugins",id:"adding-plugins",level:2},{value:"Creating a new plugins",id:"creating-a-new-plugins",level:2},{value:"Creating a UI plugin",id:"creating-a-ui-plugin",level:3}],s={toc:p};function d(e){let{components:n,...t}=e;return(0,r.kt)("wrapper",(0,i.Z)({},s,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"adding-plugins"},"Adding plugins"),(0,r.kt)("p",null,"Add the custom plugins under the ",(0,r.kt)("inlineCode",{parentName:"p"},"/plugins")," folder like shown here."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"web/\n|_ plugins/\n  |_ a-custom-plugin/\n    |_ package.json\n    |_ src/\n      |_ index.tsx\n|_ plugins.js\n")),(0,r.kt)("p",null,"Add the plugin (package name), e.g a plugin called custom-plugin, into the plugins.js file like this."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"export default [\n    // These are included by default\n    import('@dmt/default-pdf'),\n    import('@dmt/default-preview'),\n    // The extra plugin to be loaded\n    import('custom-plugin')\n  ]\n")),(0,r.kt)("p",null,"Then, build the docker container again, so that the plugin will be installed."),(0,r.kt)("h2",{id:"creating-a-new-plugins"},"Creating a new plugins"),(0,r.kt)("p",null,"You may be looking to build a plugin that doesn\u2019t exist yet, or you may just be curious to know more about the anatomy of a custom plugin (file structure, etc)."),(0,r.kt)("p",null,"A package.json is required."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "name": "@dmt/custom-plugin",\n  "version": "1.0.0",\n  "main": "src/index.tsx",\n  "dependencies": {\n    "@data-modelling-tool/core": "x.x.x"\n  }\n}\n')),(0,r.kt)("h3",{id:"creating-a-ui-plugin"},"Creating a UI plugin"),(0,r.kt)("p",null,"This is the template for a UI plugin."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"import * as React from 'react'\nimport { DmtPluginType, IDmtUIPlugin } from '@data-modelling-tool/core'\n\nexport const pluginName = 'custom-plugin'\nexport const pluginType = DmtPluginType.UI\n\nexport const PluginComponent = (props: IDmtUIPlugin) => {\n  return (\n    <div>\n      Plugin content goes here!\n    </div>\n  )\n}\n")),(0,r.kt)("p",null,"Everything returned from the PluginComponent will be rendered."),(0,r.kt)("p",null,"The UI plugin recipes will use the pluginName in the plugin field, which means that this UI recipe will use that plugin, like this."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "uiRecipes": [\n    {\n      "name": "A custom view",\n      "type": "system/SIMOS/UiRecipe",\n      "description": "This shows a custom view",\n      "plugin": "custom-plugin",\n      "options": [],\n      "attributes": []\n    }\n  ]\n}\n')))}d.isMDXComponent=!0}}]);