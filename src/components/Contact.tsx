import { FormEvent, useRef, useState } from 'react';
import { hasLiveBackend, PORTFOLIO_API_URL } from '../config';

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (!hasLiveBackend) {
      event.preventDefault();
      window.location.href =
        'mailto:charanmavuduru9273@gmail.com?subject=Portfolio conversation';
      return;
    }
    setStatus('sending');
    window.setTimeout(() => {
      setStatus('sent');
      form.current?.reset();
    }, 1200);
  };

  return (
    <section id="contact" className="contact section">
      <div className="contact-terminal">
        <div className="terminal-bar">
          <span><i /><i /><i /></span>
          <strong>secure-communication.channel</strong>
          <small>TLS / ACTIVE</small>
        </div>
        <div className="terminal-body">
          <div className="contact-copy">
            <span className="micro-label">06 / ESTABLISH CONNECTION</span>
            <h2>Build, research<br />or learn together.</h2>
            <p>
              I am looking for product-focused opportunities where cybersecurity,
              AI and practical engineering meet.
            </p>
            <div className="contact-links">
              <a href="mailto:charanmavuduru9273@gmail.com">charanmavuduru9273@gmail.com ↗</a>
              <a href="https://www.linkedin.com/in/gurucharanmavuduru" target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href="https://github.com/Sarma9273" target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>

          <form
            ref={form}
            className="contact-form"
            method="POST"
            action={hasLiveBackend ? PORTFOLIO_API_URL : undefined}
            target="contact-response-frame"
            onSubmit={submit}
          >
            <input type="hidden" name="action" value="contact" />
            <input type="hidden" name="source" value="Gurucharan cinematic portfolio" />
            <label>
              <span>01 / Identity</span>
              <input name="name" required placeholder="Your name" />
            </label>
            <label>
              <span>02 / Email channel</span>
              <input name="email" type="email" required placeholder="you@company.com" />
            </label>
            <label>
              <span>03 / Discussion subject</span>
              <input name="subject" required placeholder="Role, research or collaboration" />
            </label>
            <label>
              <span>04 / Transmission</span>
              <textarea name="message" required rows={5} placeholder="Tell me what you would like to discuss." />
            </label>
            <label className="honeypot" aria-hidden="true">
              Website
              <input name="company_website" tabIndex={-1} autoComplete="off" />
            </label>
            <button type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'TRANSMITTING…' : status === 'sent' ? 'TRANSMISSION SENT ✓' : 'SEND SECURE MESSAGE'}
            </button>
            {!hasLiveBackend && (
              <small className="backend-note">Backend not connected yet; submission opens your email application.</small>
            )}
          </form>
          <iframe title="Contact response" name="contact-response-frame" hidden />
        </div>
      </div>
    </section>
  );
}
