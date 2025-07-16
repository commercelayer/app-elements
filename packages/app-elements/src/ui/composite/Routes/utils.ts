import type { Simplify } from "type-fest"

/**
 * Create a `Route` given a path. Route has the provided `path` and a `makePath` method that helps making a path.
 * @param path it can be a simple string (e.g. `/` or `/home/`) or a more complex with variables (e.g. `/users/:name/` or `/orders/:id?/`)
 * @returns
 */
export function createRoute<
  Path extends `/${string}/` | `/`,
  Parameters extends Record<string, unknown> = ExtractParameters<Path>,
>(path: ValidPath<Parameters, Path>): Route<Path, Parameters> {
  return {
    path: ("/" +
      path
        .replace(/\/+$/g, "")
        .replace(/^\/+/g, "")) as Path extends `/${infer P}/` ? `/${P}` : "/",
    makePath: (
      parameters: Parameters,
      searchParams?: string | URLSearchParams,
    ) => {
      const placeholderRegex = /:(\w+)[?]?/g

      const newPath =
        "/" +
        path
          .replace(placeholderRegex, (match, placeholder) => {
            const value =
              placeholder in parameters
                ? (parameters[placeholder as keyof typeof parameters] as string)
                : null
            return value ?? match
          })
          .replace(placeholderRegex, "")
          .replace(/\/+$/g, "")
          .replace(/^\/+/g, "")

      return `${newPath}${
        hasSearchParameters(searchParams) ? `?${searchParams.toString()}` : ""
      }`
    },
  }
}

/**
 * Create a typed `Route` given a path. Route has the provided `path` and a `makePath` method that helps making a path.
 * @param path it can be a simple string (e.g. `/` or `/home/`) or a more complex with variables (e.g. `/users/:name/` or `/orders/:id?/`)
 * @example
 * ```ts
 * const route = createTypedRoute<{
 *   orderNumber: number
 *   shipmentCode?: 'IT' | 'US'
 * }>()('/orders/:orderNumber/:shipmentCode?/')
 * ```
 */
export const createTypedRoute =
  <Parameters extends Record<string, any>>() =>
  <Path extends `/${string}/` | `/`>(path: ValidPath<Parameters, Path>) => {
    return createRoute<Path, Parameters>(path)
  }

/**
 * Get params from a `Route`.
 *
 * @example
 * ```ts
 * const route = createRoute('/orders/:id/:name?/')
 *
 * type Params = GetParams<typeof route>
 *
 * // equivalent to
 *
 * type Params = {
 *   id: string;
 *   name?: string | undefined;
 * }
 * ```
 *
 * @example
 * ```ts
 * const route = createTypedRoute<{ type: 'A' | 42; enabled?: boolean }>()(
 *   '/orders/:type/:enabled?/'
 * )
 *
 * type Params = GetParams<typeof route>
 *
 * // equivalent to
 *
 * type Params = {
 *   type: 'A' | '42';
 *   enabled?: "false" | "true" | undefined;
 * }
 * ```
 */
export type GetParams<R extends { makePath: (...arg: any[]) => string }> = {
  [K in keyof Parameters<R["makePath"]>[0]]: Exclude<
    ToLiteral<Parameters<R["makePath"]>[0][K]>,
    "undefined" | "null"
  >
}

/**
 * Cast a valid `string | number | bigint | boolean | null | undefined` to literal.
 *
 * @example
 * ```ts
 * type N = ToLiteral<42> //= '42'
 * type B = ToLiteral<boolean> //= 'false' | 'true'
 * ```
 */
type ToLiteral<
  V extends string | number | bigint | boolean | null | undefined,
> = `${V}`

export interface Route<
  Path extends `/${string}/` | `/`,
  Parameters extends Record<string, unknown> = ExtractParameters<Path>,
> {
  path: Path extends `/${infer P}/` ? `/${P}` : "/"
  makePath: (
    parameters: Parameters,
    searchParams?: string | URLSearchParams,
  ) => string
}

function hasSearchParameters(
  searchParams?: string | URLSearchParams,
): searchParams is string {
  return Array.from(new URLSearchParams(searchParams)).length > 0
}

type ExtractParameters<Path extends string> =
  Path extends `${string}:${infer Var}/${infer Rest}`
    ? Simplify<
        FixOptional<{ [key in Var]: string | number | boolean }> &
          ExtractParameters<Rest>
      >
    : // biome-ignore lint/complexity/noBannedTypes: We want to allow empty paths
      {}

type FixOptional<T extends Record<string, any>> = Omit<T, `${string}?`> & {
  [K in keyof T as K extends `${infer VariableName}?`
    ? VariableName
    : never]?: T[K]
}

type ErrorParameters<
  Parameters extends Record<string, any>,
  Path extends string,
> = keyof ({
  [key in keyof ExtractParameters<Path> as key extends keyof Parameters
    ? never
    : undefined extends ExtractParameters<Path>[key]
      ? key extends string
        ? `${key}?`
        : key
      : key]-?: "Is not properly set."
} & {
  [key in keyof Parameters as key extends string
    ? Path extends `${string}/:${key}${undefined extends Parameters[key]
        ? "?"
        : ""}/${string}`
      ? never
      : undefined extends Parameters[key]
        ? `${key}?`
        : key
    : never]-?: "Is not properly set."
})

type ValidPath<
  Parameters extends Record<string, any>,
  Path extends string,
> = ErrorParameters<Parameters, Path> extends never
  ? Path
  : `Missing variable '${ErrorParameters<Parameters, Path> extends string
      ? ErrorParameters<Parameters, Path>
      : "unknown"}'`
