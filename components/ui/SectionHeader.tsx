import Link from 'next/link'

interface SectionHeaderProps {
  title: string
  linkHref?: string
  linkLabel?: string
}

export default function SectionHeader({ title, linkHref, linkLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-8">
      <h2 className="font-serif font-bold text-2xl text-cream">{title}</h2>
      {linkHref && linkLabel && (
        <Link href={linkHref} className="text-xs text-muted hover:text-cream transition-colors">
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}
