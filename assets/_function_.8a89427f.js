import{c as H,a as F,_ as P,d as S,t as p,b as _}from"./See.b1472147.js";import{d as j,h as m,$ as q,E as I,o as t,c as n,b as D,q as s,a as u,x as K,m as i,t as l,F as o,s as y,u as z,e as G,f as J}from"./index.f650e9fa.js";import{m as E,_ as O}from"./markdown.98ad4b60.js";import{u as Q}from"./ReducedMotion.e77432a3.js";const U={class:"mx-auto py-16 px-4 sm:px-8 lg:py-8 w-full"},W={class:"prose prose-discord dark:prose-light break-words-legacy mx-auto max-w-4xl lg:max-w-full"},X=["id"],Y=["innerHTML"],Z=u("h2",null,"Parameters",-1),ee=u("h2",null,"Returns",-1),se={key:0},te={class:"mt-3"},re=["innerHTML"],ce=j({setup(ae){var k,h;const f=z(),d=G(),R=J(),c=m(()=>R.state.docs),e=(h=(k=c.value)==null?void 0:k.functions)==null?void 0:h.find(r=>r.name===d.params.function),N=m(()=>E(H(e==null?void 0:e.description,c.value,f,d))),V=m(()=>{var r;return E(H((r=e.returns.description)!=null?r:e.returnsDescription,c.value,f,d))});return q({title:m(()=>{var r;return`discord.js | ${(r=e==null?void 0:e.name)!=null?r:""}`})}),I(()=>{const r=document.getElementById("container");r&&r.scrollTop>200&&r.scrollTo({top:0,behavior:Q.value?void 0:"smooth"})}),(r,ne)=>{var v,b,g,x,$,L,T,A,M,w;const C=S;return t(),n("div",U,[D(O,{class:"float-right mt-2",meta:(v=s(e))==null?void 0:v.meta},null,8,["meta"]),u("div",W,[u("h1",{id:`doc-for-${(b=s(e))==null?void 0:b.name}`},K((g=s(e))==null?void 0:g.name),9,X),(x=s(e))!=null&&x.description?(t(),n("p",{key:0,innerHTML:s(N)},null,8,Y)):i("",!0),(L=($=s(e))==null?void 0:$.see)!=null&&L.length?(t(),l(F,{key:1,see:(T=s(e))==null?void 0:T.see},null,8,["see"])):i("",!0),((A=s(e))==null?void 0:A.params)&&((M=s(e))==null?void 0:M.params.length)?(t(),n(o,{key:2},[Z,D(P,{parameters:s(e).params},null,8,["parameters"])],64)):i("",!0),(w=s(e))!=null&&w.returns?(t(),n(o,{key:3},[ee,s(e).returns&&Array.isArray(s(e).returns)?(t(),n("span",se,[s(c).meta.format>=30?(t(),n(o,{key:0},[Array.isArray(s(e).returns[0])?(t(!0),n(o,{key:0},y(s(e).returns.flat(),a=>(t(),l(_,{key:s(p)(a),names:a},null,8,["names"]))),128)):(t(!0),n(o,{key:1},y(s(e).returns.flat(),a=>{var B;return t(),l(_,{key:s(p)(a),names:(B=a.types)==null?void 0:B.flat(),variable:a.variable,nullable:a.nullable},null,8,["names","variable","nullable"])}),128))],64)):(t(!0),n(o,{key:1},y(s(e).returns,a=>(t(),l(_,{key:s(p)(a),names:a},null,8,["names"]))),128))])):(t(),l(C,{key:1,type:["void"]})),u("div",te,[s(e).returns&&!Array.isArray(s(e).returns)&&s(e).returns.description||s(e).returnsDescription?(t(),n("p",{key:0,class:"noprose",innerHTML:s(V)},null,8,re)):i("",!0)])],64)):i("",!0)])])}}});export{ce as default};
