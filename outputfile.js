import axios from "axios";
import store from "../store/index";
import { getCookie } from "../utils/getCookies";
import * as constants from "../utils/constants";
import { handleServerError } from "../utils/genericUtil";
import getEmailDeliveryPreferences from "../path/to/getEmailDeliveryPreferences";

jest.mock("axios");
jest.mock("../store/index", () => ({
  getState: jest.fn(),
}));
jest.mock("../utils/getCookies", () => ({
  getCookie: jest.fn(),
}));
jest.mock("../utils/genericUtil", () => ({
  handleServerError: jest.fn(),
}));

describe("getEmailDeliveryPreferences", () => {
  let setErrorModalMessage;

  beforeEach(() => {
    setErrorModalMessage = jest.fn();
    store.getState.mockReturnValue({
      externalEndPoints: {
        externalEndPointsProps: {
          endpoints: {
            apigeeToLmdGetedpEndPoint: "http://mock-endpoint.com",
          },
        },
      },
    });
    getCookie.mockReturnValue("mock_access_token");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return preference as 'Normal'", async () => {
    const mockResponse = {
      data: {
        records: [
          {
            Case_Email_Delivery_Preference__c: "Normal",
          },
        ],
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    const result = await getEmailDeliveryPreferences(setErrorModalMessage);

    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-endpoint.com",
      {},
      {
        headers: {
          Authorization: "Bearer mock_access_token",
        },
      }
    );
    expect(result).toEqual(mockResponse.data);
    expect(setErrorModalMessage).not.toHaveBeenCalled();
  });

  it("should return preference as 'Digest'", async () => {
    const mockResponse = {
      data: {
        records: [
          {
            Case_Email_Delivery_Preference__c: "Digest",
          },
        ],
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    const result = await getEmailDeliveryPreferences(setErrorModalMessage);

    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-endpoint.com",
      {},
      {
        headers: {
          Authorization: "Bearer mock_access_token",
        },
      }
    );
    expect(result).toEqual(mockResponse.data);
    expect(setErrorModalMessage).not.toHaveBeenCalled();
  });

  it("should handle empty records and return null preference", async () => {
    const mockResponse = {
      data: {
        records: [],
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    const result = await getEmailDeliveryPreferences(setErrorModalMessage);

    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-endpoint.com",
      {},
      {
        headers: {
          Authorization: "Bearer mock_access_token",
        },
      }
    );
    expect(result).toEqual(mockResponse.data);
    expect(setErrorModalMessage).not.toHaveBeenCalled();
  });

  it("should handle API errors and call setErrorModalMessage", async () => {
    const mockError = new Error("API error");
    const errorModalMock = {
      errorModalTitleConst: "Error Title",
      errorModalDescriptionConst: "Error Description",
    };
    axios.post.mockRejectedValue(mockError);
    handleServerError.mockReturnValue(errorModalMock);

    await getEmailDeliveryPreferences(setErrorModalMessage);

    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-endpoint.com",
      {},
      {
        headers: {
          Authorization: "Bearer mock_access_token",
        },
      }
    );
    expect(handleServerError).toHaveBeenCalledWith(mockError, {
      errorModalTitleConst: "",
      errorModalDescriptionConst: "",
    });
    expect(setErrorModalMessage).toHaveBeenCalledWith({
      errorModalTitle: "Error Title",
      errorModalDescription: "Error Description",
    });
  });
});
