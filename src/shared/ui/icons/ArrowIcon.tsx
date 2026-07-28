import React from 'react'

type ArrowIconProps = {
  direction?: 'right' | 'left'
  size?: number
  className?: string
}

export function ArrowIcon({ direction = 'right', size = 18, className }: ArrowIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 18 18"
      aria-hidden="true"
      style={direction === 'left' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path
        d="M3 9h11.5M10 4l4.5 5-4.5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
