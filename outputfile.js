import { getRunCatalogDataAPI, getPaymentRunsAPI } from './yourService';
import { apiCall } from './api.service';
import { getBaseURL } from '../utils';

jest.mock('./api.service', () => ({
  apiCall: jest.fn(),
}));

jest.mock('../utils', () => ({
  getBaseURL: jest.fn(),
}));

describe('API service functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRunCatalogDataAPI', () => {
    it('should call apiCall with the correct URL, method, and data', async () => {
      const mockData = { key: 'value' };
      const expectedUrl = 'http://localhost:8080/api/v1/payments/runs/all';
      const mockResponse = { data: 'mock response' };

      getBaseURL.mockReturnValue('http://localhost:8080');
      apiCall.mockResolvedValue(mockResponse);

      const result = await getRunCatalogDataAPI(mockData);

      expect(getBaseURL).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith(expectedUrl, 'POST', mockData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors from apiCall', async () => {
      const mockData = { key: 'value' };
      const mockError = new Error('Failed to fetch data');

      getBaseURL.mockReturnValue('http://localhost:8080');
      apiCall.mockRejectedValue(mockError);

      await expect(getRunCatalogDataAPI(mockData)).rejects.toThrow('Failed to fetch data');
    });
  });

  describe('getPaymentRunsAPI', () => {
    it('should call apiCall with the correct URL, method, and pagination data', async () => {
      const mockData = { paymentDatasetId: '123', pagination: { page: 1, size: 10 } };
      const expectedUrl = 'http://localhost:8080/api/v1/payments/runs/dataset/123';
      const mockResponse = { data: 'mock response' };

      getBaseURL.mockReturnValue('http://localhost:8080');
      apiCall.mockResolvedValue(mockResponse);

      const result = await getPaymentRunsAPI(mockData);

      expect(getBaseURL).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith(expectedUrl, 'POST', mockData.pagination);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors from apiCall', async () => {
      const mockData = { paymentDatasetId: '123', pagination: { page: 1, size: 10 } };
      const mockError = new Error('Failed to fetch data');

      getBaseURL.mockReturnValue('http://localhost:8080');
      apiCall.mockRejectedValue(mockError);

      await expect(getPaymentRunsAPI(mockData)).rejects.toThrow('Failed to fetch data');
    });
  });
});
