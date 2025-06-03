import { asUniqueArray } from '#utils/array'
import { type SetRequired } from 'type-fest'
import { type RulesForOrderContext } from './schema.order_rules'

export type Schema = SetRequired<RulesForOrderContext, 'rules'>
type SchemaRule = Schema['rules'][number]
export type SchemaCondition = NonNullable<
  SchemaRule['conditions'][number]['nested']
>
export type SchemaActionItem = NonNullable<SchemaRule['actions']>[number]
export type SchemaConditionItem = NonNullable<
  SchemaCondition['conditions']
>[number]

export interface SetPath {
  (path: string): SetPath
  (path: string, pathValue: unknown, shouldForceUpdate?: boolean): Schema
}

export type ConditionMatchersWithoutValue = Exclude<
  SchemaConditionItem,
  { value: any }
>['matcher']

export const conditionMatchersWithoutValue = asUniqueArray([
  'blank',
  'present',
  'null',
  'not_null'
]) satisfies ConditionMatchersWithoutValue[]

/**
 * This function is used to ensure that a value of type `never` is never reached.
 * @param _value - The value that is expected to be of type `never`.
 */
export function expectNever(_value: never): null {
  return null
}
