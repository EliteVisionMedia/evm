import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Instagram, Linkedin, type LucideProps } from 'lucide-react';
import { contact, socials } from '../data/site';

/** WhatsApp glyph (lucide has no brand icon for it). */
function WhatsAppIcon({ size = 20 }: LucideProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.43 9.43 0 1 1 7.99 4.42m8.02-17.45A11.28 11.28 0 0 0 12.05.75C5.8.75.71 5.84.71 12.1c0 2 .52 3.95 1.52 5.67L.62 23.25l5.6-1.47a11.3 11.3 0 0 0 5.82 1.6h.01c6.25 0 11.34-5.1 11.34-11.35 0-3.03-1.18-5.88-3.32-8.02" />
    </svg>
  );
}

const instagram = socials.find((s) => s.icon === 'instagram');
const linkedin = socials.find((s) => s.icon === 'linkedin');

const links = [
  { key: 'whatsapp', label: 'WhatsApp', href: contact.whatsappWithText("Hi EVM, I'd like to discuss a project."), Icon: WhatsAppIcon },
  ...(instagram ? [{ key: 'instagram', label: 'Instagram', href: instagram.href, Icon: Instagram }] : []),
  ...(linkedin ? [{ key: 'linkedin', label: 'LinkedIn', href: linkedin.href, Icon: Linkedin }] : []),
];

/** Site-wide floating WhatsApp / Instagram / LinkedIn links, stacked on the right edge. */
export default function FloatingSocial() {
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  // The Contact page already has its own WhatsApp and contact links.
  if (pathname.startsWith('/contact')) return null;
  return (
    <nav
      aria-label="Elite Vision Media on social media"
      className="fixed z-30 right-[max(10px,env(safe-area-inset-right,0px))] bottom-[calc(16px+env(safe-area-inset-bottom,0px))] md:right-6 md:bottom-[calc(100px+env(safe-area-inset-bottom,0px))]"
    >
      <ul className="flex flex-col items-center gap-2.5 md:gap-3">
        {links.map(({ key, label, href, Icon }, i) => (
          <motion.li
            key={key}
            className="group relative"
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.6 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Elite Vision Media on ${label} (opens in a new tab)`}
              className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white text-teal shadow-[0_10px_24px_-10px_rgba(12,13,17,0.4)] transition-[transform,background-color,color,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:scale-110 hover:border-teal hover:bg-teal hover:text-white hover:shadow-[0_14px_28px_-10px_rgba(1,154,157,0.7)] focus-visible:bg-teal focus-visible:text-white md:h-14 md:w-14 motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
            >
              <Icon size={24} />
            </a>
            <span
              aria-hidden
              className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md bg-ink px-2.5 py-1 text-xs font-medium text-white opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:opacity-100 md:block"
            >
              {label}
            </span>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}
