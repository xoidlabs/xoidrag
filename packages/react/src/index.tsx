import { useForkRef } from '@motif-ui/react-use-fork-ref';
import React, { useLayoutEffect, useRef } from 'react';
import { create } from 'xoid';
import Context from 'xoidrag/features/Context';

export const createUseInstanceCount = (
  onFirstAdded: () => void,
  onLastRemoved: () => void
) => {
  const $instanceCount = create(0);
  $instanceCount.subscribe((value, previousValue) => {
    if (value === 1 && previousValue === 0) {
      onFirstAdded();
    } else if (value === 0 && previousValue === 1) {
      onLastRemoved();
    }
  });

  const useInstanceCount = () =>
    useLayoutEffect(() => {
      $instanceCount.update((s) => s + 1);
      return () => $instanceCount.update((s) => s - 1);
    }, []);

  return useInstanceCount;
};

export const useMap = <T,>(
  map: Map<HTMLElement, T>,
  data: T,
  ref: React.RefObject<HTMLElement>
) =>
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    map.set(element, data);
    return () => void map.delete(element);
  }, [ref, data]);

const getReactAPI = <T extends Record<string, any>>(context: Context<T>) => {
  const { subscribe, unsubscribe, draggableMap, droppableMap } = context;
  const useInstanceCount = createUseInstanceCount(subscribe, unsubscribe);

  const useDraggable = (
    props: T['draggableData'] & { ref: React.RefObject<HTMLElement> }
  ) => {
    useMap(draggableMap, props, props.ref);
    useInstanceCount();
  };

  const useDroppable = (
    props: T['droppableData'] & { ref: React.RefObject<HTMLElement> }
  ) => useMap(droppableMap, props, props.ref);

  const Draggable = React.forwardRef(
    (props: T['draggableData'] & { children: JSX.Element }, forwardedRef) => {
      const innerRef = useRef(null);
      useDraggable({ ...props, ref: innerRef });
      const ref = useForkRef(innerRef, forwardedRef);
      return React.cloneElement(props.children, { ref });
    }
  );

  const Droppable = React.forwardRef(
    (props: T['droppableData'] & { children: JSX.Element }, forwardedRef) => {
      const innerRef = useRef(null);
      useDroppable({ ...props, ref: innerRef });
      const ref = useForkRef(innerRef, forwardedRef);
      return React.cloneElement(props.children, { ref });
    }
  );
  return { useDraggable, useDroppable, Draggable, Droppable };
};

export default getReactAPI;
