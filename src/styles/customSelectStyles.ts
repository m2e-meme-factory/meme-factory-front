import { StylesConfig } from 'react-select';

export const CUSTOM_SELECT_STYLES_MULTI: StylesConfig<any, true> = {
  control: (provided, state) => ({
    ...provided,
    'width': '100%',
    'backgroundColor': '#121212',
    'borderColor': state.isFocused ? '#fecf0a' : 'grey',
    'boxShadow': state.isFocused ? `0 0 0 1px #fecf0a` : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#fecf0a' : 'grey',
    },
    'fontSize': '14px',
  }),
  menu: (provided) => ({
    ...provided,
    width: '100%',
    backgroundColor: '#121212',
    fontSize: '14px',
  }),
  option: (provided, state) => ({
    ...provided,
    'backgroundColor': state.isFocused ? '#fecf0a' : '#121212',
    'color': state.isFocused ? 'black' : 'white',
    '&:active': {
      backgroundColor: '#fecf0a',
      color: 'black',
      fontSize: '14px',
    },
    'fontSize': '14px',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'white',
    fontSize: '14px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
    fontSize: '14px',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#fecf0a',
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
    'backgroundColor': '#121212',
    'borderColor': state.isFocused ? '#fecf0a' : 'grey',
    'boxShadow': state.isFocused ? `0 0 0 1px #fecf0a` : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#fecf0a' : 'grey',
    },
    'fontSize': '14px',
  }),
  menu: (provided) => ({
    ...provided,
    // width: '91vw',
    backgroundColor: '#121212',
    fontSize: '14px',
  }),
  option: (provided, state) => ({
    ...provided,
    'backgroundColor': state.isFocused ? '#fecf0a' : '#121212',
    'color': state.isFocused ? 'black' : 'white',
    '&:active': {
      backgroundColor: '#fecf0a',
      color: 'black',
    },
    'fontSize': '14px',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'white',
    fontSize: '14px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
    fontSize: '14px',
  }),
};
