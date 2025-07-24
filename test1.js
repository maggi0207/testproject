 await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0)); // wait one tick
  });
