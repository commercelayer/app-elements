import { XIcon } from "@phosphor-icons/react";
import cn from "classnames";
import { forwardRef, type JSX, useEffect, useMemo, useState } from "react";
import ReactCurrencyInputField, {
  type CurrencyInputProps as ReactCurrencyInputFieldProps,
} from "react-currency-input-field";
import type { Currency, CurrencyCode } from "#helpers/currencies";
import { t } from "#providers/I18NProvider";
import {
  getFeedbackStyle,
  InputWrapper,
  type InputWrapperBaseProps,
} from "#ui/internals/InputWrapper";
import {
  formatCentsToCurrency,
  getCurrency,
  getDecimalLength,
  makePlaceholder,
} from "./utils";

export interface InputCurrencyProps
  extends
    InputWrapperBaseProps,
    Pick<ReactCurrencyInputFieldProps, "onBlur" | "onClick" | "disabled"> {
  /**
   * HTML input id
   */
  id?: string;
  /**
   * Field name
   */
  name?: string;
  /**
   * Input placeholder
   */
  placeholder?: string;
  /**
   * Optional CSS class names used for the input element
   */
  className?: string;
  /**
   * Valid 3-digit iso currency code (eg: EUR, USD, GBP)
   */
  currencyCode: CurrencyCode;
  /**
   * Value in cents
   */
  cents?: number | null;
  /**
   * onChange callback triggered when during typing
   */
  onChange: (cents: number | null, formatted: string) => void;
  /**
   * Hide currency symbol but keep the currency formatting
   */
  hideCurrencySymbol?: boolean;
  /**
   * It defines which are the available signs.
   *
   * By default only `+` sign is allowed, but you can set it to `-` if you want to use only negative numbers.
   *
   * The signs `+-` and `-+` can accept both positive and negative numbers (first sign is the default).
   * @default +
   */
  sign?: "+" | "-" | "+-" | "-+";
  /**
   * Show (X) button to clear the input
   */
  isClearable?: boolean;
}

export const InputCurrency = forwardRef<HTMLInputElement, InputCurrencyProps>(
  (
    {
      className,
      label,
      hint,
      feedback,
      cents,
      onChange,
      currencyCode,
      placeholder,
      hideCurrencySymbol,
      sign = "+",
      isClearable,
      inline,
      ...rest
    },
    ref,
  ): JSX.Element => {
    const currency = useMemo(() => getCurrency(currencyCode), [currencyCode]);

    const [_value, setValue] = useState<string | number | undefined>(
      makeInitialValue({ cents, currency }),
    );

    const decimalLength = useMemo(
      () => (currency != null ? getDecimalLength(currency) : 0),
      [currency],
    );

    useEffect(() => {
      setValue(makeInitialValue({ cents, currency }));
    }, [cents, currency]);

    if (currency == null) {
      return (
        <div>{t("common.forms.currency_code_not_valid", { currencyCode })}</div>
      );
    }

    if (cents != null && cents > 0 && cents % 1 !== 0) {
      return <div>{t("common.forms.cents_not_integer", { cents })}</div>;
    }

    const allowNegativeValue = sign.includes("-");
    const defaultSign = sign.startsWith("+") ? "+" : "-";

    return (
      <InputWrapper
        label={label}
        hint={hint}
        feedback={feedback}
        inline={inline}
        name={rest.id ?? rest.name}
      >
        <div className="relative w-full">
          {hideCurrencySymbol === true ? null : (
            <div
              data-testid="inputCurrency-symbol"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 font-semibold text-xs"
            >
              {currency.symbol}
            </div>
          )}
          <ReactCurrencyInputField
            ref={ref}
            data-testid="inputCurrency-input"
            id={rest.id ?? rest.name}
            className={cn(
              className,
              "block w-full pr-4 py-2.5 text-sm",
              {
                "pl-4": hideCurrencySymbol === true,
                "pl-8": hideCurrencySymbol !== true,
              },
              "rounded outline-0",
              getFeedbackStyle(feedback),
            )}
            disableAbbreviations
            allowNegativeValue={allowNegativeValue}
            allowDecimals={decimalLength > 0}
            decimalsLimit={decimalLength}
            decimalSeparator={currency.decimal_mark}
            groupSeparator={currency.thousands_separator}
            placeholder={
              placeholder ??
              makePlaceholder(currency, defaultSign === "-" ? "-" : "")
            }
            value={_value ?? ""}
            transformRawValue={(rawValue) => {
              const noMinus = rawValue.replaceAll("-", "");
              const notEmpty = rawValue != null && rawValue !== "";

              const newValue =
                sign === "+"
                  ? noMinus
                  : sign === "-" && notEmpty
                    ? `-${noMinus}`
                    : rawValue;

              if (newValue.length === 1 && _value == null) {
                return `${defaultSign === "-" ? "-" : ""}${newValue}`;
              }

              return newValue;
            }}
            onValueChange={(val, __, values) => {
              setValue(val);
              if (values?.float == null) {
                onChange(null, "");
                return;
              }
              const newValue = Math.round(
                values.float * currency.subunit_to_unit,
              );
              const newFormatted = formatCentsToCurrency(
                newValue,
                currencyCode,
              );
              onChange(newValue, newFormatted);
            }}
            {...rest}
          />
          {isClearable === true && _value != null ? (
            <button
              type="button"
              onClick={() => {
                setValue("");
                onChange(null, "");
              }}
              className="bg-gray-100 text-gray-400 rounded-full p-1.5 absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <XIcon size={12} />
            </button>
          ) : null}
        </div>
      </InputWrapper>
    );
  },
);

InputCurrency.displayName = "InputCurrency";

/**
 * Prepare the initial value for the component internal state.
 **/
function makeInitialValue({
  cents,
  currency,
}: {
  cents?: number | null;
  currency?: Currency;
}): number | undefined {
  if (cents == null || currency == null) {
    return;
  }

  return cents / currency.subunit_to_unit;
}
