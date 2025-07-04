/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The logic to determine an overall match of the conditions.
 */
export type ConditionsLogic = "and" | "or";
/**
 * Policy to determine if a condition is a match. If value is any (default), it will match as long as one fact it's a match, if value is all, it will match if all facts are a match.
 */
export type Scope = "any" | "all";
/**
 * Identifier of the group to assign the matches of the condition invoked.
 */
export type Group = string;
/**
 * An array who contains all conditions to be evaluated by the engine within the rule.
 */
export type Conditions = (
  | {
      /**
       * Field to apply the condition.
       */
      field: string;
      /**
       * Matcher to be used against the field and value.
       */
      matcher:
        | "start_with"
        | "not_start_with"
        | "end_with"
        | "not_end_with"
        | "does_not_match"
        | "matches"
        | "multiple"
        | "eq"
        | "not_eq"
        | "lt"
        | "lteq"
        | "gt"
        | "gteq"
        | "gt_lt"
        | "gteq_lt"
        | "gt_lteq"
        | "gteq_lteq"
        | "is_in"
        | "is_not_in"
        | "array_match";
      scope?: Scope;
      group?: Group;
      value:
        | number
        | string
        | boolean
        | (string | number)[]
        | {
            /**
             * Items that are in to match in AND logic.
             */
            in_and?: (string | number)[];
            /**
             * Items that are in to match in OR logic.
             */
            in_or?: (string | number)[];
            /**
             * Items that are not in to match in AND logic.
             */
            not_in_and?: (string | number)[];
            /**
             * Items that are not to match in OR logic.
             */
            not_in_or?: (string | number)[];
          };
      /**
       * Aggregation conditions to execute within the result of the existing condition.
       */
      aggregations?: Aggregation[];
      /**
       * Nested conditions to be evaluated within the context of the main condition.
       */
      nested?: {
        conditions_logic?: ConditionsLogic;
        conditions?: Conditions;
        [k: string]: unknown;
      };
    }
  | {
      /**
       * Field to apply the condition.
       */
      field: string;
      /**
       * Matcher to be used against the field.
       */
      matcher: "blank" | "present" | "null" | "not_null";
      scope?: Scope;
      group?: Group;
      /**
       * Aggregation conditions to execute within the result of the existing condition.
       */
      aggregations?: Aggregation[];
      /**
       * Nested conditions to be evaluated within the context of the main condition.
       */
      nested?: {
        conditions_logic?: ConditionsLogic;
        conditions?: Conditions;
        [k: string]: unknown;
      };
    }
)[];
/**
 * The resource on which to apply the action (expressed in dot notation). Can be an attribute if you set also the identifier key.
 */
export type Selector = string;
/**
 * An identifier value to address one or more specific instances based on the attribute defined in the selector key (if any). Cannot be used if the selector is a resource.
 */
export type Identifier = string;
/**
 * The groups on which to apply the action (must be one or more among the ones defined when grouping the matches of the related conditions).
 */
export type Groups = string[];
/**
 * If provided, applies the action to a specific attribute instead of the default one.
 */
export type ApplyOn = string;
/**
 * Creates bundles based on the groups provided.
 */
export type Bundle =
  | {
      /**
       * The criteria to be used to select the matches and create the bundles across groups.
       */
      type?: "balanced";
      sort: Sort;
    }
  | {
      /**
       * The criteria to be used to select the matches and create the bundles across groups.
       */
      type?: "every";
      sort: Sort;
      /**
       * Value to be used to do the bundle every calculation.
       */
      value: number;
    };

/**
 * Rules payload within order context for the rules engine of Commerce Layer.
 */
