# Scenario Documentation

## Scenario 1 - User Action

### Action:
User clicks the Continue button with the existing address selected.

### Things Happening After Clicking Continue Button:

#### API Call Details:
- **Request URL**: `https://rapi-a.usaa.com/v1/pc/auto/acquisition-experience/launcher/submissions?guid=a7a687a5-ab72-4bee-a677-76d37e0a6d95`
- **Request Method**: POST
- **Status Code**: 202 Accepted

#### Navigation:
After a successful response, the user is navigated to the next page: `/my/auto-insurance-quote/drivers`

---

## Scenario 2 - Error State

### Action:
User clicks the Continue button, but the API call fails.

### Things Happening After Clicking Continue Button:

#### API Call Details:
- **Request URL**: `https://rapi-a.usaa.com/v1/pc/auto/acquisition-experience/launcher/submissions?guid=a7a687a5-ab72-4bee-a677-76d37e0a6d95`
- **Request Method**: POST
- **Status Code**: 500 Internal Server Error

#### Error Handling:
Display error message: "Unable to proceed. Please try again later."
