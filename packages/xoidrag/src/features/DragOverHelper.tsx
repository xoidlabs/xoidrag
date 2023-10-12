import { Feature } from '@xoid/feature';
import Context from './Context';

export default class DragOverHelper extends Feature {
  context = this.from(
    Context<{
      droppableData: {
        onDragEnter?: (element: HTMLElement) => void;
        onDragLeave?: (element: HTMLElement) => void;
      };
    }>
  );

  $dragOverElement = this.context.$dragMoveEvent.map((event) => {
    const { x, y } = this.getTargetCoordinates(event);
    const element = document.elementFromPoint(x, y) as HTMLElement | null;
    return element && this.context.droppableMap.get(element)
      ? element
      : undefined;
  });

  getTargetCoordinates(event: MouseEvent | Touch) {
    return { x: event.clientX, y: event.clientY };
  }

  main() {
    const { droppableMap, $dragEndEvent } = this.context;

    this.$dragOverElement
      .map((element) => element && droppableMap.get(element))
      // Don't filter out undefined values
      .subscribe((data) => data?.onDragEnter?.(this.$dragOverElement.value!));

    this.$dragOverElement.subscribe(
      (_value, previousValue) =>
        previousValue &&
        droppableMap.get(previousValue)!.onDragLeave?.(previousValue)
    );

    $dragEndEvent.subscribe(() => this.$dragOverElement.set(undefined));

    $dragEndEvent
      .map(() => droppableMap.get(this.$dragOverElement.value!), true)
      .subscribe((data) => data.onDragLeave?.(this.$dragOverElement.value!));
  }
}
