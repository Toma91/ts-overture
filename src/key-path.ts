/* eslint-disable no-use-before-define */

// --------------------  helpers  --------------------------------------------------------------------------------------

type ExcludeFunction<Value, K extends keyof Value> = Value[K] extends Function
  ? never
  : K

type Drop1<Arr extends any[]> = ((...args: Arr) => void) extends ((first: any, ...rest: infer Rest) => void)
  ? Rest
  : never

type IndexesOf<Arr extends any[]> = Arr extends []
  ? never
  : Partial<Drop1<Arr>>['length']

type IfAny<T, Y, N> = 0 extends (1 & T)
  ? Y
  : N;

type IsAny<T> = IfAny<T, true, never>;

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? A
  : B

// eslint-disable-next-line no-unused-vars
type WritableKeys<T> = {
  // eslint-disable-next-line no-unused-vars
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T]

type ReadonlyKeys<T> = {
  // eslint-disable-next-line no-unused-vars
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>
}[keyof T]

type NonUnitable<T> = Exclude<T, null | undefined | void>

type ExtractUnit<T> = Exclude<T, NonUnitable<T>> extends infer Unit
  ? Unit
  : never

// --------------------  accessors  ------------------------------------------------------------------------------------

export const get: unique symbol = Symbol('read a property of an object using a Key Path')
export const set: unique symbol = Symbol('write a property of an object using a Key Path')

type KeyPathGetter<Root extends object, Value> = (root: Root) => Value
type KeyPathSetter<Root extends object, Value> = (root: Root, value: Value) => void

type AccessorsForKeyPath<
  Root extends object,
  Value,
  IsWritable extends boolean
> = IsWritable extends true
  ? { [get]: KeyPathGetter<Root, Value>; [set]: KeyPathSetter<Root, Value> }
  : { [get]: KeyPathGetter<Root, Value> }

// --------------------  with unit  ------------------------------------------------------------------------------------

type ArrayKeyPathForValueWithUnit<
  Root extends object,
  ValueWithoutUnit extends any[],
  IsWritable extends boolean,
  Unit extends null | undefined | void
> = {
  [Index in IndexesOf<ValueWithoutUnit>]: KeyPath<Root, ValueWithoutUnit[Index] | Unit>
} & {
  length: KeyPath<Root, number | Unit>
} & AccessorsForKeyPath<Root, ValueWithoutUnit | Unit, IsWritable>

type ObjectKeyPathForValueWithUnit<
  Root extends object,
  ValueWithoutUnit,
  IsWritable extends boolean,
  Unit extends null | undefined | void
> = {
  [K in keyof ValueWithoutUnit as ExcludeFunction<ValueWithoutUnit, K>]-?: KeyPath<Root, ValueWithoutUnit[K] | Unit>
} & AccessorsForKeyPath<Root, ValueWithoutUnit | Unit, IsWritable>

type KeyPathForValueWithUnit<
  Root extends object,
  ValueWithoutUnit,
  IsWritable extends boolean,
  Unit extends null | undefined | void
> = ValueWithoutUnit extends any[]
  ? ArrayKeyPathForValueWithUnit<Root, ValueWithoutUnit, IsWritable, Unit>
  : ObjectKeyPathForValueWithUnit<Root, ValueWithoutUnit, IsWritable, Unit>

// --------------------  without unit  ---------------------------------------------------------------------------------

type ObjectKeyPathForRealValue<
  Root extends object,
  Value,
  IsWritable extends boolean
> = {
  [K in keyof Value as ExcludeFunction<Value, K>]-?: BaseKeyPath<
    Root,
    Value[K],
    IsWritable & (K extends ReadonlyKeys<Value> ? false : true)
  >
} & AccessorsForKeyPath<Root, Value, IsWritable>

type ArrayKeyPathForRealValue<
  Root extends object,
  Value extends any[],
  IsWritable extends boolean
> = {
  [Index in IndexesOf<Value>]: BaseKeyPath<Root, Value[Index], IsWritable>
} & {
  length: BaseKeyPath<Root, number, IsWritable>
} & AccessorsForKeyPath<Root, Value, IsWritable>

type KeyPathForRealValue<
  Root extends object,
  Value,
  IsWritable extends boolean
> = Value extends any[]
  ? ArrayKeyPathForRealValue<Root, Value, IsWritable>
  : ObjectKeyPathForRealValue<Root, Value, IsWritable>

// --------------------  key path  -------------------------------------------------------------------------------------

type ComplexKeyPath<
  Root extends object,
  Value,
  IsWritable extends boolean
> = ExtractUnit<Value> extends never
  ? KeyPathForRealValue<Root, Value, IsWritable>
  : ExtractUnit<Value> extends infer Unit
    ? Unit extends null | undefined | void
      ? KeyPathForValueWithUnit<Root, Exclude<Value, Unit>, IsWritable, Unit>
      : never
    : never

type BaseKeyPath<
  Root extends object,
  Value,
  IsWritable extends boolean
> = true extends IsAny<Value>
  ? AccessorsForKeyPath<Root, Value, IsWritable>
  : NonNullable<Value> extends never
    ? AccessorsForKeyPath<Root, Value, IsWritable>
    : NonNullable<Value> extends object
      ? ComplexKeyPath<Root, Value, IsWritable>
      : AccessorsForKeyPath<Root, Value, IsWritable>

export type WritableKeyPath<Root extends object, Value> = BaseKeyPath<Root, Value, true>
export type KeyPath<Root extends object, Value> = BaseKeyPath<Root, Value, false>

// todo: make mutable
export function KeyPath<Root extends object> (): WritableKeyPath<Root, Root> {
  function makeKeyPath<Root extends object, Value> (
    getter: KeyPathGetter<Root, Value>,
    setter: KeyPathSetter<Root, Value>,
  ): WritableKeyPath<Root, Value> {
    return new Proxy({ [get]: getter, [set]: setter } as any, {
      get (target, prop) {
        if (prop === get || prop === set) return target[prop]

        return makeKeyPath(
          (root: Root): Value[keyof Value] | null | undefined => {
            const node = target[get](root) as Value | null | undefined
            if (node === null) return null
            if (node === undefined) return undefined
            return node[prop as keyof Value]
          },
          (root: Root, value: Value[keyof Value] | null | undefined): void => {
            const node = target[get](root) as Value | null | undefined

            if (node) {
              if (Array.isArray(node)) {
                const newNode = [...node]
                newNode[prop as unknown as number] = value
                target[set](root, newNode)
              } else {
                const newNode = { ...node, [prop]: value }
                target[set](root, newNode)
              }
            }
          },
        )
      },
    })
  }

  return makeKeyPath(
    (root: Root): Root => root,
    (root: Root, value: Root): void => {
      if (Array.isArray(root)) {
        root.length = 0
      } else {
        for (const prop in root) delete root[prop]
      }

      for (const prop in value) root[prop] = value[prop]
    },
  )
}
