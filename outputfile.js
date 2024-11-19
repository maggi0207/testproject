import axios from "axios";
import { getCookie } from "../utils/getCookies";
import * as constants from "../utils/constants";
import store from "../store/index";
import { handleServerError } from "../utils/genericUtil";

const getEmailDeliveryPreferences = (setErrorModalMessage) => {
    const state = store.getState();
    const endPoints = state.externalEndPoints.externalEndPointsProps.endpoints;
    let api = endPoints?.apigeeToLmdGetedpEndPoint;

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

export default getEmailDeliveryPreferences;

uage
useEffect(() => {
        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: true}));
        getEmailDeliveryPreferences().then(response => {
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: false}));
            if (response.records && response.records.length > 0) {
                const preference = response.records[0].Case_Email_Delivery_Preference__c;
                updateToggleStatus(preference ? preference : null);
            } else {
                updateToggleStatus(null);
            }
        }).catch(error => {
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: false}));
        });
    }, [dispatch]);
