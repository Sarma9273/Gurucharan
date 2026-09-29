import { FormEvent, useRef, useState } from 'react';
import { hasLiveBackend, PORTFOLIO_API_URL } from '../config';

type ContactStatus = 'idle' | 'sending' | 'sent' | 'error';

const MAIL_TO = 'charanmavuduru9273@gmail.com';
const BACKEND_ORIGINS = new Set([
  new URL(PORTFOLIO_API_URL || 'https://script.google.com').origin,
  'https://script.google.com',
  'https://script.googleusercontent.com',
]);

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const responseFrame = useRef<HTMLIFrameElement>(null);
  const nonceInput = useRef<HTMLInputElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const requestNonce = useRef('');
  const [status, setStatus] = useState<ContactStatus>('idle');
  const [error, setError] = useState('');

  const startNewMessage = () => {
    form.current?.reset();
    requestNonce.current = '';
    setError('');
    setStatus('idle');
    nameInput.current?.focus();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (!hasLiveBackend) {
      event.preventDefault();
      setStatus('sent');
      setError('');
      window.location.href =
        `mailto:${MAIL_TO}?subject=${encodeURIComponent('Portfolio conversation')}`;
      return;
    }

    const nonce =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID().replace(/-/g, '')
        : Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map((value) => value.toString(16).padStart(2, '0'))
            .join('');

    requestNonce.current = nonce;
    if (nonceInput.current) nonceInput.current.value = nonce;

    setError('');
    setStatus('sent');

    // Allow the browser's native form submission to continue into the hidden
    // iframe. The success state is shown immediately because the form POST
    // itself is the transmission; the backend response must not make the UI
    // appear failed after a successful submission.
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
              <a href={`mailto:${MAIL_TO}`}>{MAIL_TO} ↗</a>
              <a href="https://www.linkedin.com/in/gurucharanmavuduru" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a href="https://github.com/Sarma9273" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
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
            <input ref={nonceInput} type="hidden" name="nonce" value="" />
            <input type="hidden" name="source" value="Gurucharan cinematic portfolio" />

            <label>
              <span>01 / Identity</span>
              <input ref={nameInput} name="name" required maxLength={100} autoComplete="name" placeholder="Your name" />
            </label>

            <label>
              <span>02 / Email channel</span>
              <input name="email" type="email" required maxLength={180} autoComplete="email" placeholder="you@company.com" />
            </label>

            <label>
              <span>03 / Discussion subject</span>
              <input name="subject" required maxLength={180} placeholder="Role, research or collaboration" />
            </label>

            <label>
              <span>04 / Transmission</span>
              <textarea name="message" required minLength={8} maxLength={5000} rows={5} placeholder="Tell me what you would like to discuss." />
            </label>

            <label className="honeypot" aria-hidden="true">
              Website
              <input name="company_website" tabIndex={-1} autoComplete="off" />
            </label>

            <button type="submit" disabled={status === 'sending'}>
              {status === 'sending'
                ? 'TRANSMITTING…'
                : status === 'sent'
                  ? 'THANKS FOR CONNECTING ✓'
                  : status === 'error'
                    ? 'RETRY TRANSMISSION'
                    : 'SEND SECURE MESSAGE'}
            </button>

            {status === 'sent' && (
              <>
                <small className="backend-note">
                  Thanks for connecting — I’ll try to respond as fast as possible.
                </small>
                <button
                  type="button"
                  className="new-message-button"
                  onClick={startNewMessage}
                >
                  WANT TO TELL MORE / NEW MESSAGE
                </button>
              </>
            )}
            {status === 'error' && <small className="backend-note">{error}</small>}
          </form>

          <iframe ref={responseFrame} title="Contact response" name="contact-response-frame" hidden />
        </div>
      </div>
    </section>
  );
}
