!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=142)}({139:function(e,t,n){"use strict";function r(e){return"^"+e.replace(/[.]/g,"\\.").replace(/[?]/,".").replace(/^[*]:/,"https?").replace(/^(https[?]?:[/][/])[*]/,"$1[^/:]+").replace(/[/][*]/,"/?.+").replace(/[*]/g,".+").replace(/[/]/g,"\\/")}async function o(e,...t){return new Promise((n,r)=>{e(...t,e=>{chrome.runtime.lastError?r(chrome.runtime.lastError):n(e)})})}chrome.contentScripts||(chrome.contentScripts={async register(e,t){const{js:n=[],css:s=[],allFrames:i,matchAboutBlank:c,matches:a,runAt:m}=e,u=`document[${JSON.stringify(JSON.stringify({js:n,css:s}))}]`,d=new RegExp(a.map(r).join("$")+"$"),l=async(e,{status:t})=>{if("loading"!==t)return;const{url:r}=await o(chrome.tabs.get,e);if(r&&d.test(r)&&await async function(e){return o(chrome.permissions.contains,{origins:[new URL(e).origin+"/*"]})}(r)&&!await async function(e,t){const n=await o(chrome.tabs.executeScript,e,{code:t,runAt:"document_start"});return n&&n[0]}(e,u)){for(const t of s)chrome.tabs.insertCSS(e,{...t,matchAboutBlank:c,allFrames:i,runAt:m||"document_start"});for(const t of n)chrome.tabs.executeScript(e,{...t,matchAboutBlank:c,allFrames:i,runAt:m});chrome.tabs.executeScript(e,{code:u+" = true",runAt:"document_start",allFrames:i})}};chrome.tabs.onUpdated.addListener(l);const p={unregister:async()=>o(chrome.tabs.onUpdated.removeListener.bind(chrome.tabs.onUpdated),l)};return"function"==typeof t&&t(p),Promise.resolve(p)}})},140:function(e,t,n){"use strict";const r=[["request","onAdded"],["remove","onRemoved"]];if(chrome.permissions&&!chrome.permissions.onAdded)for(const[e,t]of r){const n=chrome.permissions[e],r=new Set;chrome.permissions[t]={addListener(e){r.add(e)}},chrome.permissions[e]=(t,o)=>{const s=browser.permissions.contains(t),i="request"===e;n(t,async e=>{if(o&&o(e),e&&await s!==i){const e={origins:[],permissions:[],...t};chrome.permissions.getAll(()=>{for(const t of r)setTimeout(t,0,e)})}})},browser.permissions[t]=chrome.permissions[t],browser.permissions[e]=async t=>new Promise((n,r)=>{chrome.permissions[e](t,e=>{chrome.runtime.lastError?r(chrome.runtime.lastError):n(e)})})}},142:function(e,t,n){"use strict";n.r(t);n(139),n(140);async function r(){const e=chrome.runtime.getManifest(),t={origins:[],permissions:[]},n=new Set([...e.permissions||[],...(e.content_scripts||[]).flatMap(e=>e.matches||[])]);for(const e of n)e.includes("://")?t.origins.push(e):t.permissions.push(e);return t}const o=new Map;function s(e){return{file:new URL(e,location.origin).pathname}}async function i({origins:e}){const t=chrome.runtime.getManifest().content_scripts;for(const n of e||[])for(const e of t){const t=chrome.contentScripts.register({js:(e.js||[]).map(s),css:(e.css||[]).map(s),allFrames:e.all_frames,matches:[n],runAt:e.run_at});o.set(n,t)}}(async()=>{i(await async function(){const e=await r();return new Promise(t=>{chrome.permissions.getAll(n=>{const r={origins:[],permissions:[]};for(const t of n.origins||[])e.origins.includes(t)||r.origins.push(t);for(const t of n.permissions||[])e.permissions.includes(t)||r.permissions.push(t);t(r)})})}())})(),chrome.permissions.onAdded.addListener(e=>{e.origins&&e.origins.length>0&&i(e)}),chrome.permissions.onRemoved.addListener(async({origins:e})=>{if(e&&0!==e.length)for(const[t,n]of o)e.includes(t)&&(await n).unregister()});const c="webext-domain-permission-toggle:add-permission";let a;async function m(e,...t){return new Promise((n,r)=>{e(...t,e=>{chrome.runtime.lastError?r(chrome.runtime.lastError):n(e)})})}function u({tabId:e}){chrome.tabs.executeScript(e,{code:"location.origin"},async([e]=[])=>{const t={checked:!1,enabled:!0};if(!chrome.runtime.lastError&&e){const n=(await r()).origins.some(t=>t.startsWith(e));t.enabled=!n,t.checked=n||await async function(e){return m(chrome.permissions.contains,{origins:[e+"/*"]})}(e)}chrome.contextMenus.update(c,t)})}async function d({wasChecked:e,menuItemId:t},n){if(t===c&&n)try{const t=await m(e?chrome.permissions.remove:chrome.permissions.request,{origins:[new URL(n.url).origin+"/*"]});e&&t&&chrome.contextMenus.update(c,{checked:!1}),!e&&t&&a.reloadOnSuccess&&chrome.tabs.executeScript({code:`confirm(${JSON.stringify(a.reloadOnSuccess)}) && location.reload()`})}catch(e){console.error(e.message),alert("Error: "+e.message),u({tabId:n.id})}}!function(e){if(a)throw new Error("webext-domain-permission-toggle can only be initialized once");const{name:t}=chrome.runtime.getManifest();a={title:`Enable ${t} on this domain`,reloadOnSuccess:`Do you want to reload this page to apply ${t}?`,...e},chrome.contextMenus.onClicked.addListener(d),chrome.tabs.onActivated.addListener(u),chrome.tabs.onUpdated.addListener((e,{status:t})=>{void 0===e&&"complete"===t&&u({tabId:e})}),chrome.contextMenus.remove(c,()=>chrome.runtime.lastError),chrome.contextMenus.create({id:c,type:"checkbox",checked:!1,title:a.title,contexts:["page_action","browser_action"],documentUrlPatterns:["http://*/*","https://*/*"]})}()}});