import { v4 as uuidv4 } from 'uuid';

export const createDatasetAPI = (data) => {
    console.log("Payload:", data);

    const headers = {
        'X-REQUEST-ID': uuidv4(),  
        'X-WF-CLIENT-ID': X_WF_CLIENT_ID,  
        'X-WF-REQUEST-DATE': new Date().toISOString(),  
        'Content-Type': 'application/json'
    };

    const url = `${getBaseURL()}/api/v1/payments/dataset/create`;

    return apicall(url, "POST", data, headers);
};
