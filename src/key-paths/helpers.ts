export type ExcludeFunction<Value, K extends keyof Value> = Value[K] extends Function
  ? never
  : K

export type IfContainsNull<Value, IfTrue, IfFalse> = null extends Value
  ? IfTrue
  : IfFalse

export type IfContainsUndefined<Value, IfTrue, IfFalse> = undefined extends Value
  ? IfTrue
  : IfFalse

type Drop1<Arr extends any[]> = ((...args: Arr) => void) extends ((first: any, ...rest: infer Rest) => void)
  ? Rest
  : never

export type IndexesOf<Arr extends any[]> = Arr extends []
  ? never
  : Partial<Drop1<Arr>>['length']

type IfAny<T, Y, N> = 0 extends (1 & T)
  ? Y
  : N;

export type IsAny<T> = IfAny<T, true, never>

type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B;

// type WritableKeys<T> = {
//   [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
// }[keyof T];

export type ReadonlyKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>
}[keyof T];
