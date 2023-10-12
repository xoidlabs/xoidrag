import { Stream } from 'xoid';

const objMap = (fn: any, obj: any) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value)])
  );

export const map = ((fn: any, obj: any) =>
  Array.isArray(obj) ? obj.map(fn) : objMap(fn, obj)) as {
    <T, U, V extends Record<string, T>>(fn: (value: T) => U, obj: V): {
      [K in keyof V]: U;
    };
    <T, U, V extends T[]>(fn: (value: T) => U, obj: V): U[];
  };

export const createMap = <T extends { delete?: boolean }, Key, Value>(
  atom: Stream<T>,
  accessor: (payload: T) => [Key, Value]
) => {
  const answer = new Map<Key, Value>();
  atom.subscribe((payload) => {
    const [key, value] = accessor(payload);
    if (payload.delete) {
      answer.delete(key);
    } else {
      answer.set(key, value);
    }
  });

  return answer;
};

export function pick<T, K extends keyof T>(keys: readonly K[], obj: T): Pick<T, Exclude<keyof T, Exclude<keyof T, K>>> {
  const pickedObject = {} as any;
  
  keys.forEach((key) => {
    if (Object.hasOwnProperty.call(obj, key)) {
      pickedObject[key] = obj[key];
    }
  });
  
  return pickedObject;
}