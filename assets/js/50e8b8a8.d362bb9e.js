"use strict";(self.webpackChunkdevelopment_framework_docs=self.webpackChunkdevelopment_framework_docs||[]).push([[45],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>m});var i=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=i.createContext({}),u=function(e){var t=i.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=u(e.components);return i.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},c=i.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,s=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),c=u(n),m=a,f=c["".concat(s,".").concat(m)]||c[m]||p[m]||r;return n?i.createElement(f,o(o({ref:t},d),{},{components:n})):i.createElement(f,o({ref:t},d))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,o=new Array(r);o[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var u=2;u<r;u++)o[u]=n[u];return i.createElement.apply(null,o)}return i.createElement.apply(null,n)}c.displayName="MDXCreateElement"},461:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>p,frontMatter:()=>r,metadata:()=>l,toc:()=>u});var i=n(7462),a=(n(7294),n(3905));const r={title:"Configuration",sidebar_position:3},o=void 0,l={unversionedId:"guides/administration/configuration",id:"guides/administration/configuration",title:"Configuration",description:"This document goes through all the different configuration options available.",source:"@site/docs/guides/administration/configuration.md",sourceDirName:"guides/administration",slug:"/guides/administration/configuration",permalink:"/data-modelling-tool/docs/guides/administration/configuration",draft:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{title:"Configuration",sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Administration",permalink:"/data-modelling-tool/docs/guides/administration/"},next:{title:"Deployment",permalink:"/data-modelling-tool/docs/guides/administration/deployment"}},s={},u=[{value:".env",id:"env",level:2},{value:"Web settings",id:"web-settings",level:2},{value:"Authentication",id:"authentication",level:3},{value:"API settings",id:"api-settings",level:2},{value:"System",id:"system",level:3},{value:"Database",id:"database",level:3},{value:"Authentication",id:"authentication-1",level:3}],d={toc:u};function p(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,i.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"This document goes through all the different configuration options available."),(0,a.kt)("h2",{id:"env"},".env"),(0,a.kt)("p",null,"First, let's look at the options available in the ",(0,a.kt)("inlineCode",{parentName:"p"},".env")," file."),(0,a.kt)("admonition",{type:"info"},(0,a.kt)("p",{parentName:"admonition"},"Remember to restart. "),(0,a.kt)("p",{parentName:"admonition"},"Any changes you make to this file will only come into effect when you restart the\nserver.")),(0,a.kt)("h2",{id:"web-settings"},"Web settings"),(0,a.kt)("h3",{id:"authentication"},"Authentication"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"AUTH_ENABLED"),": To enable or disable authentication"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"CLIENT_ID"),": Find the app's client ID under Azure Active Directory service (also called application ID). The client ID is used to tell Azure which resource a user is attempting to access."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"TENANT_ID"),": Find tenant ID through the Azure portal under Azure Active Directory service. Select properties and under  scroll down to the Tenant ID field."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"AUTH_SCOPE"),": TODO")),(0,a.kt)("h2",{id:"api-settings"},"API settings"),(0,a.kt)("h3",{id:"system"},"System"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"ENVIRONMENT"),": local for hot-reloading, or ..."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"LOGGER_LEVEL"),": DEBUG, ERROR, INFO, WARN")),(0,a.kt)("h3",{id:"database"},"Database"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"MONGODB_USERNAME"),": The username"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"MONGODB_PASSWORD"),": The password"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"MONGODB_HOSTNAME"),": The host where it's running"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"MONGODB_DATABASE"),": The database to connect to"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"MONGODB_PORT"),": The port that is used")),(0,a.kt)("h3",{id:"authentication-1"},"Authentication"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"OAUTH_TOKEN_ENDPOINT"),": The endpoint to obtain tokens."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"OAUTH_AUTH_ENDPOINT"),": The authorization endpoint performs authentication of the end-user (this is done by redirecting the user agent to this endpoint)."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"OAUTH_WELL_KNOWN"),": The endpoints that lists endpoints and other configuration options relevant to the OpenID Connect implementation in the project."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"OAUTH_AUDIENCE"),": If using azure ad, audience is the azure client id."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"SECRET_KEY"),": The secret used for signing JWT.")))}p.isMDXComponent=!0}}]);