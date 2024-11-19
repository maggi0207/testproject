import axios from "axios";
import store from "../store/index";
import { getCookie } from "../utils/getCookies";
import * as constants from "../utils/constants";
import { handleServerError } from "../utils/genericUtil";
import updateDistributionListMembers from "../path/to/updateDistributionListMembers";

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

describe("updateDistributionListMembers", () => {
  let setErrorModalMessage;

  beforeEach(() => {
    setErrorModalMessage = jest.fn();
    store.getState.mockReturnValue({
      externalEndPoints: {
        externalEndPointsProps: {
          endpoints: {
            apigeeToLmdUdlmEndPoint: "http://mock-endpoint.com",
          },
        },
      },
    });
    getCookie.mockReturnValue("mock_access_token");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update distribution list members with payload 'Email'", async () => {
    const mockResponse = { success: true, message: "Updated successfully" };
    const payload = "Email";

    axios.post.mockResolvedValue({ data: mockResponse });

    const result = await updateDistributionListMembers(payload, setErrorModalMessage);

    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-endpoint.com",
      { dlm: payload },
      {
        headers: {
          Authorization: "Bearer mock_access_token",
        },
      }
    );
    expect(result).toEqual(mockResponse);
    expect(setErrorModalMessage).not.toHaveBeenCalled();
  });

  it("should handle empty API response", async () => {
    const payload = "Email";
    axios.post.mockResolvedValue({ data: null });

    const result = await updateDistributionListMembers(payload, setErrorModalMessage);

    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-endpoint.com",
      { dlm: payload },
      {
        headers: {
          Authorization: "Bearer mock_access_token",
        },
      }
    );
    expect(result).toBeNull();
    expect(setErrorModalMessage).not.toHaveBeenCalled();
  });

  it("should handle API error and call setErrorModalMessage", async () => {
    const mockError = new Error("API error");
    const errorModalMock = {
      errorModalTitleConst: "Error Title",
      errorModalDescriptionConst: "Error Description",
    };
    const payload = "Email";

    axios.post.mockRejectedValue(mockError);
    handleServerError.mockReturnValue(errorModalMock);

    await updateDistributionListMembers(payload, setErrorModalMessage);

    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-endpoint.com",
      { dlm: payload },
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
