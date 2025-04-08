function V(e,t){for(var r=0;r<t.length;r++){const o=t[r];if(typeof o!="string"&&!Array.isArray(o)){for(const u in o)if(u!=="default"&&!(u in e)){const c=Object.getOwnPropertyDescriptor(o,u);c&&Object.defineProperty(e,u,c.get?c:{enumerable:!0,get:()=>o[u]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}var ee=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function F(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var k={exports:{}},n={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var y=Symbol.for("react.element"),M=Symbol.for("react.portal"),U=Symbol.for("react.fragment"),q=Symbol.for("react.strict_mode"),L=Symbol.for("react.profiler"),N=Symbol.for("react.provider"),z=Symbol.for("react.context"),B=Symbol.for("react.forward_ref"),H=Symbol.for("react.suspense"),G=Symbol.for("react.memo"),W=Symbol.for("react.lazy"),w=Symbol.iterator;function J(e){return e===null||typeof e!="object"?null:(e=w&&e[w]||e["@@iterator"],typeof e=="function"?e:null)}var O={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},$=Object.assign,C={};function p(e,t,r){this.props=e,this.context=t,this.refs=C,this.updater=r||O}p.prototype.isReactComponent={};p.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};p.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function P(){}P.prototype=p.prototype;function m(e,t,r){this.props=e,this.context=t,this.refs=C,this.updater=r||O}var S=m.prototype=new P;S.constructor=m;$(S,p.prototype);S.isPureReactComponent=!0;var E=Array.isArray,x=Object.prototype.hasOwnProperty,b={current:null},I={key:!0,ref:!0,__self:!0,__source:!0};function T(e,t,r){var o,u={},c=null,s=null;if(t!=null)for(o in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(c=""+t.key),t)x.call(t,o)&&!I.hasOwnProperty(o)&&(u[o]=t[o]);var f=arguments.length-2;if(f===1)u.children=r;else if(1<f){for(var i=Array(f),a=0;a<f;a++)i[a]=arguments[a+2];u.children=i}if(e&&e.defaultProps)for(o in f=e.defaultProps,f)u[o]===void 0&&(u[o]=f[o]);return{$$typeof:y,type:e,key:c,ref:s,props:u,_owner:b.current}}function K(e,t){return{$$typeof:y,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function g(e){return typeof e=="object"&&e!==null&&e.$$typeof===y}function Q(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(r){return t[r]})}var R=/\/+/g;function v(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Q(""+e.key):t.toString(36)}function _(e,t,r,o,u){var c=typeof e;(c==="undefined"||c==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(c){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case y:case M:s=!0}}if(s)return s=e,u=u(s),e=o===""?"."+v(s,0):o,E(u)?(r="",e!=null&&(r=e.replace(R,"$&/")+"/"),_(u,t,r,"",function(a){return a})):u!=null&&(g(u)&&(u=K(u,r+(!u.key||s&&s.key===u.key?"":(""+u.key).replace(R,"$&/")+"/")+e)),t.push(u)),1;if(s=0,o=o===""?".":o+":",E(e))for(var f=0;f<e.length;f++){c=e[f];var i=o+v(c,f);s+=_(c,t,r,i,u)}else if(i=J(e),typeof i=="function")for(e=i.call(e),f=0;!(c=e.next()).done;)c=c.value,i=o+v(c,f++),s+=_(c,t,r,i,u);else if(c==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function d(e,t,r){if(e==null)return e;var o=[],u=0;return _(e,o,"","",function(c){return t.call(r,c,u++)}),o}function X(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(r){(e._status===0||e._status===-1)&&(e._status=1,e._result=r)},function(r){(e._status===0||e._status===-1)&&(e._status=2,e._result=r)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var l={current:null},h={transition:null},Y={ReactCurrentDispatcher:l,ReactCurrentBatchConfig:h,ReactCurrentOwner:b};function A(){throw Error("act(...) is not supported in production builds of React.")}n.Children={map:d,forEach:function(e,t,r){d(e,function(){t.apply(this,arguments)},r)},count:function(e){var t=0;return d(e,function(){t++}),t},toArray:function(e){return d(e,function(t){return t})||[]},only:function(e){if(!g(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};n.Component=p;n.Fragment=U;n.Profiler=L;n.PureComponent=m;n.StrictMode=q;n.Suspense=H;n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Y;n.act=A;n.cloneElement=function(e,t,r){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var o=$({},e.props),u=e.key,c=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(c=t.ref,s=b.current),t.key!==void 0&&(u=""+t.key),e.type&&e.type.defaultProps)var f=e.type.defaultProps;for(i in t)x.call(t,i)&&!I.hasOwnProperty(i)&&(o[i]=t[i]===void 0&&f!==void 0?f[i]:t[i])}var i=arguments.length-2;if(i===1)o.children=r;else if(1<i){f=Array(i);for(var a=0;a<i;a++)f[a]=arguments[a+2];o.children=f}return{$$typeof:y,type:e.type,key:u,ref:c,props:o,_owner:s}};n.createContext=function(e){return e={$$typeof:z,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:N,_context:e},e.Consumer=e};n.createElement=T;n.createFactory=function(e){var t=T.bind(null,e);return t.type=e,t};n.createRef=function(){return{current:null}};n.forwardRef=function(e){return{$$typeof:B,render:e}};n.isValidElement=g;n.lazy=function(e){return{$$typeof:W,_payload:{_status:-1,_result:e},_init:X}};n.memo=function(e,t){return{$$typeof:G,type:e,compare:t===void 0?null:t}};n.startTransition=function(e){var t=h.transition;h.transition={};try{e()}finally{h.transition=t}};n.unstable_act=A;n.useCallback=function(e,t){return l.current.useCallback(e,t)};n.useContext=function(e){return l.current.useContext(e)};n.useDebugValue=function(){};n.useDeferredValue=function(e){return l.current.useDeferredValue(e)};n.useEffect=function(e,t){return l.current.useEffect(e,t)};n.useId=function(){return l.current.useId()};n.useImperativeHandle=function(e,t,r){return l.current.useImperativeHandle(e,t,r)};n.useInsertionEffect=function(e,t){return l.current.useInsertionEffect(e,t)};n.useLayoutEffect=function(e,t){return l.current.useLayoutEffect(e,t)};n.useMemo=function(e,t){return l.current.useMemo(e,t)};n.useReducer=function(e,t,r){return l.current.useReducer(e,t,r)};n.useRef=function(e){return l.current.useRef(e)};n.useState=function(e){return l.current.useState(e)};n.useSyncExternalStore=function(e,t,r){return l.current.useSyncExternalStore(e,t,r)};n.useTransition=function(){return l.current.useTransition()};n.version="18.3.1";k.exports=n;var D=k.exports;const Z=F(D),te=V({__proto__:null,default:Z},[D]);function j(){return j=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)({}).hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},j.apply(null,arguments)}export{te as R,j as _,Z as a,ee as c,F as g,D as r};
