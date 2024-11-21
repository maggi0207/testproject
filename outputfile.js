import { getRunSummaryAPI } from './yourService';
import { apiCall } from './api.service';
import { getBaseURL } from '../utils';

jest.mock('./api.service', () => ({
  apiCall: jest.fn(),
}));

jest.mock('../utils', () => ({
  getBaseURL: jest.fn(),
}));

describe('getRunSummaryAPI', () => {
  it('should call apiCall with the correct URL and method', async () => {
    const paymentTestRunId = '12345';
    const expectedUrl = 'http://localhost:8080.com/api/v1/payments/runs/12345/summary';
    const mockData = { paymentTestRunId };
    const mockResponse = { success: true };

    getBaseURL.mockReturnValue('http://localhost:8080.com');
    apiCall.mockResolvedValue(mockResponse);

    const result = await getRunSummaryAPI(mockData);

    expect(getBaseURL).toHaveBeenCalled();
    expect(apiCall).toHaveBeenCalledWith(expectedUrl, 'GET');
    expect(result).toEqual(mockResponse);
  });

  it('should handle errors from apiCall', async () => {
    const paymentTestRunId = '12345';
    const mockData = { paymentTestRunId };
    const mockError = new Error('Failed to fetch data');

    getBaseURL.mockReturnValue('http://localhost:8080.com');
    apiCall.mockRejectedValue(mockError);

    await expect(getRunSummaryAPI(mockData)).rejects.toThrow('Failed to fetch data');
  });
});
