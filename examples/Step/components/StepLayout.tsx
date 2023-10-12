import { css } from '@emotion/css'
import { useAtom } from '@xoid/react'
import React, { useEffect, Fragment } from 'react'
import type { Atom } from 'xoid'
import DraggableItem from './DraggableItem'
import DroppableContainer from './DroppableContainer'

const insertItemAtIndex = <T,>(arr: T[], item: T, idx: number): T[] => {
  if (idx < 0 || idx > arr.length) {
    throw new Error(`idx out of array bounds`)
  }
  const result = Array.from(arr)
  result.splice(idx, 0, item)
  return result
}

const createHandlers = (atom: Atom<string[][]>) => ({
  remove: (row: number, id: string) => () =>
    atom.focus(row).update((s) => s.filter((item) => item !== id)),

  beforeRow: (row: number) => (id: string) => atom.update((s) => insertItemAtIndex(s, [id], row)),

  afterRow: (row: number) => (id: string) =>
    atom.update((s) => insertItemAtIndex(s, [id], row + 1)),

  beforeItem: (row: number, itemId: string) => (id: string) =>
    atom.focus(row).update((s) => {
      const index = s.findIndex((item) => item === itemId)
      return insertItemAtIndex(s, id, index)
    }),

  afterItem: (row: number, itemId: string) => (id: string) =>
    atom.focus(row).update((s) => {
      const index = s.findIndex((item) => item === itemId)
      return insertItemAtIndex(s, id, index + 1)
    }),

  ensureNoEmptyRows: () => {
    if (atom.value.some((s) => !s.length)) {
      atom.update((s) => s.filter((item) => item.length))
    }
  },
})

const StepLayout = (props: { $stepLayout: Atom<string[][]> }) => {
  const { $stepLayout } = props
  const stepLayout = useAtom($stepLayout)
  const handlers = createHandlers($stepLayout)
  useEffect(handlers.ensureNoEmptyRows, [stepLayout])

  return (
    <>
      {stepLayout.map((row, rowIndex) => (
        <Fragment key={rowIndex}>
          {rowIndex === 0 && (
            <DroppableContainer orientation="horizontal" onDrop={handlers.beforeRow(rowIndex)} />
          )}
          <div className={css({ display: 'flex' })}>
            {row.map((draggableId, columnIndex) => (
              <Fragment key={draggableId}>
                {columnIndex === 0 && (
                  <DroppableContainer
                    side={true}
                    onDrop={handlers.beforeItem(rowIndex, draggableId)}
                  />
                )}
                <DraggableItem
                  id={draggableId}
                  onRemove={handlers.remove(rowIndex, draggableId)}
                />
                <DroppableContainer
                  side={columnIndex === row.length - 1}
                  onDrop={handlers.afterItem(rowIndex, draggableId)}
                />
              </Fragment>
            ))}
          </div>
          <DroppableContainer orientation="horizontal" onDrop={handlers.afterRow(rowIndex)} />
        </Fragment>
      ))}
    </>
  )
}

export default StepLayout
