import { getTicketProvider } from '@/lib/utils'

interface InticketsBuyButtonProps {
  url: string
  className?: string
  label?: string
  subtitle?: string
}

export default function InticketsBuyButton({ url, className = '', label = 'Купить билет →', subtitle }: InticketsBuyButtonProps) {
  const provider = subtitle ?? getTicketProvider(url)

  return (
    <div>
      <a
        href={url}
        className={`inline-flex items-center justify-center text-white text-sm font-bold px-7 py-3.5 rounded-xl transition-all hover:brightness-110 active:scale-95 ${className}`}
        style={{ backgroundColor: '#FF4D00', boxShadow: '0 4px 14px rgba(255,77,0,0.30)' }}
      >
        {label}
      </a>
      {provider && <p className="text-[10px] text-muted text-center mt-1.5">{provider}</p>}
    </div>
  )
}
