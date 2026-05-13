interface SectionTitleProps {
  eyebrow?: string
  heading: string
  subheading?: string
  align?: 'left' | 'center'
}

export default function SectionTitle({
  eyebrow,
  heading,
  subheading,
  align = 'left',
}: SectionTitleProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left'

  return (
    <div className={alignClass}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-widest font-body text-stone mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-obsidian">
        {heading}
      </h2>
      {subheading && (
        <p className="font-body text-stone mt-3 text-base">{subheading}</p>
      )}
    </div>
  )
}
