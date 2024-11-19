import axios from "axios";
import { getCookie } from "../utils/getCookies";
import * as constants from "../utils/constants";
import store from "../store/index";
import { handleServerError } from "../utils/genericUtil";

const getDistributionListMembers = (setErrorModalMessage) => {
    const state = store.getState();
    const endPoints = state.externalEndPoints.externalEndPointsProps.endpoints;
    let api = endPoints?.apigeeToLmdGetdlmEndPoint;

    const postData = {};
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

export default getDistributionListMembers;

 useEffect(() => {
        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: true }));
        getDistributionListMembers()
            .then((response) => {
                dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: false }));
                if (response.records && response.records.length > 0) {
                    const deliveryMethod = response.records[0].Delivery_Method__c;
                    updateToggleStatus(deliveryMethod);
                } else {
                    console.log('No records found:', response);
                    updateToggleStatus(null);
                }
            })
            .catch((error) => {
                dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: false }));
                console.error('Error fetching distribution list members:', error);
            });
    }, [dispatch]);
