import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';
import { WaitMessage } from '@wf-wfria/pioneer-core';

jest.mock('@wf-wfria/pioneer-core', () => ({
  WaitMessage: jest.fn(({ render }) => render()),
}));

describe('Loader Component', () => {
  it('should render the loader with the default containerId', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(WaitMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'spinner' }),
      expect.anything()
    );
  });

  it('should render with a custom containerId', () => {
    const customContainerId = 'custom-container-id';
    render(<Loader containerId={customContainerId} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
