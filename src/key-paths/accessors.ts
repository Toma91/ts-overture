export const get: unique symbol = Symbol()
export const set: unique symbol = Symbol()

export type KeyPathGetter<Root extends object, Value> = (root: Root) => Value
export type KeyPathSetter<Root extends object, Value> = (root: Root, value: Value) => void
