interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * Brand mark for Andalusí.
 * An eight-pointed Andalusian star (the geometric motif found across
 * Al-Andalus architecture, from Cairo's mashrabiya screens to the
 * Alhambra's tilework) sits inside a deep forest-green gradient with a
 * soft mint star — the calm, focused Mint & Forest Green identity.
 */
export default function AndalusiLogo({ size = 40, className = '' }: LogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="an-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1F4F3A" />
            <stop offset="0.55" stopColor="#153428" />
            <stop offset="1" stopColor="#0D2019" />
          </linearGradient>
          <linearGradient id="an-star" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#BCE1CC" />
            <stop offset="1" stopColor="#74BA93" />
          </linearGradient>
        </defs>

        <rect width="40" height="40" rx="11" fill="url(#an-bg)" />

        {/* Two overlapping squares rotated 45° form the classic
            eight-pointed Andalusian / Islamic geometric star */}
        <g transform="translate(20 20)">
          <rect x="-10" y="-10" width="20" height="20" rx="2" fill="url(#an-star)" opacity="0.95" />
          <rect
            x="-10"
            y="-10"
            width="20"
            height="20"
            rx="2"
            fill="url(#an-star)"
            opacity="0.95"
            transform="rotate(45)"
          />
        </g>

        {/* Small central disc, echoing both a Spanish sol and a
            simplified solar motif from Egyptian iconography */}
        <circle cx="20" cy="20" r="5.5" fill="#F6FBF8" />
        <circle cx="20" cy="20" r="5.5" fill="none" stroke="#1F4F3A" strokeWidth="1" opacity="0.35" />
      </svg>
    </div>
  );
}
