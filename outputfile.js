const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& $thumb': {
        width: 15,
      },
      '& $switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
  },
  switchBase: {
    padding: 2,
    '&$checked': {
      transform: 'translateX(12px)',
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
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  track: {
    borderRadius: 8,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
    ...theme.palette.type === 'dark' && {
      backgroundColor: 'rgba(255,255,255,.35)',
    },
  },
  checked: {},
}))(Switch);
