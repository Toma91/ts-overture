const get: unique symbol = Symbol()
const set: unique symbol = Symbol()

type KeyPathGetter<Root extends object, Value> = (root: Root) => Value
type KeyPathSetter<Root extends object, Value> = (root: Root, value: Value) => void
