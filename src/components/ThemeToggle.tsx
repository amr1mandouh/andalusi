import { useTheme } from '../contexts/ThemeContext';

/**
 * Light/dark toggle. The track carries a faint repeating border inspired by
 * hieroglyph friezes (small triangular reeds), and the sliding knob is a
 * lotus-flower silhouette that opens for day and closes for night.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-16 h-9 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-forest-400 ${
        isDark ? 'bg-slate-800' : 'bg-mint-100'
      }`}
    >
      <svg
        viewBox="0 0 64 36"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="track-clip">
            <rect x="0" y="0" width="64" height="36" rx="18" />
          </clipPath>
        </defs>

        <g clipPath="url(#track-clip)">
          {/* Hieroglyph-frieze border: a thin repeating reed/triangle pattern
              along the top and bottom edges of the track */}
          <g opacity={isDark ? 0.35 : 0.4} fill={isDark ? '#7CBD9B' : '#276548'}>
            {Array.from({ length: 11 }).map((_, i) => (
              <polygon key={`top-${i}`} points={`${i * 6},2 ${i * 6 + 3},2 ${i * 6 + 1.5},5.5`} />
            ))}
            {Array.from({ length: 11 }).map((_, i) => (
              <polygon key={`bottom-${i}`} points={`${i * 6},34 ${i * 6 + 3},34 ${i * 6 + 1.5},30.5`} />
            ))}
          </g>
        </g>
      </svg>

      <span
        className={`absolute top-1 left-1 w-7 h-7 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${
          isDark ? 'translate-x-7 bg-slate-900' : 'translate-x-0 bg-white'
        }`}
      >
        {isDark ? (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path
              d="M20 13.5A8.5 8.5 0 1 1 10.5 4a7 7 0 0 0 9.5 9.5Z"
              fill="#98CFB2"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            {/* Lotus-flower silhouette standing in for the sun's petals */}
            <path
              d="M12 3 C13 6 13 8.5 12 11 C11 8.5 11 6 12 3 Z"
              fill="#1F4F3A"
            />
            <path
              d="M12 11 C9.8 9.2 7.6 8.4 5.5 8.6 C7 10.6 8.8 12 12 12.6 C15.2 12 17 10.6 18.5 8.6 C16.4 8.4 14.2 9.2 12 11 Z"
              fill="#37805C"
            />
            <circle cx="12" cy="12" r="2.3" fill="#569E77" />
          </svg>
        )}
      </span>
    </button>
  );
}
