(() => {
  document.querySelectorAll('[data-contact-container]').forEach((container) => {
    container.innerHTML = `<div class="contact-terminal"><div class="terminal-bar"><span></span><span></span><span></span><strong>secure-conversation.sh</strong></div><form novalidate><div class="terminal-prompt"><b>&gt;</b><p>Start a conversation about security, AI, learning or collaboration.</p></div><div class="form-grid"><label>Name<input name="name" required maxlength="80" autocomplete="name"></label><label>Email<input type="email" name="email" required maxlength="160" autocomplete="email"></label></div><label>What would you like to discuss?<select name="topic" required><option value="">Choose a topic</option><option>AI Security opportunity</option><option>SOC Engineering opportunity</option><option>Project collaboration</option><option>Technical discussion</option><option>Other</option></select></label><label>Subject<input name="subject" required maxlength="140"></label><label>Message<textarea name="message" rows="7" required minlength="20" maxlength="4000"></textarea></label><label class="honeypot">Company website<input name="company_website" tabindex="-1" autocomplete="off"></label><input type="hidden" name="source" value="Gurucharan fresh cinematic portfolio"><div class="terminal-actions"><button class="button primary" type="submit">Send secure message</button><a href="mailto:charanmavuduru9273@gmail.com">Use direct email instead</a></div><p class="form-status" aria-live="polite"></p></form></div>`;
    const form=container.querySelector('form'); const status=container.querySelector('.form-status'); const button=container.querySelector('button[type="submit"]');
    const api=window.GC_CONFIG?.portfolioApiUrl || '';
    status.textContent=api.startsWith('https://script.google.com/macros/s/') ? 'New backend ready.' : 'Paste the new Apps Script /exec URL in assets/js/config.js to activate messaging.';
    form.addEventListener('submit',async(event)=>{
      event.preventDefault(); if(!form.reportValidity()) return;
      if(!api.startsWith('https://script.google.com/macros/s/') || !api.endsWith('/exec')) { status.textContent='The new Apps Script URL has not been connected yet.'; return; }
      button.disabled=true; button.textContent='Transmitting…'; status.textContent='Transmitting through the new Apps Script backend…';
      try { await fetch(api,{method:'POST',body:new FormData(form),mode:'no-cors'}); form.reset(); status.textContent='Message transmitted. Check Gmail for delivery.'; }
      catch { status.textContent='Transmission failed. Please use direct email.'; }
      finally { button.disabled=false; button.textContent='Send secure message'; }
    });
  });
})();
