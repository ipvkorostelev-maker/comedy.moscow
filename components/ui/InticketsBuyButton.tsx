interface InticketsBuyButtonProps {
  url: string
  className?: string
  label?: string
}

export default function InticketsBuyButton({ url, className = '', label = 'Купить билет →' }: InticketsBuyButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center text-black text-sm font-bold px-7 py-3.5 rounded-xl transition-all hover:brightness-90 active:scale-95 ${className}`}
      style={{ backgroundColor: 'rgb(253, 246, 2)', boxShadow: '0 4px 14px rgba(253,246,2,0.30)' }}
    >
      {label}
    </a>
  )
}
