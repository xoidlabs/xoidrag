import { Feature } from '@xoid/feature';
import { pick, map } from '../utils';
import Context from './Context';

export type DOMRectMin = {
  width: number;
  height: number;
  left: number;
  top: number;
};

export default class DragPreviewHelper extends Feature<{
  dragPreviewContainerClassName?: string;
}> {
  context = this.from(Context);
  draggingElementContainer = this.createPreviewElementContainer();
  rect?: DOMRectMin;

  main() {
    const { $dragStartEvent, $dragEndEvent } = this.context;
    $dragStartEvent.subscribe(this.createDraggingElement);
    $dragEndEvent.subscribe(() => this.context.draggingElement.remove());
  }

  createPreviewElementContainer() {
    const element = document.createElement('div');
    Object.assign(element.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      pointerEvents: 'none',
    })
    document.body.append(element);
    return element;
  }

  createDraggingElement = () => {
    const { originalElement } = this.context;
    this.context.draggingElement = originalElement.cloneNode(
      true
    ) as HTMLElement;

    Object.assign(this.context.draggingElement.style, {
      position: 'absolute',
    })

    const rect = originalElement.getBoundingClientRect();
    const computedStyle = getComputedStyle(originalElement);

    const style = map(
      parseFloat,
      pick(
        ['marginLeft', 'marginTop', 'marginRight', 'marginBottom'],
        computedStyle
      )
    );

    const computedRect = {
      left: rect.left - style.marginLeft,
      top: rect.top - style.marginTop,
      width: rect.width + style.marginLeft + style.marginRight,
      height: rect.height + style.marginTop + style.marginBottom,
    };
    this.rect = computedRect;

    Object.assign(
      this.context.draggingElement.style,
      map((item) => `${item}px`, computedRect)
    );

    this.draggingElementContainer.append(this.context.draggingElement);
  };
}
