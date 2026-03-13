import type { ReactNode } from 'react'
import { getSiteName } from '../lib/site'

type SocialLink = {
  href: string
  label: string
  icon: ReactNode
}

const socialLinks: SocialLink[] = [
  {
    href: 'https://chat.whatsapp.com/DRAcUoNv8fF45UkjgYIqO8',
    label: 'WhatsApp',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 12a8 8 0 0 1-11.8 7l-4.2 1 1.1-4A8 8 0 1 1 20 12Z" />
        <path d="M9.2 8.8c.2-.4.4-.4.7-.4h.6c.2 0 .4 0 .5.4l.6 1.5c.1.2.1.4 0 .6l-.5.8c-.1.2-.1.3 0 .5.3.5.8 1 1.4 1.4.2.1.3.1.5 0l.8-.5c.2-.1.4-.1.6 0l1.4.7c.3.1.4.3.3.5l-.1.6c0 .3-.1.5-.4.7-.4.2-.9.4-1.5.3-1.1-.2-2.3-.8-3.4-1.9-1.1-1.1-1.7-2.2-1.9-3.4 0-.5.1-1 .4-1.5Z" />
      </svg>
    ),
  },
  {
    href: 'https://x.com/openclawsg',
    label: 'X',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h3.8l5.1 6.8L18.5 4H20l-6.4 7.4L20 20h-3.8l-5.4-7.2L4.9 20H3.4l6.7-7.8L4 4Z" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/clawsingapore',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.2" cy="6.8" r="1" />
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/company/clawsingapore',
    label: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.2 8.4a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2Z" />
        <path d="M4.9 10h2.6v8.1H4.9z" />
        <path d="M10 10h2.5v1.1h.1c.5-.8 1.5-1.4 2.8-1.4 3 0 3.6 2 3.6 4.6V18h-2.6v-3.2c0-1.5 0-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V18H10z" />
      </svg>
    ),
  },
  {
    href: 'https://clawsg.substack.com/',
    label: 'Substack',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 5.5h14" />
        <path d="M5 9h14" />
        <path d="M6.5 12.5h11v6h-11z" />
        <path d="M8 19v-3.5" />
        <path d="M12 19v-3.5" />
        <path d="M16 19v-3.5" />
      </svg>
    ),
  },
  {
    href: 'https://www.clawjunction.com/',
    label: 'ClawJunction',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.4 3.5 8.1 12l3.3.8-.5 7.7 5.1-8.9-3.4-.8.8-7.3Z" />
      </svg>
    ),
  },
]

const communityLinks = [
  {
    href: 'https://clawsg.substack.com/',
    label: 'mailing list',
  },
  {
    href: 'https://www.clawjunction.com/',
    label: 'ClawJunction',
  },
]

export function Footer() {
  const siteName = getSiteName()
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-divider" aria-hidden="true" />
        <div className="site-footer-row">
          <div className="site-footer-copy">
            {siteName} · A Singapore-focused fork of{' '}
            <a href="https://github.com/openclaw/clawhub" target="_blank" rel="noreferrer">
              ClawHub
            </a>{' '}
            from the{' '}
            <a href="https://openclaw.ai" target="_blank" rel="noreferrer">
              OpenClaw
            </a>{' '}
            project · Deployed on{' '}
            <a href="https://vercel.com" target="_blank" rel="noreferrer">
              Vercel
            </a>{' '}
            · Powered by{' '}
            <a href="https://www.convex.dev" target="_blank" rel="noreferrer">
              Convex
            </a>{' '}
            · Open source (MIT) · Original project by{' '}
            <a href="https://steipete.me" target="_blank" rel="noreferrer">
              Peter Steinberger
            </a>{' '}
            · ClawHubSG maintained by{' '}
            <a href="https://x.com/tanchunsiong" target="_blank" rel="noreferrer">
              @tanchunsiong
            </a>
            .
          </div>
        </div>
        <div className="site-footer-row">
          <div className="site-footer-community">
            <div className="site-footer-community-label">Singapore community</div>
            <div className="site-footer-links" aria-label="Singapore community links">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="site-footer-link"
                  aria-label={link.label}
                  title={link.label}
                >
                  <span className="site-footer-link-icon">{link.icon}</span>
                </a>
              ))}
            </div>
            <div className="site-footer-community-copy">
              {communityLinks.map((link, index) => (
                <span key={link.href}>
                  {index > 0 ? ' · ' : null}
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
