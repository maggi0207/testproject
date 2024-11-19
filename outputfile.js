import axios from "axios";
import { getCookie } from "../utils/getCookies";
import * as constants from "../utils/constants";
import store from "../store/index";
import { handleServerError } from "../utils/genericUtil";

const updateDistributionListMembers = (payload, setErrorModalMessage) => {
    const state = store.getState();
    const endPoints = state.externalEndPoints.externalEndPointsProps.endpoints;
    let api = endPoints?.apigeeToLmdUdlmEndPoint;

    const postData = {
        "dlm": payload
    };
    const axiosConfig = {
        headers: {
            'Authorization': 'Bearer ' + getCookie(constants.ACCESS_TOKEN)
        }
    };

    return axios.post(api, postData, axiosConfig)
        .then(response => response.data)
        .catch((err) => {
            console.error('API error:', err);
            let errorModalConst = { errorModalTitleConst: '', errorModalDescriptionConst: '' };
            errorModalConst = handleServerError(err, errorModalConst);
            setErrorModalMessage({ errorModalTitle: errorModalConst.errorModalTitleConst, errorModalDescription: errorModalConst.errorModalDescriptionConst });
        });
}

export default updateDistributionListMembers;
