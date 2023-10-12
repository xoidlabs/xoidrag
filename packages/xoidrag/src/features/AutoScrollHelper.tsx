import getScrollParent from 'scrollparent'
import { Feature } from '@xoid/feature'
import Context from './Context'

export default class AutoScrollHelper extends Feature<{}> {
  context = this.from(Context)
  constructor(options: {}) {
    super(options)
    let pointerCoordinate: number
    let isDragging: boolean
    let scrollParent: HTMLElement
    let scrollParentRect: DOMRect
    const { $dragStartEvent, $dragMoveEvent, $dragEndEvent } = this.context

    $dragStartEvent.subscribe(() => {
      scrollParent = getScrollParent(this.context.originalElement)!
      scrollParentRect = scrollParent.getBoundingClientRect()
      isDragging = true
      animate()
    })

    $dragMoveEvent
      .focus((e) => e.clientY)
      .subscribe((clientY) => {
        // We obtain the pointer coordinate as a number between 0 and 1.
        // 0 is topmost, and 1 is bottommost.
        pointerCoordinate = (clientY - scrollParentRect.top) / scrollParent.clientHeight
      })

    $dragEndEvent.subscribe(() => { isDragging = false })

    const animate = () => {
      const multiplier = (pointerCoordinate - 0.5) * 2
      // scrolling speed. The unit is pixels per each animation frame
      const maxSpeed = 5
      // 0.5 as the threshold means, it starts scrolling in only in the first and last percentiles
      if (Math.abs(multiplier) > 0.5) {
        scrollParent.scrollTop += Math.floor(multiplier * maxSpeed)
      }
      if (isDragging) {
        requestAnimationFrame(animate)
      }
    }
  }
}
