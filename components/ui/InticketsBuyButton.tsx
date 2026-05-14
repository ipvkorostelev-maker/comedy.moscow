interface InticketsBuyButtonProps {
  url: string
  className?: string
  label?: string
  subtitle?: string
}

export default function InticketsBuyButton({ url, className = '', label = 'Купить билет →', subtitle = 'Интикетс' }: InticketsBuyButtonProps) {
  return (
    <div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center text-white text-sm font-bold px-7 py-3.5 rounded-xl transition-all hover:brightness-110 active:scale-95 ${className}`}
        style={{ backgroundColor: '#E8432A', boxShadow: '0 4px 14px rgba(232,67,42,0.30)' }}
      >
        {label}
      </a>
      <p className="text-[10px] text-muted text-center mt-1.5">{subtitle}</p>
    </div>
  )
}
