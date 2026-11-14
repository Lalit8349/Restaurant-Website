import {
  ArrowUp,
  Check,
  Clock,
  Link2,
  Mail,
  MapPin,
  Phone,
  Share2,
  Utensils,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  BakeryContactDetails,
  DEFAULT_BAKERY_CONTACT_DETAILS,
  DEFAULT_STORY_SHARE_TEXT,
  SocialSharePlatform,
  buildSocialShareLinks,
} from '../utils/bakeryLocationConfig';

interface BakeryFooterProps {
  details?: BakeryContactDetails;
  onReturnToTop?: () => void;
  onJumpToDirections?: () => void;
}

function SocialPlatformIcon({ platform }: { platform: SocialSharePlatform }) {
  switch (platform) {
    case 'x':
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="w-3.5 h-3.5 fill-current shrink-0"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="w-3.5 h-3.5 fill-current shrink-0"
        >
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="w-3.5 h-3.5 fill-current shrink-0"
        >
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="w-3.5 h-3.5 fill-current shrink-0"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24m-3.53 4.7c-.18 0-.47.07-.71.33-.24.27-.92.9-.92 2.2s.94 2.55 1.07 2.73c.13.18 1.82 2.9 4.49 3.95 2.22.87 2.67.7 3.15.65.48-.04 1.56-.63 1.78-1.25.22-.62.22-1.14.15-1.25-.06-.11-.24-.18-.51-.31-.27-.13-1.56-.77-1.8-.86-.24-.09-.42-.13-.6.14-.18.26-.69.86-.84 1.03-.15.18-.31.2-.58.07-.27-.13-1.12-.41-2.14-1.32-.79-.7-1.32-1.57-1.48-1.83-.15-.26-.02-.41.12-.54.12-.12.27-.31.4-.46.13-.15.18-.26.27-.44.09-.18.04-.33-.02-.46-.07-.13-.59-1.43-.82-1.95-.21-.48-.43-.42-.6-.42z" />
        </svg>
      );
  }
}

export function BakeryFooter({
  details = DEFAULT_BAKERY_CONTACT_DETAILS,
  onReturnToTop,
  onJumpToDirections,
}: BakeryFooterProps) {
  const [shareUrl, setShareUrl] = useState('https://goldengrain.example');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location?.href) {
      setShareUrl(window.location.href.split('#')[0]);
    }
  }, []);

  const shareLinks = buildSocialShareLinks({
    url: shareUrl,
    title: `${details.bakeryName} — Farm to Table Story`,
    text: DEFAULT_STORY_SHARE_TEXT,
  });

  const handleCopyStoryLink = useCallback(async () => {
    const targetUrl =
      typeof window !== 'undefined' && window.location?.href
        ? window.location.href.split('#')[0]
        : shareUrl;

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(targetUrl);
      } else {
        const tempInput = document.createElement('textarea');
        tempInput.value = targetUrl;
        tempInput.setAttribute('readonly', '');
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
    } catch {
      // Fallback copy handled silently in restricted iframe contexts
    }

    setCopied(true);
  }, [shareUrl]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <footer
      id="bakery-footer"
      data-testid="bakery-footer"
      aria-label="Bakery contact details and footer"
      className="relative z-10 w-full bg-transparent border-t border-white/20 px-4 sm:px-10 lg:px-14 pt-8 pb-[calc(env(safe-area-inset-bottom,0px)+2.5rem)] sm:py-12"
    >
      <div className="mx-auto max-w-5xl bg-transparent">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-xs sm:text-sm text-white/90 video-text-shadow">
          {/* Column 1: Bakery Name & Identity */}
          <div className="space-y-1.5">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-amber-200/90 font-medium">
              Artisanal Bakery
            </p>
            <h3
              data-testid="footer-bakery-name"
              className="font-display text-lg sm:text-xl font-semibold text-white video-heading-shadow"
            >
              {details.bakeryName}
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              {details.tagline}
            </p>
          </div>

          {/* Column 2: Bakery Address */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-200/90 font-medium">
              <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Address</span>
            </div>
            <address
              data-testid="footer-bakery-address"
              className="not-italic text-xs sm:text-sm text-white/90 leading-relaxed space-y-0.5"
            >
              <p>{details.addressLine1}</p>
              <p className="text-white/80">{details.addressLine2}</p>
            </address>
            {onJumpToDirections && (
              <button
                type="button"
                onClick={onJumpToDirections}
                className="inline-block pt-0.5 text-xs text-amber-200 hover:text-amber-100 underline underline-offset-4 cursor-pointer"
              >
                View on Map above
              </button>
            )}
          </div>

          {/* Column 3: Contact Details (Phone, Email, Hospitality) */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-200/90 font-medium">
              <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Contact &amp; Inquiries</span>
            </div>
            <ul
              data-testid="footer-bakery-contact"
              className="space-y-1 text-xs sm:text-sm text-white/90"
            >
              <li>
                <a
                  href={`tel:${details.phone.replace(/[^+\d]/g, '')}`}
                  className="hover:text-amber-100 transition-colors"
                >
                  Tel: {details.phone}
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-amber-200/80 shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${details.email}`}
                  className="hover:text-amber-100 transition-colors break-words"
                >
                  {details.email}
                </a>
              </li>
              <li className="flex items-center gap-1.5 text-white/80">
                <Utensils className="w-3 h-3 text-amber-200/80 shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${details.wholesaleEmail}`}
                  className="hover:text-amber-100 transition-colors break-words"
                >
                  Hotels: {details.wholesaleEmail}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Hours & Dispatch */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-200/90 font-medium">
              <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Bakery &amp; Dispatch Hours</span>
            </div>
            <div className="space-y-1 text-xs text-white/90 leading-relaxed">
              {details.openingHours.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p className="text-amber-100/85 pt-0.5">{details.hotelDispatchNote}</p>
            </div>
          </div>
        </div>

        {/* Social Share Button Group */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-transparent">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-100/95 video-text-shadow">
            <Share2 className="w-3.5 h-3.5 text-amber-200 shrink-0" aria-hidden="true" />
            <span>Share the Golden Grain Journey</span>
          </div>

          <div
            role="group"
            aria-label="Share this bakery story"
            data-testid="footer-social-share-group"
            className="flex flex-wrap items-center gap-2"
          >
            {shareLinks.map((item) => (
              <a
                key={item.platform}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.ariaLabel}
                data-testid={`share-link-${item.platform}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] text-xs font-medium text-white/90 hover:text-amber-100 bg-black/30 hover:bg-black/50 active:scale-95 border border-white/30 hover:border-amber-200 rounded-full transition-all duration-200 video-text-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
              >
                <SocialPlatformIcon platform={item.platform} />
                <span>{item.label}</span>
              </a>
            ))}

            <button
              type="button"
              onClick={handleCopyStoryLink}
              aria-label={copied ? 'Story link copied' : 'Copy story link'}
              data-testid="copy-story-link-btn"
              data-copied={copied ? 'true' : 'false'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] text-xs font-medium text-white/90 hover:text-amber-100 bg-black/30 hover:bg-black/50 active:scale-95 border border-white/30 hover:border-amber-200 rounded-full transition-all duration-200 cursor-pointer video-text-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-200 shrink-0" aria-hidden="true" />
                  <span className="text-amber-200">Link Copied</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-4 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] sm:text-xs text-white/75 video-text-shadow">
          <p>
            © {new Date().getFullYear()} {details.bakeryName}. {details.copyrightNote}
          </p>

          {onReturnToTop && (
            <button
              type="button"
              onClick={onReturnToTop}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 hover:text-amber-200 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Back to Top of Journey</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}

