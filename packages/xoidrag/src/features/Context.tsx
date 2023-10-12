import { Feature } from '@xoid/feature';
import { create } from 'xoid';
import { createMap } from '../utils';
import PointerHelper from './PointerHelper';

const isLeftClickOrTouch = (e: MouseEvent | TouchEvent) =>
  ((e as MouseEvent)?.button === 0 || e instanceof TouchEvent) && e.target;

const hasClass = (item?: EventTarget, className?: string) =>
  Boolean(
    className &&
      (item as HTMLElement | undefined)?.classList?.contains(className)
  );


export default class Context<T extends Record<string, any>> extends Feature<{
  disabledClass?: string;
  handleClass?: string;
}> {
  types!: T;

  $draggableData = create<{
    element: HTMLElement;
    data: T['draggableData'];
    delete?: boolean;
  }>();

  $droppableData = create<{
    element: HTMLElement;
    data: T['droppableData'];
    delete?: boolean;
  }>();

  draggableMap = createMap(this.$draggableData, (s) => [s.element, s.data]);
  droppableMap = createMap(this.$droppableData, (s) => [s.element, s.data]);

  originalElement!: HTMLElement;
  draggingElement!: HTMLElement;
  get currentDraggableData() {
    return this.draggableMap.get(this.originalElement)!;
  }

  $dragStartEvent = create<MouseEvent | Touch>();
  $dragMoveEvent = create<MouseEvent | Touch>();
  $dragEndEvent = create<MouseEvent | Touch>();

  pointerHelper = new PointerHelper({
    dragStartDelay: 200,
    dragStartPredicate: (e) => {
      if (!isLeftClickOrTouch(e)) {
        return false;
      }

      let composedPath = e.composedPath();
      let isDisabled!: boolean;
      let isHandle!: boolean;

      const index = composedPath.findIndex((item) => {
        isDisabled = hasClass(item, this.options.disabledClass);
        isHandle = hasClass(item, this.options.handleClass);
        return isDisabled || isHandle;
      });


      if (isDisabled || (this.options.handleClass && !isHandle)) {
        return false;
      }

      if (isHandle) {
        composedPath = composedPath.slice(index);
      }

      const maybeElement = composedPath.find((item) =>
        this.draggableMap.get(item as HTMLElement)
      );

      if (maybeElement) {
        this.originalElement = maybeElement as HTMLElement;
        return true;
      }
      return false;
    },
    dragStart: this.$dragStartEvent.set,
    dragMove: this.$dragMoveEvent.set,
    dragEnd: this.$dragEndEvent.set,
  });
  subscribe = () => this.pointerHelper.subscribe();
  unsubscribe = () => this.pointerHelper.unsubscribe();
}
