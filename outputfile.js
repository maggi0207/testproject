jest.mock('../../../service/api.service', () => ({
  apiCall: (
    url,
    method,
    data,
    headers,
    includeJsonHeader = true,
    includeFormDataHeader = false
  ) => {
    if (url.includes("api/v1/payments/datasets/all")) {
      return Promise.resolve({
        items: [
          {
            id: "673d09c874e7d05da2ec7fc0",
            name: "sai_epods_test_128239923",
            sourceSystem: "EPODS",
            paymentsCount: 36,
            harvestedDate: "2024-11-19T16:57:24.206",
          },
        ],
      });
    }
    return Promise.resolve({});
  },
}));
