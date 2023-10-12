# xoidrag

**xoidrag** is an extremely customizable drag-and-drop library. It was designed for drag-and-drop behaviors that the developer wants the full control of, without copying over a whole library to their repo, or implementing the thing from scratch. It has a framework-agnsotic core. Mobile/touch devices are supported.

To install:
```
npm install xoidrag xoid @xoid/feature
```

It currently offers 2 presets:
- `xoidrag/presets/default` - The default one, also exported from the root
- `xoidrag/presets/autoscroll` - Default one with autoscroll + needs `scrollparent` optional dependency

## Usage

### Vanilla JS

```js
import createDraggable from "xoidrag"
const { draggableMap, droppableMap } = createDraggable(instanceOptions)

// Usage
document.querySelectorAll('.draggable')
  .forEach((element) => draggableMap.set(element, options))

document.querySelectorAll('.droppable')
  .forEach((element) => droppableMap.set(element, options))
```

`instanceOptions` are things like `handleClass`, `disabledClass`, `dragStartDelay`, `positionDamping` for the default preset. `options` are individual, element-specific things like `onDrop`, `onDrag`, `disabled`, etc.

### React

```js
import createDraggable from "xoidrag"
import createReactAPI from "xoidrag/react"

const draggable = createDraggable(instanceOptions)
const { useDraggable, useDroppable } = createReactAPI(draggable)

// Usage (in a React component)
const ref = useRef()
useDroppable({
  ref,
  onDrop: () => {},
  onDragEnter: () => {},
  onDragLeave: () => {},
})

```

## Building custom presets

It was built on top of the plugin system: `@xoid/feature`, and `xoid` as the state manager. If you're going to build your own preset, it offers the following modules:

- `xoidrag/features/Context`
- `xoidrag/features/DragHelper`
- `xoidrag/features/DropHelper`
- `xoidrag/features/DragOverHelper`
- `xoidrag/features/DragPreviewHelper`
- `xoidrag/features/AutoScrollHelper`
...

A custom preset looks like the following:

```js
import { compose } from '@xoid/feature';
import Context from 'xoidrag/features/Context';
import DragHelper from 'xoidrag/features/DragHelper';
import DragOverHelper from 'xoidrag/features/DragOverHelper';
import DragPreviewHelper from 'xoidrag/features/DragPreviewHelper';
import DropHelper from 'xoidrag/features/DropHelper';

const createDraggable = compose(
  [Context, DragHelper, DragPreviewHelper, DragOverHelper, DropHelper],
  (from, imaginary) => from(Context<typeof imaginary.context.types>)
);

export default createDraggable;
```

You can also extends a feature and use the new class. For more, checkout `@xoid/feature` docs on npm.

```js
import DragOverHelper from 'xoidrag/features/DragOverHelper'

class CustomDragOverHelper extends DragOverHelper {
  getTargetCoordinates(e) {
    return {x: e.clientX, y: e.clientY }
  }
}

const createDraggable = compose(
  [
    ...,
    CustomDragOverHelper,
    ...,
  ],
  (from, imaginary) => from(Context<typeof imaginary.context.types>)
);

```