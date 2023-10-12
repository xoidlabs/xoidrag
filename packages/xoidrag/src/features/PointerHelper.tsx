import { Feature } from '@xoid/feature';

export default class PointerHelper extends Feature<{
  dragStart: (e: MouseEvent | Touch) => void;
  dragMove: (e: MouseEvent | Touch) => void;
  dragEnd: (e: MouseEvent | Touch) => void;
  dragStartDelay?: number;
  dragStartPredicate?: (e: MouseEvent | TouchEvent) => boolean;
}> {
  options = this.getOptions({
    dragStartDelay: 0,
    dragStartPredicate: () => true,
  });

  startDraggingTimeout: null | ReturnType<typeof setTimeout> = null;
  dragging = false;
  settings = {};

  subscribe() {
    window.addEventListener('mousedown', this._dragStart, this.settings);
    window.addEventListener('mousemove', this._dragMove, this.settings);
    window.addEventListener('mouseup', this._dragEnd, this.settings);
    window.addEventListener('touchstart', this._dragStart, this.settings);
    window.addEventListener('touchmove', this._dragMove, this.settings);
    window.addEventListener('touchend', this._dragEnd, this.settings);
  }

  unsubscribe() {
    window.removeEventListener('mousedown', this._dragStart, this.settings);
    window.removeEventListener('mousemove', this._dragMove, this.settings);
    window.removeEventListener('mouseup', this._dragEnd, this.settings);
    window.removeEventListener('touchstart', this._dragStart, this.settings);
    window.removeEventListener('touchmove', this._dragMove, this.settings);
    window.removeEventListener('touchend', this._dragEnd, this.settings);
  }

  _dragStart = (event: MouseEvent | TouchEvent) => {
    const { dragStartPredicate, dragStartDelay, dragStart } = this.options;
    const e = getTouchAsMouseEvent(event);

    if (dragStartPredicate(event)) {
      if (dragStartDelay === 0) {
        this.dragging = true;
      } else {
        this.startDraggingTimeout = setTimeout(() => {
          this.dragging = true;
          this.startDraggingTimeout = null;
          dragStart(e);
        }, dragStartDelay);
      }
    }
  };

  _dragMove = (event: MouseEvent | TouchEvent) => {
    const { dragMove } = this.options;
    const e = getTouchAsMouseEvent(event);
    if (this.dragging) {
      dragMove(e);
    }
  };

  _dragEnd = (event: MouseEvent | TouchEvent) => {
    const { dragEnd } = this.options;
    const e = getTouchAsMouseEvent(event);

    if (this.startDraggingTimeout) {
      clearTimeout(this.startDraggingTimeout);
      this.startDraggingTimeout = null;
    }
    if (this.dragging) {
      dragEnd(e);
      this.dragging = false;
    }
  };
}

const getTouchAsMouseEvent = (event: MouseEvent | TouchEvent) =>
  (event as TouchEvent).touches
    ? (event as TouchEvent).touches.length
      ? (event as TouchEvent).touches[0]
      : (event as TouchEvent).changedTouches[0]
    : (event as MouseEvent);
