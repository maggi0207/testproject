
# **Detailed Documentation on Logging User Interactions in React/JavaScript Applications**

## **Overview**
This document outlines the structure, best practices, and examples for logging user interactions in React/JavaScript applications. The goal is to ensure that the system can:
- Monitor user interactions.
- Troubleshoot issues efficiently.
- Gain insights into user behavior through well-structured logs.

---

## **1. Where Are We Logging?**

### **Logging Destination:**
- Logs are sent to a centralized logging platform, such as ElasticSearch or Kibana, for aggregation, visualization, and querying.

### **URLs & Settings:**
- **Logging Endpoint:** `https://logs.example.com/ingest`
- **Configuration Settings:**
  - **Log Level:** Configured via environment variables (`DEBUG`, `INFO`, `ERROR`).
  - **Batch Logging:** Logs are batched and sent every 5 seconds to reduce network overhead.
  - **Retention Policy:** Logs are retained for 90 days for analysis.

---

## **2. What Are We Logging in Case of UI Actions/Events?**

### **Fields Logged for UI Actions:**
| **Field**         | **Description**                                                              |
|--------------------|------------------------------------------------------------------------------|
| `@timestamp`       | Time the event occurred.                                                    |
| `event_type`       | Always `USER_ACTION` for UI events.                                         |
| `action`           | Type of user action (e.g., `click`, `select`, `submit`).                    |
| `user_id`          | Identifier for the user performing the action.                              |
| `session_id`       | Unique session identifier.                                                  |
| `page_url`         | URL of the page where the action occurred.                                  |
| `element_id`       | ID or unique identifier of the UI element involved.                        |
| `details`          | Additional details such as selected options or form input (anonymized).    |
| `metadata`         | Environment details (e.g., `production`, `1.0.0`, `web`).                  |

**Example Log (Button Click):**
```json
{
  "@timestamp": "2024-12-25T10:05:00Z",
  "event_type": "USER_ACTION",
  "action": "click",
  "context": {
    "user": {
      "user_id": "12345",
      "session_id": "abcde12345"
    },
    "element": {
      "id": "submit-button",
      "type": "button",
      "action": "click"
    },
    "page_url": "/signup"
  },
  "metadata": {
    "environment": "production"
  }
}
```

---

## **3. What Are We Logging in Case of API Calls?**

### **Fields Logged for API Calls:**
| **Field**         | **Description**                                                              |
|--------------------|------------------------------------------------------------------------------|
| `@timestamp`       | Time the API call was made.                                                 |
| `event_type`       | Always `API_CALL`.                                                          |
| `action`           | Type of API action (e.g., `fetch`, `submit`).                               |
| `request_url`      | Full endpoint of the API being called.                                      |
| `method`           | HTTP method used (`GET`, `POST`, etc.).                                     |
| `status_code`      | HTTP response status code.                                                  |
| `response_time_ms` | Time taken to receive a response.                                           |
| `error_details`    | Error information in case of failure.                                       |

**Example Log (Success):**
```json
{
  "@timestamp": "2024-12-25T10:01:00Z",
  "event_type": "API_CALL",
  "action": "fetch",
  "context": {
    "request_url": "/api/v1/orders",
    "method": "POST",
    "status_code": 200,
    "response_time_ms": 150
  },
  "metadata": {
    "environment": "production",
    "application_version": "1.0.0"
  }
}
```

**Example Log (Failure):**
```json
{
  "@timestamp": "2024-12-25T10:02:00Z",
  "event_type": "API_CALL",
  "action": "fetch",
  "context": {
    "request_url": "/api/v1/orders",
    "method": "POST",
    "status_code": 500,
    "error_details": {
      "message": "Internal Server Error"
    }
  },
  "metadata": {
    "environment": "production",
    "application_version": "1.0.0"
  }
}
```

---

## **4. When Do We Log on UI?**

UI logging ensures that user interactions and state changes are effectively tracked for debugging, analysis, and observability. Here are the primary cases when logging is essential, along with the recommended output formats for each action type:

### **User Actions**
Log user-triggered interactions to capture their intent and behavior. These include:
- Button clicks (e.g., form submission, navigation buttons). In our application, each page features a 'Continue' button that users click to navigate to the next page.
- Dropdown or radio button selections.
- Form field inputs and validations.

**Example Scenario 1:**
- **Action:** User clicks the "Continue" button with the existing address selected.
- **Log Details:**
  - API Request URL: `/launcher/submissions`
  - HTTP Method: POST
  - Response Status: 202 (Accepted)
  - Navigation: Successful redirect to `/my/auto-insurance-quote/drivers`.
  - Next Action: User is redirected to the next page and begins filling out driver details.
- **Output Format:**
```json
{
  "@timestamp": "2024-12-25T10:05:00Z",
  "event_type": "USER_ACTION",
  "action": "click",
  "context": {
    "user": {
      "user_id": "12345",
      "session_id": "abcde12345"
    },
    "element": {
      "id": "continue-button",
      "type": "button",
      "action": "click"
    },
    "page_url": "/my/auto-insurance-quote"
  },
  "metadata": {
    "environment": "production"
  }
}
```

---

## **5. How Do We Log with a Technical Approach?**

### **Implementation Strategy:**

1. **Centralized Logging Utility:**
   - Create a utility function for consistent log generation.

   ```javascript
   const logEvent = (eventType, action, context, metadata) => {
     const logEntry = {
       "@timestamp": new Date().toISOString(),
       event_type: eventType,
       action: action,
       context: context,
       metadata: metadata
     };
     console.log(JSON.stringify(logEntry)); // Send this to your logging platform
   };
   ```

2. **Integration Points:**
   - Use middleware (e.g., Redux or context providers) to intercept and log state changes.
   - Use event listeners for UI interactions.

---

## **6. How Are We Deriving the Field Values to Log?**

**Field Value Derivation:**
| **Field**       | **Source**                                                   |
| --------------- | ------------------------------------------------------------ |
| `@timestamp`    | `new Date().toISOString()`                                   |
| `user_id`       | Extracted from the user session or authentication context.   |
| `session_id`    | Generated at the start of a session (e.g., UUID).            |
| `page_url`      | `window.location.href` or React Router’s `useLocation` hook. |
| `element_id`    | Retrieved from the DOM element's `id` attribute.             |
| `error_details` | Extracted from exception objects or API response payloads.   |

---

## **7. How to Read the UI Logs?**

**Steps to Analyze Logs in Kibana:**

1. **Query the Logs:**
   - Use filters like `event_type: "USER_ACTION"` to view specific events.
2. **Search by User or Session:**
   - Query using `user_id` or `session_id` to trace user actions.
3. **Visualize Trends:**
   - Create dashboards for metrics like most-clicked buttons or API success rates.
4. **Error Investigation:**
   - Filter logs with `event_type: "ERROR"` to identify and resolve issues.

---

## **Conclusion**

This document provides a comprehensive guide to logging in React/JavaScript applications. By implementing these logging strategies, the system gains robust observability, efficient troubleshooting, and actionable insights into user behavior.

---
