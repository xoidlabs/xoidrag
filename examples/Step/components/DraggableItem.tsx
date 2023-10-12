import { css } from '@emotion/css'
import { useDraggable, bodyDraggingClass, handleClass } from '../draggable'
import React, { useEffect, useRef } from 'react'
import DragHandle from '../assets/drag-handle.svg'
import { contentMap } from '..'
let recentlyDroppedId: string

const DraggableItem = (props: Omit<Parameters<typeof useDraggable>[0], 'ref'>) => {
  const ref = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)

  useDraggable({
    ref,
    id: props.id,
    onRemove: () => {
      recentlyDroppedId = props.id
      props.onRemove?.()
    },
  })

  useEffect(() => {
    if (props.id === recentlyDroppedId) {
      ref.current?.focus()
    }
  }, [])

  return (
    <div
      ref={ref}
      tabIndex={0}
      onClick={function (e) {
        ;(e.target as HTMLElement | undefined)?.focus()
      }}
      className={css({
        flex: 1,
        minHeight: 52,
        background: '#fff',
        padding: 10,
        margin: '-0.5px',
        border: '1px solid #ced1dc',
        display: 'flex',
        alignItems: 'center',
        [`body:not(.${bodyDraggingClass}) &:focus`]: {
          border: '1px solid rgb(0 88 255)',
          outline: '3px solid rgb(33 103 243 / 20%)',
          zIndex: 2,
        },
        [`.${handleClass}`]: {
          userSelect: 'none',
          '&>*': {pointerEvents: 'none'}
        }
      })}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 19,
          marginLeft: 12,
          marginRight: 8,
        }}
      >
        T
      </div>
      <div
        className={css({
          flex: 1,
          width: 0,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        })}
      >
        {contentMap[props.id]}
      </div>
      <div ref={handleRef} className={handleClass} style={{ fontSize: 30, color: '#6A7695', cursor: 'grab' }}>
        <img src={DragHandle} width={32} />
      </div>
    </div>
  )
}

export default DraggableItem
