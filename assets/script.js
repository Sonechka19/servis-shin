"use strict";
const menu = document.querySelector('.menu-toggle');
const mobile = document.querySelector('#mobile-nav');
function closeMenu(){ mobile.hidden=true; menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Открыть меню'); }
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';mobile.hidden=expanded;menu.setAttribute('aria-expanded',String(!expanded));menu.setAttribute('aria-label',expanded?'Открыть меню':'Закрыть меню');});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobile.hidden){closeMenu();menu.focus();}});
window.matchMedia('(min-width: 1001px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
const size=document.querySelector('#wheel-size');
if(size){let mode='without';const prices={without:[2900,3200,3500,4000],with:[2200,2400,2700,3000]};const buttons=document.querySelectorAll('[data-mode]');function update(){document.querySelector('#season-price').textContent=prices[mode][Number(size.value)].toLocaleString('ru-RU');document.querySelector('#season-summary').textContent=(mode==='without'?'Шины без дисков':'Колёса с дисками')+' · '+size.options[size.selectedIndex].text;document.querySelector('#mount-item').hidden=mode==='with';buttons.forEach(b=>{b.classList.toggle('selected',b.dataset.mode===mode);b.setAttribute('aria-pressed',String(b.dataset.mode===mode));});}buttons.forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;update();}));size.addEventListener('change',update);update();}


// EMAILJS: paste the three dashboard values here. Never use a private key.
const EMAILJS_CONFIG = {
  publicKey: 'UoI8hHVCTgCXfkDep',
  serviceId: 'service_uw4j14i',
  templateId: 'template_acy9n86'
};

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const submitButton = document.querySelector('#feedback-submit');
  const buttonLabel = submitButton.querySelector('.feedback-button-label');
  const status = document.querySelector('#form-status');
  const configured = Object.values(EMAILJS_CONFIG).every(value => value.trim());
  let sdkPromise;
  function loadEmailJS() {
    if (!sdkPromise) {
      sdkPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@5/dist/email.min.js';
        script.onload = () => {
          if (!window.emailjs) { script.remove(); reject(new Error('SDK unavailable')); return; }
          window.emailjs.init({publicKey: EMAILJS_CONFIG.publicKey});
          resolve(window.emailjs);
        };
        script.onerror = () => { script.remove(); reject(new Error('SDK load failed')); };
        document.head.appendChild(script);
      }).catch(error => { sdkPromise = undefined; throw error; });
    }
    return sdkPromise;
  }
  submitButton.disabled = false;
  if (configured) document.querySelector('#form-note').textContent = 'Сообщение будет отправлено на почту для обратной связи. Запись на время подтверждается отдельно по телефону.';
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitButton.disabled) return;
    if (!contactForm.reportValidity()) return;
    status.dataset.state = 'error';
    if (!configured) {
      status.textContent = 'Отправка пока не настроена. Сообщение никуда не отправлено. Пожалуйста, свяжитесь с нами по телефону.';
      return;
    }
    if (!contactForm.elements.user_name.value.trim() || !contactForm.elements.message.value.trim()) {
      status.textContent = 'Введите имя и сообщение: поля не должны состоять только из пробелов.';
      return;
    }
    submitButton.disabled = true;
    contactForm.setAttribute('aria-busy', 'true');
    buttonLabel.textContent = 'Отправляем…';
    status.dataset.state = 'pending';
    status.textContent = 'Пожалуйста, дождитесь результата отправки.';
    try {
      const emailjs = await loadEmailJS();
      await emailjs.sendForm(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, contactForm);
      status.dataset.state = 'success';
      status.textContent = 'Сообщение отправлено. Спасибо за обращение!';
      contactForm.reset();
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = 'Не удалось отправить сообщение. Проверьте подключение и попробуйте ещё раз или позвоните нам. Введённый текст сохранён в форме.';
      console.error('EmailJS sending failed:', error);
    } finally {
      submitButton.disabled = false;
      contactForm.removeAttribute('aria-busy');
      buttonLabel.textContent = 'Отправить сообщение';
    }
  });
}
