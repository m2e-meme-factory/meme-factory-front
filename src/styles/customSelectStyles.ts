import { StylesConfig } from 'react-select';

export const CUSTOM_SELECT_STYLES_MULTI: StylesConfig<any, true> = {
  control: (provided, state) => ({
    ...provided,
    'width': '100%',
    'backgroundColor': '#000',
    'borderColor': state.isFocused ? 'var(--gray-4)' : 'var(--gray-2)',
    'boxShadow': 'none',
    '&:hover': {
      borderColor: state.isFocused ? 'var(--gray-4)' : 'var(--gray-2)',
    },
    'fontSize': 'inherit',
  }),
  menu: (provided) => ({
    ...provided,
    width: '100%',
    maxHeight: '100vh',
    backgroundColor: 'var(--gray-2)',
    fontSize: 'inherit',
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '60vh',
  }),
  option: (provided, state) => ({
    ...provided,
    'backgroundColor': state.isFocused ? 'var(--accent-a10)' : 'var(--gray-2)',
    'color': state.isFocused ? 'black' : 'white',
    '&:active': {
      backgroundColor: 'var(--accent-a10)',
      color: 'black',
      fontSize: 'inherit',
    },
    'fontSize': 'inherit',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: 'var(--gray-2)',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'white',
    fontSize: 'inherit',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
    fontSize: 'inherit',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: 'var(--accent-a10)',
    color: 'black',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'black',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    'color': 'black',
    ':hover': {
      backgroundColor: 'red',
      color: 'white',
    },
  }),
};

export const CUSTOM_SELECT_STYLES_SINGLE: StylesConfig<any, false> = {
  control: (provided, state) => ({
    ...provided,
    'width': '100%',
    'backgroundColor': '#000',
    'borderColor': state.isFocused ? 'var(--gray-4)' : 'var(--gray-2)',
    'boxShadow': 'none',
    '&:hover': {
      borderColor: state.isFocused ? 'var(--gray-4)' : 'var(--gray-2)',
    },
    'fontSize': 'inherit',
  }),
  menu: (provided) => ({
    ...provided,
    maxHeight: '60vh',
    // width: '91vw',
    backgroundColor: 'var(--gray-2)',
    fontSize: 'inherit',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: 'var(--gray-2)',
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '60vh',
  }),
  option: (provided, state) => ({
    ...provided,
    'backgroundColor': state.isFocused ? 'var(--accent-a10)' : 'var(--gray-2)',
    'color': state.isFocused ? 'black' : 'white',
    '&:active': {
      backgroundColor: '#000',
      color: 'black',
    },
    'fontSize': 'inherit',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'white',
    fontSize: 'inherit',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
    fontSize: 'inherit',
  }),
};
