import { getAllPaymentDatasetAPI, getPaymentDatasetAPI, uploadPaymentDatasetAPI, createDatasetAPI, createTestRunAPI } from './yourService';
import { apiCall } from './api.service';
import { getBaseURL } from '../utils';
import { X_WF_CLIENT_ID } from '../constants';
import { v4 as uuidv4 } from 'uuid';

jest.mock('./api.service', () => ({
  apiCall: jest.fn(),
}));

jest.mock('../utils', () => ({
  getBaseURL: jest.fn(),
}));

describe('API Services', () => {
  describe('getAllPaymentDatasetAPI', () => {
    it('should call apiCall with the correct URL and method', async () => {
      const mockData = { key: 'value' };
      const expectedUrl = 'http://localhost:8080/api/v1/payments/datasets/all';

      getBaseURL.mockReturnValue('http://localhost:8080');
      apiCall.mockResolvedValue({ data: 'mock response' });

      const result = await getAllPaymentDatasetAPI(mockData);

      expect(getBaseURL).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith(expectedUrl, 'POST', mockData);
    });

    it('should handle errors from apiCall', async () => {
      const mockData = { key: 'value' };
      const mockError = new Error('Failed to fetch data');

      getBaseURL.mockReturnValue('http://localhost:8080');
      apiCall.mockRejectedValue(mockError);

      await expect(getAllPaymentDatasetAPI(mockData)).rejects.toThrow('Failed to fetch data');
    });
  });

  describe('getPaymentDatasetAPI', () => {
    it('should call apiCall with the correct URL and method', async () => {
      const paymentDatasetId = '12345';
      const expectedUrl = `http://localhost:8080/api/v1/payments/dataset/${paymentDatasetId}`;

      getBaseURL.mockReturnValue('http://localhost:8080');
      apiCall.mockResolvedValue({ data: 'mock response' });

      const result = await getPaymentDatasetAPI(paymentDatasetId);

      expect(getBaseURL).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith(expectedUrl, 'GET');
    });

    it('should handle errors from apiCall', async () => {
      const paymentDatasetId = '12345';
      const mockError = new Error('Failed to fetch data');

      getBaseURL.mockReturnValue('http://localhost:8080');
      apiCall.mockRejectedValue(mockError);

      await expect(getPaymentDatasetAPI(paymentDatasetId)).rejects.toThrow('Failed to fetch data');
    });
  });

  describe('uploadPaymentDatasetAPI', () => {
    it('should call apiCall with the correct URL, method, and headers', async () => {
      const mockData = { file: 'file data' };
      const expectedUrl = 'http://localhost:8080/api/v1/payments/dataset/upload';

      getBaseURL.mockReturnValue('http://localhost:8080');
      apiCall.mockResolvedValue({ data: 'mock response' });

      const result = await uploadPaymentDatasetAPI(mockData);

      expect(getBaseURL).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith(expectedUrl, 'POST', mockData, {}, false, true);
    });

    it('should handle errors from apiCall', async () => {
      const mockData = { file: 'file data' };
      const mockError = new Error('Failed to upload data');

      getBaseURL.mockReturnValue('http://localhost:8080');
      apiCall.mockRejectedValue(mockError);

      await expect(uploadPaymentDatasetAPI(mockData)).rejects.toThrow('Failed to upload data');
    });
  });

  describe('createDatasetAPI', () => {
    it('should call apiCall with the correct URL, method, and headers', async () => {
      const mockData = { dataset: 'data' };
      const expectedUrl = 'http://localhost:8080/api/v1/payments/dataset/create';
      const headers = {
        'X-REQUEST-ID': expect.any(String),
        'X-WF-CLIENT-ID': X_WF_CLIENT_ID,
        'X-WF-REQUEST-DATE': expect.any(String),
        'Content-Type': 'application/json',
      };

      getBaseURL.mockReturnValue('http://localhost:8080');
      apiCall.mockResolvedValue({ data: 'mock response' });

      const result = await createDatasetAPI(mockData);

      expect(getBaseURL).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith(expectedUrl, 'POST', mockData, headers);
    });

    it('should handle errors from apiCall', async () => {
      const mockData = { dataset: 'data' };
      const mockError = new Error('Failed to create dataset');

      getBaseURL.mockReturnValue('http://localhost:8080');
      apiCall.mockRejectedValue(mockError);

      await expect(createDatasetAPI(mockData)).rejects.toThrow('Failed to create dataset');
    });
  });

  describe('createTestRunAPI', () => {
    it('should call apiCall with the correct URL and method', async () => {
      const mockData = { testRun: 'data' };
      const expectedUrl = 'http://localhost:8080/api/v1/payments/dataset/run';

      getBaseURL.mockReturnValue('http://localhost:8080');
      apiCall.mockResolvedValue({ data: 'mock response' });

      const result = await createTestRunAPI(mockData);

      expect(getBaseURL).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith(expectedUrl, 'POST', mockData);
    });

    it('should handle errors from apiCall', async () => {
      const mockData = { testRun: 'data' };
      const mockError = new Error('Failed to create test run');

      getBaseURL.mockReturnValue('http://localhost:8080');
      apiCall.mockRejectedValue(mockError);

      await expect(createTestRunAPI(mockData)).rejects.toThrow('Failed to create test run');
    });
  });
});
