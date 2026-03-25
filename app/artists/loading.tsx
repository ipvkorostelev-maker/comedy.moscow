export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div
            className="w-12 h-12 rounded-full border-2 border-transparent border-t-red animate-spin"
            style={{ animationDuration: '0.9s' }}
          />
          <div
            className="absolute inset-1 rounded-full border border-red/20 animate-pulse"
          />
        </div>
        <p className="font-serif font-black text-cream/40 text-xs uppercase tracking-[0.2em]">
          Загрузка
        </p>
      </div>
    </div>
  )
}
