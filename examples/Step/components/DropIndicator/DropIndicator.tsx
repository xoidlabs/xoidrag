import { css } from '@emotion/css'
import React from 'react'
import { BaseProps, getStyles } from './getStylesMap'

const DropIndicator = (
  props: Partial<BaseProps> & {
    outline?: boolean
    borderWidth?: number
  }
) => {
  const {
    size = 4,
    direction = 'vertical',
    arrowSize = size * 2,
    outline = false,
    color = '#2388FF',
    borderWidth = 1,
  } = props

  const innerNode = (
    <div
      className={css(
        getStyles({
          size,
          arrowSize,
          color: outline ? 'rgb(232, 232, 255)' : color,
          direction
        })
      )}
      style={{
        [direction === 'vertical' ? 'height' : 'width']: `calc( 100% - ${
          outline ? borderWidth * 2 : 0
        }px )`,
        [direction === 'vertical' ? 'marginTop' : 'marginLeft']: borderWidth,
        zIndex: 1,
      }}
    />
  )

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        [direction === 'horizontal' ? 'width' : 'height']: '100%',
      }}
    >
      {outline ? (
        <div
          className={css(
            getStyles({
              size: size + borderWidth * 2,
              arrowSize: arrowSize + borderWidth + 1.41,
              color,
              direction,
            })
          )}
        >
          {innerNode}
        </div>
      ) : (
        innerNode
      )}
    </div>
  )
}

export default DropIndicator