export interface RulesForOrderContext {
  /**
   * Main container with all rules.
   */
  rules?: {
    /**
     * Identifier of the rule, recommended to use UUID.
     */
    id?: string;
    /**
     * Name of the rule
     */
    name: string;
    /**
     * The priority order of the rule evaluation.
     */
    priority?: number;
    conditions_logic?: ConditionsLogic;
    conditions: Conditions;
    /**
     * Array of actions that will be executed if the rule it's a match.
     */
    actions: (
      | {
          /**
           * The type of action you want to apply.
           */
          type: "percentage";
          selector: Selector;
          identifier?: Identifier;
          groups: Groups;
          aggregation?: Aggregation;
          /**
           * Percentage to be discounted,
           */
          value: number;
          apply_on?: ApplyOn;
          bundle?: Bundle;
        }
      | {
          /**
           * The type of action you want to apply.
           */
          type: "percentage";
          selector: Selector;
          identifier?: Identifier;
          groups?: Groups;
          aggregation?: Aggregation;
          /**
           * Percentage to be discounted,
           */
          value: number;
          apply_on?: ApplyOn;
          limit?: Limit;
        }
      | {
          /**
           * The type of action you want to apply.
           */
          type: "fixed_amount";
          selector: Selector;
          identifier?: Identifier;
          groups: Groups;
          aggregation?: Aggregation;
          /**
           * The discount fixed amount to be applied.
           */
          value: number;
          bundle?: Bundle;
          apply_on?: ApplyOn;
          /**
           * The type of distribution of the discount over the items.
           */
          discount_mode?: "distributed" | "default";
        }
      | {
          /**
           * The type of action you want to apply.
           */
          type: "fixed_amount";
          selector: Selector;
          identifier?: Identifier;
          groups?: Groups;
          aggregation?: Aggregation;
          /**
           * The discount fixed amount to be applied.
           */
          value: number;
          apply_on?: ApplyOn;
          limit?: Limit;
          /**
           * The type of distribution of the discount over the items.
           */
          discount_mode?: "distributed" | "default";
        }
      | {
          /**
           * The type of action you want to apply.
           */
          type: "fixed_price";
          selector: Selector;
          identifier?: Identifier;
          groups: Groups;
          aggregation?: Aggregation;
          /**
           * The price fixed amount to be applied.
           */
          value: number;
          bundle?: Bundle;
          apply_on?: ApplyOn;
        }
      | {
          /**
           * The type of action you want to apply.
           */
          type: "fixed_price";
          selector: Selector;
          identifier?: Identifier;
          groups?: Groups;
          aggregation?: Aggregation;
          /**
           * The price fixed amount to be applied.
           */
          value: number;
          apply_on?: ApplyOn;
          limit?: Limit;
        }
      | {
          /**
           * The type of action you want to apply.
           */
          type: "buy_x_pay_y";
          selector?: Selector;
          identifier?: Identifier;
          groups?: Groups;
          aggregation?: Aggregation;
          value: {
            /**
             * The buy X part of the action
             */
            x: number;
            /**
             * The pay Y part of the action.
             */
            y: number;
            /**
             * Max number of items to consider for the calculation.
             */
            result_item_limit?: number;
            [k: string]: unknown;
          };
        }
      | {
          /**
           * The type of action you want to apply.
           */
          type: "every_x_discount_y";
          selector: Selector;
          identifier?: Identifier;
          groups?: Groups;
          aggregation?: Aggregation;
          value: {
            /**
             * Amount to discount every.
             */
            x: number;
            /**
             * Amount to be discounted to each interval.
             */
            y: number;
            /**
             * Uses the field to do the calculation for the action.
             */
            attribute: string;
            [k: string]: unknown;
          };
        }
    )[];
  }[];
  [k: string]: unknown;
}
export interface Aggregation {
  /**
   * Field to apply the condition.
   */
  field: string;
  /**
   * Matcher to be used against the field and value.
   */
  matcher: "multiple" | "eq" | "not_eq" | "lt" | "lteq" | "gt" | "gteq";
  value: number;
  /**
   * Operator to aggregate over previous results.
   */
  operator: "sum" | "min" | "max" | "count" | "count_uniq";
}
/**
 * Sorting configuration for the given function
 */
export interface Sort {
  /**
   * The field to apply the sorting.
   */
  attribute: string;
  /**
   * The sort criteria to be used.
   */
  direction: "asc" | "desc";
  [k: string]: unknown;
}
/**
 * Restriction on how many resources will be affected by the action.
 */
export interface Limit {
  /**
   * The number of items to return based on the limit type.
   */
  value: number;
  sort: Sort;
}
