import { getPaymentComparisonDatasetAPI } from './yourService';
import { apiCall } from './api.service';
import { getBaseURL } from '../utils';

jest.mock('./api.service', () => ({
  apiCall: jest.fn(),
}));

jest.mock('../utils', () => ({
  getBaseURL: jest.fn(),
}));

describe('getPaymentComparisonDatasetAPI', () => {
  it('should call apiCall with the correct URL, method, and data', async () => {
    const mockData = { key: 'value' };
    const expectedUrl = 'http://localhost:8080/api/v1/payments/datasets/all';
    const mockResponse = { data: 'mock response' };

    getBaseURL.mockReturnValue('http://localhost:8080');
    apiCall.mockResolvedValue(mockResponse);

    const result = await getPaymentComparisonDatasetAPI(mockData);

    expect(getBaseURL).toHaveBeenCalled();
    expect(apiCall).toHaveBeenCalledWith(expectedUrl, 'POST', mockData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle errors from apiCall', async () => {
    const mockData = { key: 'value' };
    const mockError = new Error('Failed to fetch data');

    getBaseURL.mockReturnValue('http://localhost:8080');
    apiCall.mockRejectedValue(mockError);

    await expect(getPaymentComparisonDatasetAPI(mockData)).rejects.toThrow('Failed to fetch data');
  });
});
