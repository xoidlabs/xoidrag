import { Feature } from '@xoid/feature';
import Context from './Context';

const round = (num: number) => parseFloat(num.toFixed(1));

const moveElement = ({ style }: HTMLElement, x: number, y: number) => {
  const transform = `translateX( ${x}px ) translateY( ${y}px )`;
  style.transform = transform;
};

export default class DragHelper extends Feature<{ positionDamping?: number }> {
  options = this.getOptions({ positionDamping: 1 });
  context = this.from(Context);

  main() {
    const { $dragStartEvent, $dragMoveEvent, $dragEndEvent } = this.context;
    $dragStartEvent.subscribe(this.start);
    $dragMoveEvent.subscribe(this.move);
    $dragEndEvent.subscribe(this.end);
  }

  raf!: number;
  startX!: number;
  startY!: number;
  dragHelperData!: ReturnType<DragHelper['createDragHelperData']>;

  createDragHelperData = () => ({
    // Element's transforms, stays consistent with element's style
    actual: { position: { x: 0, y: 0 } },
    // Element's target transforms, applied after some optional damping
    target: { position: { x: 0, y: 0 } },
    // Element's transforms at the moment of mousedown (used as a reference)
    initial: { position: { x: 0, y: 0 } },
  });

  start = (e: MouseEvent | Touch) => {
    this.dragHelperData = this.createDragHelperData();
    this.startX = e.clientX;
    this.startY = e.clientY;
    requestAnimationFrame(this.animate);
  };

  move = (e: MouseEvent | Touch) => {
    const { target } = this.dragHelperData;
    target.position.x = e.clientX - this.startX;
    target.position.y = e.clientY - this.startY;
  };

  end = () => {
    moveElement(this.context.draggingElement, 0, 0);
    cancelAnimationFrame(this.raf);
  };

  animate = () => {
    const { positionDamping } = this.options;
    const { draggingElement } = this.context;
    const { target, actual } = this.dragHelperData;

    actual.position.x += round(
      (target.position.x - actual.position.x) * positionDamping
    );
    actual.position.y += round(
      (target.position.y - actual.position.y) * positionDamping
    );
    moveElement(draggingElement, actual.position.x, actual.position.y);

    this.raf = requestAnimationFrame(this.animate);
  };
}
