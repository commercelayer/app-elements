import { type StylesConfig } from 'react-select'
import { type SelectValue } from '.'
import { getFeedbackCssInJs } from '#ui/forms/InputWrapper'
import { type InputFeedbackProps } from '#ui/forms/InputFeedback'

export const getSelectStyles = (
  feedbackVariant?: InputFeedbackProps['variant']
): StylesConfig<SelectValue> => ({
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
  option: (style, { isSelected, isFocused }) => ({
    ...style,
    padding: '0.625rem 1rem',
    backgroundColor: isSelected
      ? '#404141'
      : isFocused
      ? '#F8F8F8'
      : 'transparent',
    color: isSelected ? '#fff' : 'rgb(40 41 41)',
    fontSize: 16,
    fontWeight: 500,
    cursor: 'pointer',
    '&:active': {
      backgroundColor: isSelected ? '#666EFF' : 'rgb(248 248 248)'
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
    ...style
  }),
  valueContainer: (style) => ({
    ...style,
    padding: '0.625rem 1rem'
  }),
  singleValue: (style) => ({
    ...style,
    fontWeight: 500,
    fontSize: '1rem'
  }),
  control: (style) => {
    const feedbackStyle = getFeedbackCssInJs(feedbackVariant)
    return {
      ...style,
      ...feedbackStyle,
      borderWidth: 0,
      minHeight: 'initial',
      boxShadow: `0 0 0 1px ${feedbackStyle.borderColor}`,
      borderRadius: 5,
      cursor: 'pointer',
      '&:hover, &:focus-within': {
        // we enforce feedback color as hover style, otherwise default brand color will be used as border
        outline: 'none',
        boxShadow: `0 0 0 2px ${
          feedbackVariant != null ? feedbackStyle.borderColor : '#666EFF'
        }`
      }
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
    '& > input:focus': {
      // reset `@tailwindcss/forms` base global styles
      boxShadow: 'none!important'
    }
  }),
  indicatorSeparator: (style) => ({
    ...style,
    opacity: 0
  })
})
