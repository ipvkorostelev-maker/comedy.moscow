import { Review } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="text-gold text-sm tracking-[2px] mb-3">
        {'★'.repeat(review.rating)}
        {'☆'.repeat(5 - review.rating)}
      </div>
      <p className="text-sm text-cream/65 leading-relaxed italic mb-4">«{review.text}»</p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-sm flex-shrink-0">
          {review.avatar}
        </div>
        <div>
          <p className="text-xs font-semibold text-cream">{review.author}</p>
          <p className="text-[10px] text-muted">{formatDate(review.date)}</p>
        </div>
      </div>
    </div>
  )
}
