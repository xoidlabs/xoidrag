import { css } from '@emotion/css';
import createDraggable from 'xoidrag';
import createReactAPI from '@xoidrag/react';
import WidthLimiterHelper from './WidthLimiterHelper';

export const bodyDraggingClass = 'is-dragging';
export const handleClass = 'drag-handle';

const originalElementClass = css({
  '& > *': { opacity: 0, pointerEvents: 'none' },
  outline: 'none !important',
  boxShadow: 'none !important',
  border: '1px dashed #ced1dc !important',
  padding: '0 !important',
  borderColor: 'transparent !important',
  marginRight: '-2px !important',
  marginBottom: '-2px !important',
  transition: 'min-height 200ms, padding 200ms, flex 200ms',
  width: '0 !important',
  flex: '0 !important',
  minHeight: '0 !important',
  height: '0 !important',
  overflow: 'hidden',
  margin: 0,
});


export const draggable = createDraggable({
  handleClass,
  onDragStart: () => document.body.classList.add(bodyDraggingClass),
  onDragEnd: () => document.body.classList.remove(bodyDraggingClass),
  originalElementClass,
}, [WidthLimiterHelper]);

export const { useDraggable, useDroppable } = createReactAPI(draggable)