import { Feature } from '@xoid/feature';
import Context from './Context';

export default class EventsHelper extends Feature<{
  onDragStart?: () => void
  onDragMove?: () => void
  onDragEnd?: () => void
  originalElementClass?: string
  draggingElementClass?: string
}> {
  main() {
    const { $dragStartEvent, $dragEndEvent, $dragMoveEvent } = this.from(Context)

    const { onDragStart, onDragMove, onDragEnd, originalElementClass, draggingElementClass } =
      this.getOptions({ 
        originalElementClass: 'xoidrag-draggable-elem',
        draggingElementClass: 'xoidrag-dragging-elem',
    })

    if (onDragStart) {
      $dragStartEvent.subscribe(onDragStart)
    }
    if (onDragMove) {
      $dragMoveEvent.subscribe(onDragMove)
    }
    if (onDragEnd) {
      $dragEndEvent.subscribe(onDragEnd)
    }

    $dragStartEvent.subscribe(() => {
      const { originalElement, draggingElement } = this.from(Context)
      originalElement.classList.add(originalElementClass)
      draggingElement.classList.add(draggingElementClass)
    })

    $dragEndEvent.subscribe(() => {
      const { originalElement, draggingElement } = this.from(Context)
      originalElement.classList.remove(originalElementClass)
      draggingElement.classList.remove(draggingElementClass)
    })
  }
}