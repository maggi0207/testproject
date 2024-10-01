  appMessageActions.addAppMessage.mockImplementation((message, type, ...args) => {
      const callback = args[args.length - 1]; // Get the last argument which is the callback
      return callback(); // Call the callback immediately for testing
    });
