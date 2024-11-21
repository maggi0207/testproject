import { apiCall } from './apiCall';
import { LOCAL_ENV_CONFIG } from '../constants';

describe('apiCall', () => {
  beforeEach(() => {
    const sessionStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value; },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
      };
    })();

    global.sessionStorage = sessionStorageMock;
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return LOCAL_ENV_CONFIG for local environment with config/metadata URL', async () => {
    Object.defineProperty(window, 'location', {
      value: { host: 'localhost' },
      writable: true,
    });

    const url = 'http://localhost/config/metadata';
    const result = await apiCall(url, 'GET', null, {});

    expect(result).toEqual(LOCAL_ENV_CONFIG);
    expect(fetch).not.toHaveBeenCalled();
  });

  test('should return JSON response on success (status 200)', async () => {
    const mockResponse = { data: 'test' };
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const url = 'http://example.com/data';
    const result = await apiCall(url, 'GET', null, {});

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer mockAuthToken',
        }),
      })
    );
  });

  test('should throw error on failed fetch (non-200 status)', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ error: 'Something went wrong' }),
    });

    const url = 'http://example.com/data';
    await expect(apiCall(url, 'GET', null, {})).rejects.toThrow();
  });

  test('should handle 401 unauthorized status', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValueOnce({ error: 'Unauthorized' }),
    });

    const url = 'http://example.com/data';
    const result = await apiCall(url, 'GET', null, {});

    expect(result).toEqual({ error: 'Unauthorized' });
    
  });

  test('should correctly handle headers and body for POST requests', async () => {
    const mockResponse = { data: 'post success' };
    const data = { key: 'value' };
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const url = 'http://example.com/submit';
    const result = await apiCall(url, 'POST', data, {}, true);

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer mockAuthToken',
        }),
        body: JSON.stringify(data),
      })
    );
  });
});
