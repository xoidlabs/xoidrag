import { Feature } from '@xoid/feature';
import Context from './Context';

export default class DropHelper extends Feature {
  context = this.from(
    Context<{
      droppableData: {
        disabled?: boolean;
        onDrop: (id: string) => void;
      };
      draggableData: {
        id: string;
        onRemove?: () => void;
      };
    }>
  );
  
  main() {
    const { droppableMap, $dragEndEvent } = this.context;
    $dragEndEvent.subscribe((e) => {
      const currentDroppable = document.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement | null;
      if (!currentDroppable) {
        return;
      }
      const droppableData = droppableMap.get(currentDroppable)!;
      if (!droppableData || droppableData.disabled) {
        return;
      }
      const { currentDraggableData } = this.context;

      currentDraggableData.onRemove?.();
      droppableData.onDrop(currentDraggableData.id);
    });
  }
}
