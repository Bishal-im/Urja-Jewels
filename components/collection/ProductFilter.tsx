'use client'

interface ProductFilterProps {
  categories: string[]
  active: string
  onChange: (category: string) => void
}

export default function ProductFilter({ categories, active, onChange }: ProductFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center py-8 px-8 bg-ivory">
      {['All', ...categories].map((cat) => {
        const isActive = active === cat
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={[
              'font-body text-xs uppercase tracking-widest px-5 py-2 border transition-all duration-200',
              'focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2',
              isActive
                ? 'border-gold text-gold bg-gold/10'
                : 'border-fog text-stone hover:border-gold hover:text-gold',
            ].join(' ')}
            aria-pressed={isActive}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
