// --------------------  helpers  --------------------------------------------------------------------------------------

type ExcludeFunction<Value, K extends keyof Value> = Value[K] extends Function ? never : K


type Drop1<Arr extends any[]> = ((...args: Arr) => void) extends ((first: any, ...rest: infer Rest) => void)
  ? Rest
  : never

type IndexesOf<Arr extends any[]> = Arr extends []
  ? never
  : Partial<Drop1<Arr>>['length']


type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N; 

type IsAny<T> = IfAny<T, true, never>;


type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B

type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T]

type ReadonlyKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>
}[keyof T]


type NonUnitable<T> = Exclude<T, null | undefined | void>

type ExtractUnit<T> = Exclude<T, NonUnitable<T>> extends infer Unit
  ? Unit
  : never

// --------------------  accessors  ------------------------------------------------------------------------------------

export const get: unique symbol = Symbol()
export const set: unique symbol = Symbol()

type KeyPathGetter<Root extends object, Value> = (root: Root) => Value
type KeyPathSetter<Root extends object, Value> = (root: Root, value: Value) => void

type AccessorsForKeyPath<
  Root extends object,
  Value,
  IsWritable extends boolean
> = IsWritable extends true
  ? { [get]: KeyPathGetter<Root, Value>; [set]: KeyPathSetter<Root, Value> }
  : { [get]: KeyPathGetter<Root, Value> }

// --------------------  object  ---------------------------------------------------------------------------------------

type Unified_ObjectKeyPathForUnitableValue<
  Root extends object,
  NonUnitableValue,
  IsWritable extends boolean,
  Unit extends null | undefined | void
> = {
  [K in keyof NonUnitableValue as ExcludeFunction<NonUnitableValue, K>]-?: KeyPath<Root, NonUnitableValue[K] | Unit>
} & AccessorsForKeyPath<Root, NonUnitableValue | Unit, IsWritable>
 
type Unified_ObjectKeyPathForRealValue<
  Root extends object,
  Value,
  IsWritable extends boolean
> = {
  [K in keyof Value as ExcludeFunction<Value, K>]-?: Unified_KeyPath<Root, Value[K], IsWritable & (K extends ReadonlyKeys<Value> ? false : true)>
} & AccessorsForKeyPath<Root, Value, IsWritable>

type Unified_ObjectKeyPath<
  Root extends object,
  Value,
  IsWritable extends boolean
> = ExtractUnit<Value> extends never
  ? Unified_ObjectKeyPathForRealValue<Root, Value, IsWritable>
  : ExtractUnit<Value> extends infer Unit
    ? Unit extends null | undefined | void
      ? Unified_ObjectKeyPathForUnitableValue<Root, Exclude<Value, Unit>, IsWritable, Unit>
      : never
    : never

// --------------------  array  ----------------------------------------------------------------------------------------

type Unified_ArrayKeyPathForUnitableValue<
  Root extends object,
  NonUnitableArrayValue,
  IsWritable extends boolean,
  Unit extends null | undefined | void
> = NonUnitableArrayValue extends any[] ? {
  [Index in IndexesOf<NonUnitableArrayValue>]: KeyPath<Root, NonUnitableArrayValue[Index] | Unit>
} & AccessorsForKeyPath<Root, NonUnitableArrayValue | Unit, IsWritable> & {
  length: KeyPath<Root, number | Unit>
} : never

/*type Unified_ArrayKeyPathForNullableArrayValue<
  Root extends object,
  NonNullableArrayValue,
  IsWritable extends boolean
> = NonNullableArrayValue extends any[] ? {
  [Index in IndexesOf<NonNullableArrayValue>]: KeyPath<Root, NonNullableArrayValue[Index] | null>
} & AccessorsForKeyPath<Root, NonNullableArrayValue | null, IsWritable> & {
  length: KeyPath<Root, number | null>
} : never

type Unified_ArrayKeyPathForUndefineableArrayValue<
  Root extends object,
  NonUndefineableArrayValue,
  IsWritable extends boolean
> = NonUndefineableArrayValue extends any[] ? {
  [Index in IndexesOf<NonUndefineableArrayValue>]: KeyPath<Root, NonUndefineableArrayValue[Index] | undefined>
} & AccessorsForKeyPath<Root, NonUndefineableArrayValue | undefined, IsWritable> & {
  length: KeyPath<Root, number | undefined>
} : never*/

type Unified_ArrayKeyPathForRealArrayValue<
  Root extends object,
  ArrayValue,
  IsWritable extends boolean
> = ArrayValue extends any[] ? {
  [Index in IndexesOf<ArrayValue>]: Unified_KeyPath<Root, ArrayValue[Index], IsWritable>
} & AccessorsForKeyPath<Root, ArrayValue, IsWritable> & {
  length: Unified_KeyPath<Root, number, IsWritable>
} : never

/*type Unified_ArrayKeyPath<
  Root extends object,
  ArrayValue,
  IsWritable extends boolean
> = IfContainsNull<
  ArrayValue,
  Unified_ArrayKeyPathForNullableArrayValue<Root, Exclude<ArrayValue, null>, IsWritable>,
  IfContainsUndefined<
    ArrayValue,
    Unified_ArrayKeyPathForUndefineableArrayValue<Root, Exclude<ArrayValue, undefined>, IsWritable>,
    Unified_ArrayKeyPathForRealArrayValue<Root, ArrayValue, IsWritable>
  >
>*/

type Unified_ArrayKeyPath<
  Root extends object,
  ArrayValue,
  IsWritable extends boolean
> = ExtractUnit<ArrayValue> extends never
  ? Unified_ArrayKeyPathForRealArrayValue<Root, ArrayValue, IsWritable>
  : ExtractUnit<ArrayValue> extends infer Unit
    ? Unit extends null | undefined | void
      ? Unified_ArrayKeyPathForUnitableValue<Root, Exclude<ArrayValue, Unit>, IsWritable, Unit>
      : never
    : never

// --------------------  key path  -------------------------------------------------------------------------------------

type Unified_KeyPath<Root extends object, Value, IsWritable extends boolean> = true extends IsAny<Value>
  ? AccessorsForKeyPath<Root, Value, IsWritable>
  : NonNullable<Value> extends never
    ? AccessorsForKeyPath<Root, Value, IsWritable>
    : NonNullable<Value> extends any[]
      ? Unified_ArrayKeyPath<Root, Value, IsWritable>
      : NonNullable<Value> extends object
        ? Unified_ObjectKeyPath<Root, Value, IsWritable>
        : AccessorsForKeyPath<Root, Value, IsWritable>

export type WritableKeyPath<Root extends object, Value> = Unified_KeyPath<Root, Value, true>
export type KeyPath<Root extends object, Value> = Unified_KeyPath<Root, Value, false>

export function KeyPath<Root extends object>(): WritableKeyPath<Root, Root> {
  function makeKeyPath<
    Root extends object,
    Value
  >(
    getter: KeyPathGetter<Root, Value>,
    setter: KeyPathSetter<Root, Value>
  ): WritableKeyPath<Root, Value> {
    return new Proxy({[get]: getter, [set]: setter} as any, {
      get(target, prop) {
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
                const newNode = {...node, [prop]: value}
                target[set](root, newNode)
              }
            }
          },
        )
      }
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
    }
  )
}
