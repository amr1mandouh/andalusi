/**
 * Ambient app background: a soft gradient in Light Mode and a rich deep
 * gradient with a dark overlay in Dark Mode, with faint minimalist
 * line-art travel/landmark icons watermarked across it (a tower, a plane,
 * a map pin, an Andalusian horseshoe arch, a compass). Pure SVG/CSS —
 * no raster images, so it stays crisp and costs almost nothing to render.
 *
 * Render this once, fixed behind the whole app (see App.tsx), then let
 * page content sit on transparent/semi-transparent cards above it.
 */
export default function TravelBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient — soft, quiet mint */}
      <div className="absolute inset-0 bg-gradient-to-br from-mint-50 via-mint-100/60 to-mint-50 dark:from-surface dark:via-surface-elevated dark:to-surface transition-colors duration-500" />

      {/* Dark-mode overlay: deepens the gradient so cards/buttons pop */}
      <div className="absolute inset-0 hidden dark:block bg-gradient-to-b from-surface/10 via-surface/40 to-surface/70" />

      {/* Dark-mode ambient glow — faint teal, kept subtle so it never reads as a colorful surface */}
      <div className="absolute inset-0 hidden dark:block">
        <div className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-accent/[0.06] blur-[120px]" />
        <div className="absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full bg-accent/[0.04] blur-[130px]" />
        <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-accent/[0.05] blur-[100px]" />
      </div>

      {/* Minimalist line-art landmarks watermark */}
      <svg
        className="absolute inset-0 w-full h-full text-stone-400/[0.16] dark:text-ink-primary/[0.05]"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          {/* Cairo Tower — lattice lotus-shaped tower */}
          <g id="landmark-tower">
            <path d="M40 120 L34 10 M40 120 L46 10 M34 10 Q40 -6 46 10 M30 40 L50 40 M27 65 L53 65 M24 90 L56 90 M18 120 L62 120 M14 128 L66 128" />
          </g>
          {/* Airplane, simple line silhouette */}
          <g id="landmark-plane">
            <path d="M0 20 L60 20 L78 6 L86 6 L74 20 L110 20 L124 12 L132 12 L124 24 L132 36 L124 36 L110 28 L74 28 L86 42 L78 42 L60 28 L0 28 Z" />
          </g>
          {/* Map with a pin */}
          <g id="landmark-map">
            <path d="M4 8 L34 0 L64 8 L94 0 L94 70 L64 78 L34 70 L4 78 Z M34 0 L34 70 M64 8 L64 78" />
            <path d="M112 30 Q112 12 130 12 Q148 12 148 30 Q148 48 130 66 Q112 48 112 30 Z" />
            <circle cx="130" cy="30" r="7" />
          </g>
          {/* Andalusian horseshoe arch (Alhambra-style) */}
          <g id="landmark-arch">
            <path d="M4 90 L4 40 Q4 -6 40 -6 Q76 -6 76 40 L76 90 M4 40 Q4 20 40 20 Q76 20 76 40" />
            <path d="M4 90 L-6 90 M76 90 L86 90" />
          </g>
          {/* Compass / travel rose */}
          <g id="landmark-compass">
            <circle cx="30" cy="30" r="28" />
            <path d="M30 6 L36 30 L30 54 L24 30 Z" />
            <circle cx="30" cy="30" r="2.5" fill="currentColor" stroke="none" />
          </g>
          {/* Passport / boarding-pass style ticket */}
          <g id="landmark-pass">
            <rect x="0" y="0" width="90" height="56" rx="6" />
            <path d="M64 0 L64 56" strokeDasharray="4 4" />
            <path d="M10 16 L44 16 M10 28 L44 28 M10 40 L30 40" />
            <circle cx="77" cy="28" r="10" />
          </g>
        </defs>

        <use href="#landmark-tower" x="90" y="60" transform="rotate(-4 90 60)" />
        <use href="#landmark-plane" x="1180" y="120" transform="rotate(8 1180 120)" />
        <use href="#landmark-map" x="1250" y="520" />
        <use href="#landmark-arch" x="160" y="640" />
        <use href="#landmark-compass" x="700" y="70" />
        <use href="#landmark-pass" x="620" y="740" transform="rotate(-6 620 740)" />
        <use href="#landmark-plane" x="230" y="470" transform="rotate(-18 230 470) scale(0.7)" />
        <use href="#landmark-tower" x="1330" y="740" transform="scale(0.8)" />
        <use href="#landmark-arch" x="1080" y="300" transform="scale(0.55)" />
        <use href="#landmark-compass" x="990" y="640" transform="scale(0.6)" />
      </svg>
    </div>
  );
}
