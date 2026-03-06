import { useState } from "react";
import { Link2, Check, Linkedin, Mail, MessageCircle, Facebook } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  compact?: boolean;
}

// X (Twitter) icon — lucide doesn't have it yet
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function ShareButtons({ url, title, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const iconSize = compact ? "w-3.5 h-3.5" : "w-4 h-4";
  const btnBase = compact
    ? "inline-flex items-center justify-center w-8 h-8 rounded-sm border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all duration-150"
    : "inline-flex items-center justify-center w-9 h-9 rounded-sm border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all duration-150";

  return (
    <div className="flex items-center gap-1.5">
      {!compact && (
        <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 mr-1">
          Share
        </span>
      )}

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
        title="Share on LinkedIn"
      >
        <Linkedin className={`${iconSize} text-stone-500 hover:text-[#0077b5]`} />
      </a>

      {/* X (Twitter) */}
      <a
        href={`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
        title="Share on X"
      >
        <XIcon className={`${iconSize} text-stone-500 hover:text-black`} />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
        title="Share on Facebook"
      >
        <Facebook className={`${iconSize} text-stone-500 hover:text-[#1877F2]`} />
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btnBase}
        title="Share on WhatsApp"
      >
        <MessageCircle className={`${iconSize} text-stone-500 hover:text-[#25D366]`} />
      </a>

      {/* Email */}
      <a
        href={`mailto:?subject=${encodedTitle}&body=I thought you'd find this useful: ${encodedUrl}`}
        className={btnBase}
        title="Share via email"
      >
        <Mail className={`${iconSize} text-stone-500 hover:text-stone-700`} />
      </a>

      {/* Copy link */}
      <button
        onClick={copyLink}
        className={btnBase}
        title={copied ? "Copied!" : "Copy link"}
      >
        {copied ? (
          <Check className={`${iconSize} text-emerald-500`} />
        ) : (
          <Link2 className={`${iconSize} text-stone-500 hover:text-stone-700`} />
        )}
      </button>
    </div>
  );
}
