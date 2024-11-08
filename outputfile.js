import React from 'react';
import { Switch, withStyles } from '@material-ui/core';

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 42, // Set width to 42px
    height: 24, // Set height to 24px
    padding: 0,
    display: 'flex',
    '&:active': {
      '& $thumb': {
        width: 20, // Adjust thumb width when active
      },
      '& $switchBase.Mui-checked': {
        transform: 'translateX(18px)', // Adjust translation for checked state
      },
    },
  },
  switchBase: {
    padding: 2, // Adjust padding for larger switch
    '&$checked': {
      transform: 'translateX(20px)', // Adjust translation for checked state
      color: '#fff',
      '& + $track': {
        opacity: 1,
        backgroundColor: '#1890ff',
        ...theme.palette.type === 'dark' && {
          backgroundColor: '#177ddc',
        },
      },
    },
  },
  thumb: {
    boxShadow: '0 2px 4px 0 rgba(0, 35, 11, 0.2)',
    width: 20, // Increased thumb width
    height: 20, // Increased thumb height
    borderRadius: '50%', // Make thumb circular
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  track: {
    borderRadius: 12, // Adjusted border radius for larger track
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
    ...theme.palette.type === 'dark' && {
      backgroundColor: 'rgba(255,255,255,.35)',
    },
  },
  checked: {},
}))(Switch);
