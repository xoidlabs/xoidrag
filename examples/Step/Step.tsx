import { css, injectGlobal } from '@emotion/css'
import { bodyDraggingClass } from './draggable'
import React from 'react'
import { Atom } from 'xoid'
import StepLayout from './components/StepLayout'

injectGlobal({
  [`body.${bodyDraggingClass}`]: { userSelect: 'none' },
})

const Step = (props: { $stepLayout: Atom<string[][]> }) => (
  <div
    tabIndex={0}
    onClick={(e) => (e.target as HTMLElement).focus()}
    className={css({
      borderRadius: 12,
      border: '1px solid #ced1dc',
      background: '#fff',
      position: 'relative',
      marginBottom: 32,
      // without the following line, funny things happen when focused
      outline: 'none',
      '&:focus:after': {
        content: "''",
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: -1,
        pointerEvents: 'none',
        borderRadius: 12,
        border: '1px solid rgb(0 88 255)',
        outline: '3px solid rgb(33 103 243 / 20%)',
        zIndex: 2,
      },
      [`body.${bodyDraggingClass} &`]: {
        // To make sides of DropIndicators hidden during dragging
        overflow: 'hidden',
      },
    })}
  >
    <div
      style={{
        height: 65,
        display: 'flex',
        alignItems: 'center',
        padding: 10,
      }}
    >
      <div
        className={css({
          flex: 1,
          marginLeft: 12,
          fontSize: 20,
          fontWeight: 900,
        })}
      >
        Step 1
      </div>
      {/* <div style={{ fontSize: 30, color: '#6A7695', cursor: 'grab' }}>GRAB</div> */}
    </div>
    <div>
      <div
        className={css({
          margin: -0.5,
        })}
      >
        <StepLayout $stepLayout={props.$stepLayout} />
      </div>
    </div>
    <div
      style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        padding: 10,
        cursor: 'pointer',
      }}
    >
    </div>
  </div>
)

export default Step
