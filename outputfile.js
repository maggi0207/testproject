import axios from "axios";
import store from "../store/index";
import { getCookie } from "../utils/getCookies";
import * as constants from "../utils/constants";
import { handleServerError } from "../utils/genericUtil";
import getDistributionListMembers from "../path/to/getDistributionListMembers";

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

describe("getDistributionListMembers", () => {
  let setErrorModalMessage;

  beforeEach(() => {
    setErrorModalMessage = jest.fn();
    store.getState.mockReturnValue({
      externalEndPoints: {
        externalEndPointsProps: {
          endpoints: {
            apigeeToLmdGetdlmEndPoint: "http://mock-endpoint.com",
          },
        },
      },
    });
    getCookie.mockReturnValue("mock_access_token");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return delivery method as 'Email'", async () => {
    const mockResponse = {
      data: {
        records: [
          {
            Delivery_Method__c: "Email",
          },
        ],
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    const result = await getDistributionListMembers(setErrorModalMessage);

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

  it("should handle empty records and return null delivery method", async () => {
    const mockResponse = {
      data: {
        records: [],
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    const result = await getDistributionListMembers(setErrorModalMessage);

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

    await getDistributionListMembers(setErrorModalMessage);

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
