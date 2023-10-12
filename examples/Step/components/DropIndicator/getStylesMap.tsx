const getTriangleStyles = (options: {
  color: string
  size: number
  triangleDirection: 'up' | 'down' | 'left' | 'right'
  top?: number
  bottom?: number
  left?: number
  right?: number
}) => {
  const { size, color, triangleDirection, ...rest } = options
  const zeroBorder = `${size}px solid transparent`
  const defaultBorder = `${size}px solid ${color}`

  const directionMap = {
    up: () => ({ borderBottom: defaultBorder }),
    down: () => ({ borderTop: defaultBorder }),
    left: () => ({ borderRight: defaultBorder }),
    right: () => ({ borderLeft: defaultBorder }),
  }

  return {
    position: 'absolute',
    content: `''`,
    border: zeroBorder,
    ...directionMap[triangleDirection](),
    ...rest,
  } as const
}

export type BaseProps = { color: string; size: number; arrowSize: number; direction: 'horizontal' | 'vertical' }

export const getStyles = (props: BaseProps) => {
  const { size, arrowSize = size * 2, color } = props

  if(props.direction === 'vertical') {
    return {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: color,
      width: size,
      height: '100%',
      '&:before': getTriangleStyles({
        color,
        size: arrowSize,
        triangleDirection: 'down',
        top: 0,
      }),
      '&:after': getTriangleStyles({
        color,
        size: arrowSize,
        triangleDirection: 'up',
        bottom: 0,
      }),
    } as const
  }

  return {
    position: 'absolute',
    backgroundColor: color,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: size,
    width: '100%',
    '&:before': getTriangleStyles({
      color,
      size: arrowSize,
      triangleDirection: 'right',
      left: 0,
    }),
    '&:after': getTriangleStyles({
      color,
      size: arrowSize,
      triangleDirection: 'left',
      right: 0,
    }),
  } as const
}
