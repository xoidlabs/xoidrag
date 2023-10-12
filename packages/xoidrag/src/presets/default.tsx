import { compose } from '@xoid/feature';
import Context from '../features/Context';
import DragHelper from '../features/DragHelper';
import DragOverHelper from '../features/DragOverHelper';
import DragPreviewHelper from '../features/DragPreviewHelper';
import DropHelper from '../features/DropHelper';
import EventsHelper from '../features/EventsHelper';

const createDraggable = compose(
  [
    Context,
    DragHelper,
    DragPreviewHelper,
    DragOverHelper,
    DropHelper,
    EventsHelper,
  ],
  (from, imaginary) => from(Context<typeof imaginary.context.types>)
);

export default createDraggable