import { Feature } from '@xoid/feature';
import Context from 'xoidrag/features/Context';

// Commented out lines can be used in case the drag handle is moved to the right side in the future.
export default class DragPreviewWidthLimiterHelper extends Feature<{
  widthTreshold?: number;
}> {
  options = this.getOptions({ widthTreshold: 280 });
  context = this.from(Context);

  main() {
    this.context.$dragStartEvent.subscribe((e) => {
      const { widthTreshold } = this.options;
      const { draggingElement } = this.from(Context);
      const { width, left } = draggingElement.getBoundingClientRect();

      const difference = Math.max(width - widthTreshold, 0);
      const nextWidth = difference ? widthTreshold : width;
      const multiplier = (e.clientX - left) / width;
      const nextLeft = multiplier * difference + left;

      Object.assign(draggingElement.style, {
        transition: 'width 400ms, left 400ms',
        left: `${nextLeft}px`,
        width: `${nextWidth}px`,
      });
    });
  }
}
