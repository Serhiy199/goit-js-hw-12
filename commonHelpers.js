import{i as n,S as f}from"./assets/vendor-46aac873.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function r(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerpolicy&&(s.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?s.credentials="include":e.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(e){if(e.ep)return;e.ep=!0;const s=r(e);fetch(e.href,s)}})();const y=new URL("https://pixabay.com/api/"),g="41516646-ec27055f09ddd37d9bfda39a5",L=document.querySelector(".form"),o=document.querySelector(".gallery"),l=document.querySelector("span");L.addEventListener("submit",a=>{a.preventDefault(),o.classList.add("visibility"),l.classList.remove("visibility");const t=a.target.elements.search.value,r=new URLSearchParams({key:g,q:t,image_type:"photo",orientation:"horizontal",safesearch:"true"}),i=`${y}?${r}`;fetch(i).then(e=>{if(!e.ok)throw new Error(e.status);return e.json()}).then(e=>{b(e)}).catch(e=>{l.classList.add("visibility"),n.error({message:`❌ ${e}`,icon:"",position:"topRight"})})});function b(a){const t=a.hits;t.length||n.error({message:"❌ Sorry, there are no images matching your search query. Please, try again!",icon:"",position:"topRight"});const r=new f(".gallery a",{captionsData:"alt",captionDelay:250,captionPosition:"bottom"}),i=t.reduce((e,{webformatURL:s,largeImageURL:c,tags:u,likes:p,views:d,comments:m,downloads:h})=>e+`<li class="gallery-item">
    <a class="gallery-link" href="${c}">
        <img class="gallery-image" src="${s}" alt="${u}"/>
    </a>
    <ul class="characteristics-list">
    <li class="characteristics"><span class="characteristics-titel">Likes</span> <span>${p}</span></li>
    <li class="characteristics"><span class="characteristics-titel">Views</span> <span>${d}</span></li>
    <li class="characteristics"><span class="characteristics-titel">Comments</span> <span>${m}</span></li>
    <li class="characteristics"><span class="characteristics-titel">Downloads</span> <span>${h}</span></li>
</ul>
    
</li>`,"");o.innerHTML=i,r.refresh(),l.classList.add("visibility"),o.classList.remove("visibility")}
//# sourceMappingURL=commonHelpers.js.map
