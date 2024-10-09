export const getWithCompleteURL = (uri, options = {}) => {
  // Commented out the actual get call
  // return get(
  //   uri,
  //   options.noToken ? {} : fetchOptions(options)
  // );

  // Returning a mocked response
  return Promise.resolve({
    data: [
      {
        currentValue: {
          PING_AUTHORITY: "https://example.com/authority",
          ONEOPS_PING_CLIENT_ID: "mock-client-id",
          PING_REDIRECT_URI_PATH: "https://example.com/callback",
          PING_SCOPE: "openid profile",
        },
      },
    ],
  });
};
