import { StylesConfig } from 'react-select'
import { SelectValue } from '.'
import { getFeedbackCssInJs } from '#ui/forms/InputWrapper'
import { InputFeedbackProps } from '#ui/forms/InputFeedback'

export const getSelectStyles = (
  feedbackVariant?: InputFeedbackProps['variant']
): StylesConfig<SelectValue> => ({
  menu: (style) => ({
    ...style,
    zIndex: 100,
    border: '1px solid rgb(230 231 231)',
    borderRadius: 5,
    boxShadow: 'none',
    padding: '0 0 1.5rem'
  }),
  menuList: (style) => ({
    ...style
  }),
  option: (style, { isSelected, isFocused }) => ({
    ...style,
    backgroundColor: isSelected
      ? '#666EFF'
      : isFocused
      ? 'rgba(102,110,255,0.1)'
      : '#fff',
    color: isSelected ? '#fff' : 'rgb(40 41 41)',
    fontSize: 14,
    cursor: 'pointer',
    '&:active': {
      backgroundColor: isSelected ? '#666EFF' : 'rgb(248 248 248)'
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
    padding: '0 1rem'
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
      minHeight: '2.75rem',
      boxShadow: 'none',
      borderRadius: 5,
      cursor: 'pointer',
      '&:hover, &:focus-within': {
        // we enforce feedback color as hover style, otherwise default brand color will be used as border
        borderColor:
          feedbackVariant != null ? feedbackStyle.borderColor : '#666EFF',
        borderWidth: 2,
        outline: 'none',
        boxShadow: 'none'
      }
    }
  },
  placeholder: (style) => ({
    ...style,
    fontSize: '1rem',
    fontWeight: 500,
    color: '#686E6E'
  }),
  input: (style) => ({
    ...style,
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
