import React from 'react'

const LoadingSpinner = ({ className = "h-5 w-5", overlay = true, ...props }) => {
  const spinnerElement = (
    <svg 
      className={`inline-block animate-spin ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      {...props}
    >
      <circle 
        className="opacity-20" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="#3B82F6" 
        strokeWidth="3"
      />
      <path 
        className="opacity-80" 
        fill="#3B82F6" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
        {spinnerElement}
      </div>
    )
  }

  return spinnerElement
}

export default LoadingSpinner 