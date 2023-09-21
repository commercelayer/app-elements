type Invalid<T> = Error & { __errorMessage: T }

type AsUniqueArray<A extends readonly any[], B extends readonly any[]> = {
  [I in keyof A]: unknown extends {
    [J in keyof B]: J extends I ? never : B[J] extends A[I] ? unknown : never
  }[number]
    ? Invalid<[A[I], 'is repeated']>
    : A[I]
}

export const asUniqueArray = <
  N extends string,
  A extends [] | (readonly N[] & AsUniqueArray<A, A>)
>(
  a: A
): A => a
