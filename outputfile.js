import React from 'react';
import { Switch, withStyles } from '@material-ui/core';

const StyledSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 24,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& $thumb': {
        width: 20,
      },
      '& $switchBase.Mui-checked': {
        transform: 'translateX(18px)',
      },
    },
  },
  switchBase: {
    padding: 2,
    '&$checked': {
      transform: 'translateX(18px)',
      color: '#fff',
      '& + $track': {
        opacity: 1,
        backgroundColor: 'green',
      },
    },
  },
  thumb: {
    boxShadow: '0 2px 4px 0 rgba(0, 35, 11, 0.2)',
    width: 20,
    height: 20,
    borderRadius: '50%',
    transition: theme.transitions.create(['transform'], {
      duration: 200,
    }),
  },
  track: {
    borderRadius: 12,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
  checked: {},
}))(Switch);

export const ToggleSwitch = ({ checked, onChange, label }) => {


  return (
    <div  onClick={onChange} style={{ display: 'flex', alignItems: 'center' }}>
      <StyledSwitch
        checked={checked}
        name="toggleSwitch"
        inputProps={{ 'aria-label': label }}
      />
    </div>
  );
};
