import React from 'react';
import PropTypes from 'prop-types';
import './hoc-theme.css';

function withTheme(WrappedComponent) {
  const isDark = window?.mfe?.scmDeviceMfeEnable && window?.mfe?.isDark;
  const wrapper = (props) => (
    <WrappedComponent
      {...props}
      surface={isDark ? 'dark' : 'light'}
      color={isDark ? '#ffffff' : props.color}
      className={isDark ? `${props.className} dark-theme` : props.className}
    >
      {props.children}
    </WrappedComponent>
  );
  return wrapper;
}

withTheme.propTypes = {
  chidren: PropTypes.any,
  className: PropTypes.string,
  onOpenedChange: PropTypes.func,
  theme: PropTypes.string,
};

export default withTheme;

import React from 'react';
import { render } from '@testing-library/react';
import withTheme from './withTheme';

describe('withTheme component render', () => {
  const props = {
  };
  test('HOC Component should render', () => {
    render(<withTheme {...props} />);
  });
});

