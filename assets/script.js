"use strict";
const menu = document.querySelector('.menu-toggle');
const mobile = document.querySelector('#mobile-nav');
function closeMenu(){ mobile.hidden=true; menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Открыть меню'); }
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';mobile.hidden=expanded;menu.setAttribute('aria-expanded',String(!expanded));menu.setAttribute('aria-label',expanded?'Открыть меню':'Закрыть меню');});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobile.hidden){closeMenu();menu.focus();}});
window.matchMedia('(min-width: 1001px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
const size=document.querySelector('#wheel-size');
if(size){let mode='without';const prices={without:[2900,3200,3500,4000],with:[2200,2400,2700,3000]};const buttons=document.querySelectorAll('[data-mode]');function update(){document.querySelector('#season-price').textContent=prices[mode][Number(size.value)].toLocaleString('ru-RU');document.querySelector('#season-summary').textContent=(mode==='without'?'Шины без дисков':'Колёса с дисками')+' · '+size.options[size.selectedIndex].text;document.querySelector('#mount-item').hidden=mode==='with';buttons.forEach(b=>{b.classList.toggle('selected',b.dataset.mode===mode);b.setAttribute('aria-pressed',String(b.dataset.mode===mode));});}buttons.forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;update();}));size.addEventListener('change',update);update();}
