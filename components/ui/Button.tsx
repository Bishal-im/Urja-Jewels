import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-gold text-obsidian hover:opacity-90 border border-transparent',
  outline:
    'border border-gold text-gold bg-transparent hover:bg-gold/10',
  ghost:
    'text-gold bg-transparent hover:bg-gold/10 border border-transparent',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const baseClasses =
  'inline-flex items-center justify-center font-body tracking-wide transition-all duration-200 ' +
  'focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
