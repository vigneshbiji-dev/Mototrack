import { motion } from 'framer-motion'

export default function MotorcycleIllustration() {
  return (
    <div className="relative flex items-center justify-center py-8">
      {/* Ambient glow — blends into page bg */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[420px] w-[420px] rounded-full bg-accent/[0.12] blur-[120px]" />
        <div className="absolute h-[280px] w-[280px] rounded-full bg-primary/[0.08] blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <svg
          viewBox="0 0 560 340"
          className="w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2a2f2e" />
              <stop offset="50%" stopColor="#1e2122" />
              <stop offset="100%" stopColor="#131516" />
            </linearGradient>
            <linearGradient id="greenGlow" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#3A704E" stopOpacity="0" />
              <stop offset="50%" stopColor="#509162" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3A704E" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="tankShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#509162" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#509162" stopOpacity="0" />
            </linearGradient>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="headlightGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ground reflection */}
          <ellipse cx="280" cy="310" rx="200" ry="12" fill="#509162" opacity="0.08" />
          <ellipse cx="280" cy="308" rx="140" ry="6" fill="#509162" opacity="0.12" />

          {/* Rear wheel */}
          <circle cx="130" cy="250" r="58" stroke="#434746" strokeWidth="1.5" fill="url(#bodyGrad)" opacity="0.9" />
          <circle cx="130" cy="250" r="42" stroke="#3A704E" strokeWidth="0.5" fill="none" opacity="0.4" />
          <circle cx="130" cy="250" r="10" fill="#1e2122" stroke="#434746" strokeWidth="1" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
            <line
              key={`r-${a}`}
              x1={130 + 18 * Math.cos((a * Math.PI) / 180)}
              y1={250 + 18 * Math.sin((a * Math.PI) / 180)}
              x2={130 + 52 * Math.cos((a * Math.PI) / 180)}
              y2={250 + 52 * Math.sin((a * Math.PI) / 180)}
              stroke="#434746"
              strokeWidth="1"
              opacity="0.6"
            />
          ))}

          {/* Front wheel */}
          <circle cx="430" cy="250" r="58" stroke="#434746" strokeWidth="1.5" fill="url(#bodyGrad)" opacity="0.9" />
          <circle cx="430" cy="250" r="42" stroke="#3A704E" strokeWidth="0.5" fill="none" opacity="0.4" />
          <circle cx="430" cy="250" r="10" fill="#1e2122" stroke="#434746" strokeWidth="1" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
            <line
              key={`f-${a}`}
              x1={430 + 18 * Math.cos((a * Math.PI) / 180)}
              y1={250 + 18 * Math.sin((a * Math.PI) / 180)}
              x2={430 + 52 * Math.cos((a * Math.PI) / 180)}
              y2={250 + 52 * Math.sin((a * Math.PI) / 180)}
              stroke="#434746"
              strokeWidth="1"
              opacity="0.6"
            />
          ))}

          {/* Frame & swingarm */}
          <path
            d="M130 250 L210 175 L295 155 L385 130 L430 210"
            stroke="#434746"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M210 175 L210 215 L130 250"
            stroke="#434746"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M295 155 L295 220 L430 250"
            stroke="#434746"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Engine */}
          <rect x="235" y="190" width="68" height="48" rx="8" fill="#1e2122" stroke="#434746" strokeWidth="1" opacity="0.95" />
          <rect x="248" y="202" width="42" height="28" rx="4" fill="#131516" stroke="#3A704E" strokeWidth="0.5" opacity="0.5" />

          {/* Fuel tank */}
          <ellipse cx="278" cy="162" rx="62" ry="24" fill="url(#bodyGrad)" stroke="#434746" strokeWidth="1" opacity="0.95" />
          <ellipse cx="278" cy="158" rx="50" ry="16" fill="url(#tankShine)" />
          <path
            d="M230 158 Q278 145 326 158"
            stroke="url(#greenGlow)"
            strokeWidth="2"
            fill="none"
            opacity="0.7"
            filter="url(#softGlow)"
          />

          {/* Seat */}
          <path
            d="M205 168 Q245 148 290 158 Q310 163 318 178 L312 188 Q268 182 208 192 Z"
            fill="#1e2122"
            stroke="#434746"
            strokeWidth="1"
            opacity="0.9"
          />

          {/* Handlebars & fork */}
          <path d="M385 130 L408 95 L448 88" stroke="#434746" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.85" />
          <path d="M385 130 L385 200 L430 250" stroke="#434746" strokeWidth="2" fill="none" opacity="0.7" />

          {/* Windscreen */}
          <path
            d="M395 125 L412 78 L428 84 L418 128 Z"
            fill="#1e2122"
            stroke="#434746"
            strokeWidth="0.8"
            opacity="0.7"
          />

          {/* Headlight */}
          <circle cx="448" cy="118" r="14" fill="#1e2122" stroke="#509162" strokeWidth="1.5" opacity="0.9" filter="url(#headlightGlow)" />
          <circle cx="448" cy="118" r="6" fill="#509162" opacity="0.35" />

          {/* Exhaust with green heat tint */}
          <path
            d="M255 228 Q195 242 155 218"
            stroke="#434746"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M155 218 L138 212"
            stroke="#509162"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.45"
            filter="url(#softGlow)"
          />

          {/* Accent pin lights */}
          <circle cx="262" cy="210" r="2.5" fill="#509162" opacity="0.6" />
          <circle cx="282" cy="210" r="2.5" fill="#509162" opacity="0.6" />
        </svg>
      </motion.div>

      {/* Fade edges into background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
    </div>
  )
}
