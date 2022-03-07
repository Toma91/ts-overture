import { get, KeyPathGetter, KeyPathSetter, set } from "./accessors";
import { ArrayKeyPath } from "./array-readonly";
import { IsAny } from "./helpers";
import { ObjectKeyPath } from "./object-readonly";
import { WritableKeyPath } from "./readwrite";

export type KeyPath<Root extends object, Value> = true extends IsAny<Value>
  ? { [get]: KeyPathGetter<Root, Value> }
  : NonNullable<Value> extends never
  ? { [get]: KeyPathGetter<Root, Value> }
  : NonNullable<Value> extends any[]
  ? ArrayKeyPath<Root, Value>
  : NonNullable<Value> extends object
  ? ObjectKeyPath<Root, Value>
  : { [get]: KeyPathGetter<Root, Value> };

export function KeyPath<Root extends object>(): WritableKeyPath<Root, Root> {
  function makeKeyPath<Root extends object, Value>(getter: KeyPathGetter<Root, Value>, setter: KeyPathSetter<Root, Value>): WritableKeyPath<Root, Value> {
    return new Proxy({ [get]: getter, [set]: setter } as any, {
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
                const newNode = { ...node, [prop]: value }
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
