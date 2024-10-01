jest.mock('your-repo-path', () => ({
  appMessageActions: {
    addAppMessage: jest.fn((message, type, ...args) => {
      const callback = args[args.length - 1]; // Get the last argument which is the callback
      // Call the callback immediately for testing
      if (typeof callback === 'function') {
        callback(); // Simulate user interaction with the message
      }
    }),
  },
}));
