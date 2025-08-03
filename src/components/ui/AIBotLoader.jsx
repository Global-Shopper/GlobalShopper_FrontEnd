import React from "react";

// Pure static loader with CSS-only animated dots
export default function AIBotLoader({ className = "", overlay = true }) {
  const robotSVG = (
    <svg
      width="48"
      height="48"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow"
    >
      <circle cx="20" cy="20" r="18" fill="#2563eb" />
      <rect x="10" y="15" width="20" height="13" rx="6" fill="#fff" />
      <ellipse cx="16" cy="22" rx="2" ry="2.5" fill="#2563eb" />
      <ellipse cx="24" cy="22" rx="2" ry="2.5" fill="#2563eb" />
      <rect x="17" y="27" width="6" height="2" rx="1" fill="#2563eb" />
      <rect x="18.5" y="7" width="3" height="6" rx="1.5" fill="#fff" />
      <circle cx="20" cy="7" r="2" fill="#2563eb" />
    </svg>
  );

  // CSS animated dots
  const AnimatedDots = () => (
    <span className="inline-block w-5 text-left">
      <span className="dot">.</span>
      <span className="dot dot2">.</span>
      <span className="dot dot3">.</span>
      <style>{`
        .dot {
          opacity: 0.2;
          animation: blink 1.2s infinite both;
        }
        .dot2 {
          animation-delay: 0.2s;
        }
        .dot3 {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
      `}</style>
    </span>
  );

  const statusText = (
    <div className="mt-6 text-lg font-semibold text-blue-800 flex items-center justify-center">
      <span>
        Đang xử lý dữ liệu<AnimatedDots />
      </span>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-2xl border border-blue-200">
          {robotSVG}
          {statusText}
          <div className="mt-2 text-xs text-blue-500 font-medium">AI đang xử lý yêu cầu của bạn...</div>
        </div>
      </div>
    );
  }

  // Inline style fallback
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {robotSVG}
      {statusText}
    </div>
  );
}

// Tailwind custom animation
// Add this to your tailwind.config.js if not present:
// animation: {
//   'float': 'float 2s ease-in-out infinite',
//   'gradient-x': 'gradient-x 3s ease-in-out infinite',
// },
// keyframes: {
//   float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
//   'gradient-x': { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
// },
