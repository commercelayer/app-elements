import { StylesConfig } from 'react-select'
import { SelectValue } from '.'

const selectStyles: StylesConfig<SelectValue> = {
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
    fontWeight: 600,
    fontSize: '1rem'
  }),
  control: (style) => ({
    ...style,
    minHeight: '2.75rem',
    borderColor: 'rgb(230 231 231)',
    boxShadow: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    '&:hover, &:focus-within': {
      borderColor: '#666EFF',
      borderWidth: 2,
      outline: 'none',
      boxShadow: 'none'
    }
  }),
  placeholder: (style) => ({
    ...style,
    fontSize: '1rem',
    fontWeight: 500,
    color: '#686E6E'
  }),
  indicatorSeparator: (style) => ({
    ...style,
    opacity: 0
  })
}

export default selectStyles
