import type { StylesConfig } from "react-select"
import type { InputFeedbackProps } from "#ui/forms/InputFeedback"
import { getFeedbackCssInJs } from "#ui/internals/InputWrapper"
import type { InputSelectValue } from "."

export const getSelectStyles = (
  feedbackVariant?: InputFeedbackProps["variant"],
): StylesConfig<InputSelectValue> => ({
  menu: (style) => ({
    ...style,
    zIndex: 100,
    border: "1px solid #e5e5e5",
    borderRadius: 8,
    boxShadow:
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);",
    padding: "8px",
  }),
  menuList: (style) => ({
    ...style,
    padding: "0",
  }),
  option: (style, { isSelected, isFocused, isDisabled }) => ({
    ...style,
    padding: "0.375rem 1rem",
    backgroundColor: isSelected
      ? "#f8f8f8"
      : isFocused
        ? "#edeeee"
        : "transparent",
    color: isDisabled ? "#BBBEBE" : "rgb(40 41 41)",
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: isSelected ? 600 : 400,
    cursor: "pointer",
    borderRadius: "8px",
    "&:active": {
      backgroundColor: isSelected ? "#f8f8f8" : "rgb(248 248 248)",
    },
  }),
  noOptionsMessage: (style) => ({
    ...style,
    fontSize: 14,
  }),
  loadingMessage: (style) => ({
    ...style,
    fontSize: 14,
  }),
  container: (style) => ({
    ...style,
    width: "100%",
    textAlign: "left",
  }),
  valueContainer: (style, { isMulti }) => ({
    ...style,
    padding: isMulti ? "0.4375rem 0.625rem" : "0.5rem 1rem",
    gap: "0",
    "> div[class^='flex']": {
      marginRight: "6px",
    },
    "> div[class^='flex']:not(:has(~ div[class^='flex']))": {
      marginRight: "0",
    },
  }),
  singleValue: (style) => ({
    ...style,
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "20px",
  }),
  multiValue: (style) => ({
    ...style,
    backgroundColor: "white",
    border: "1px solid #E6E7E7",
    borderRadius: "5px",
    margin: 0,
    userSelect: "none",
    cursor: "initial",
  }),
  multiValueLabel: (style) => ({
    ...style,
    paddingTop: "4px",
    paddingBottom: "4.5px",
    paddingLeft: "1rem",
    fontWeight: "600",
  }),
  multiValueRemove: (style) => ({
    ...style,
    color: "#878888",
    paddingRight: "0.5rem",
    "&:hover": {
      color: "black",
      backgroundColor: "transparent",
    },
    "> button": {
      borderRadius: "8px",
    },
    "> button:focus-within": {
      color: "black",
      outline: "none",
      boxShadow: "0 0 0 2px #101111",
    },
  }),
  control: (style) => {
    const feedbackStyle = getFeedbackCssInJs(feedbackVariant)
    return {
      ...style,
      ...feedbackStyle,
      borderWidth: 0,
      minHeight: "44px",

      outline: "none",
      borderRadius: 8,
      cursor: "pointer",
    }
  },
  placeholder: (style, { isMulti }) => ({
    ...style,
    margin: 0,
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 500,
    color: "#686E6E",
    paddingLeft: isMulti ? "0.375rem" : "0",
  }),
  input: (style, { isMulti }) => ({
    ...style,
    margin: 0,
    padding: 0,
    paddingLeft: isMulti ? "0.375rem" : "0",
    fontSize: 14,
    lineHeight: "20px",
    "& > input": {
      boxShadow: "none!important",
    },
    "& > input:focus": {
      // reset `@tailwindcss/forms` base global styles
      boxShadow: "none!important",
    },
  }),
  indicatorSeparator: (style) => ({
    ...style,
    opacity: 0,
  }),
  dropdownIndicator: (style) => ({
    ...style,
    padding: "0 1rem",
    "> button": {
      borderRadius: "5px",
      padding: "2px 0",
    },
    "> button:focus-within": {
      outline: "none",
      boxShadow: "0 0 0 2px #101111",
    },
  }),
})
