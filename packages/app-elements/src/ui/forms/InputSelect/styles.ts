import { type InputFeedbackProps } from '#ui/forms/InputFeedback'
import { getFeedbackCssInJs } from '#ui/internals/InputWrapper'
import { type StylesConfig } from 'react-select'
import { type InputSelectValue } from '.'

export const getSelectStyles = (
  feedbackVariant?: InputFeedbackProps['variant']
): StylesConfig<InputSelectValue> => ({
  menu: (style) => ({
    ...style,
    zIndex: 100,
    border: '1px solid rgb(230 231 231)',
    borderRadius: 5,
    boxShadow: '2px 2px 0 #f8f8f8;',
    padding: '1px'
  }),
  menuList: (style) => ({
    ...style,
    padding: '0'
  }),
  option: (style, { isSelected, isFocused, isDisabled }) => ({
    ...style,
    padding: '0.375rem 1rem',
    backgroundColor: isSelected
      ? '#EDEEEE'
      : isFocused
        ? '#F8F8F8'
        : 'transparent',
    color: isDisabled ? '#BBBEBE' : 'rgb(40 41 41)',
    fontSize: 15,
    fontWeight: isSelected ? 700 : 500,
    cursor: 'pointer',
    '&:active': {
      backgroundColor: isSelected ? '#EDEEEE' : 'rgb(248 248 248)'
    },
    '&:first-of-type': {
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5
    },
    '&:last-child': {
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5
    }
  }),
  noOptionsMessage: (style) => ({
    ...style,
    fontSize: 14
  }),
  loadingMessage: (style) => ({
    ...style,
    fontSize: 14
  }),
  container: (style) => ({
    ...style,
    width: '100%',
    textAlign: 'left'
  }),
  valueContainer: (style) => ({
    ...style,
    padding: '0.48rem 1rem',
    gap: '0.5rem'
  }),
  singleValue: (style) => ({
    ...style,
    fontWeight: 500,
    fontSize: '1rem'
  }),
  multiValue: (style) => ({
    ...style,
    backgroundColor: 'white',
    border: '1px solid #E6E7E7',
    borderRadius: '5px',
    margin: 0,
    userSelect: 'none',
    cursor: 'initial'
  }),
  multiValueLabel: (style) => ({
    ...style,
    paddingTop: '4px',
    paddingBottom: '4.5px',
    paddingLeft: '1rem',
    fontWeight: '600'
  }),
  multiValueRemove: (style) => ({
    ...style,
    color: '#878888',
    paddingRight: '0.5rem',
    '&:hover': {
      color: 'black',
      backgroundColor: 'transparent'
    },
    '> button': {
      borderRadius: '5px'
    },
    '> button:focus-within': {
      color: 'black',
      outline: 'none',
      boxShadow: '0 0 0 2px #101111'
    }
  }),
  control: (style) => {
    const feedbackStyle = getFeedbackCssInJs(feedbackVariant)
    return {
      ...style,
      ...feedbackStyle,
      borderWidth: 0,
      minHeight: '44px',

      outline: 'none',
      borderRadius: 5,
      cursor: 'pointer'
    }
  },
  placeholder: (style) => ({
    ...style,
    margin: 0,
    fontSize: '1rem',
    fontWeight: 500,
    color: '#686E6E'
  }),
  input: (style) => ({
    ...style,
    margin: 0,
    padding: 0,
    '& > input': {
      boxShadow: 'none!important'
    },
    '& > input:focus': {
      // reset `@tailwindcss/forms` base global styles
      boxShadow: 'none!important'
    }
  }),
  indicatorSeparator: (style) => ({
    ...style,
    opacity: 0
  }),
  dropdownIndicator: (style) => ({
    ...style,
    padding: '0 1rem',
    '> button': {
      borderRadius: '5px',
      padding: '2px 0'
    },
    '> button:focus-within': {
      outline: 'none',
      boxShadow: '0 0 0 2px #101111'
    }
  })
})
