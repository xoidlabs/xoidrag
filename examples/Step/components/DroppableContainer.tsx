import { css } from '@emotion/css'
import { bodyDraggingClass, useDroppable } from '../draggable'
import React, { useRef } from 'react'
import DropIndicator from './DropIndicator'

const constants = {
  verticalDroppableSize: 80,
  horizontalDroppableSize: 20,
  negativeMargin: -0.5,
}

const showClass = css({
  // weird z-index stuff
  opacity: '0.99 !important',
})

const DroppableContainer = (
  props: Omit<Parameters<typeof useDroppable>[0], 'ref'> & {
    orientation?: 'vertical' | 'horizontal'
    side?: boolean
  }
) => {
  const { orientation = 'vertical' } = props
  const ref = useRef<HTMLDivElement>(null)
  useDroppable({
    ref,
    onDragEnter: (item) => item.classList.add(showClass),
    onDragLeave: (item) => item.classList.remove(showClass),
    ...props,
  })

  const innerNode = (
    <div
      ref={ref}
      className={css([
        {
          pointerEvents: 'none',
          [`body.${bodyDraggingClass} &`]: {
            pointerEvents: 'auto',
          },
          // weird z-index stuff
          opacity: 0.01,
          transition: 'opacity 220ms',
          display: 'flex',
          flexDirection: orientation === 'horizontal' ? 'column' : 'row',
          justifyContent: 'center',
        },
        orientation === 'vertical'
          ? {
              width: constants.verticalDroppableSize,
              margin: `${constants.negativeMargin}px -${constants.verticalDroppableSize / 2}px`,
            }
          : {
              height: constants.horizontalDroppableSize,
              margin: `-${constants.horizontalDroppableSize / 2}px ${constants.negativeMargin}px`,
            },
      ])}
    >
      <DropIndicator
        direction={orientation}
        size={props.side ? 8 : 4}
        arrowSize={orientation === 'horizontal' ? 8 : props.side ? 9 : 7}
      />
    </div>
  )

  // extra div: weird z-index stuff
  return orientation === 'horizontal' ? (
    <div
      className={css({
        // all weird z-index stuff
        '& > *': { zIndex: 1 },
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      {innerNode}
    </div>
  ) : (
    innerNode
  )
}

export default DroppableContainer
