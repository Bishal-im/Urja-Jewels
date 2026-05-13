interface GoldDividerProps {
  className?: string
}

export default function GoldDivider({ className }: GoldDividerProps) {
  return <hr className={`border-t border-gold${className ? ` ${className}` : ''}`} />
}
