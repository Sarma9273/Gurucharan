import { FormEvent, useEffect, useRef, useState } from 'react';
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
  const [status, setStatus] = useState<ContactStatus>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleBackendMessage = (event: MessageEvent) => {
      if (event.source !== responseFrame.current?.contentWindow) return;
      if (!BACKEND_ORIGINS.has(event.origin)) return;
      if (!event.data || event.data.type !== 'portfolio-contact') return;

      if (event.data.ok === true) {
        setStatus('sent');
        setError('');
        form.current?.reset();
      } else {
        setStatus('error');
        setError(String(event.data.error || 'The message could not be delivered.'));
      }
    };

    window.addEventListener('message', handleBackendMessage);
    return () => window.removeEventListener('message', handleBackendMessage);
  }, []);

  useEffect(() => {
    if (status !== 'sending') return;

    const timeout = window.setTimeout(() => {
      setStatus('error');
      setError('The backend did not confirm delivery. Please try again or use the email link below.');
    }, 15000);

    return () => window.clearTimeout(timeout);
  }, [status]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    if (!hasLiveBackend) {
      event.preventDefault();
      setStatus('sent');
      setError('');
      window.location.href =
        `mailto:${MAIL_TO}?subject=${encodeURIComponent('Portfolio conversation')}`;
      return;
    }

    setError('');
    setStatus('sending');
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
            <input type="hidden" name="source" value="Gurucharan cinematic portfolio" />

            <label>
              <span>01 / Identity</span>
              <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" />
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
                  ? 'TRANSMISSION CONFIRMED ✓'
                  : status === 'error'
                    ? 'RETRY TRANSMISSION'
                    : 'SEND SECURE MESSAGE'}
            </button>

            {!hasLiveBackend && (
              <small className="backend-note">Backend not connected yet; submission opens your email application.</small>
            )}
            {status === 'error' && <small className="backend-note">{error}</small>}
          </form>

          <iframe ref={responseFrame} title="Contact response" name="contact-response-frame" hidden />
        </div>
      </div>
    </section>
  );
}
