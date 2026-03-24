import { Event } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import { FlameIcon } from '@/components/ui/icons'

interface EventBadgesProps {
  event: Event
  className?: string
}

export default function EventBadges({ event, className = 'flex flex-wrap gap-2 mb-4' }: EventBadgesProps) {
  return (
    <div className={className}>
      {event.featured && (
        <Badge variant="red" className="gap-1.5">
          <FlameIcon className="w-2.5 h-2.5" />
          Стендап в Москве
        </Badge>
      )}
      {event.rating > 0 && <Badge variant="gold">★ {event.rating}</Badge>}
      <Badge variant="dark">{event.ageRestriction}</Badge>
      {event.duration && <Badge variant="dark">~{event.duration}</Badge>}
    </div>
  )
}
