Success Call

{
  "@timestamp": "2024-12-24T15:35:00Z",
  "event_type": "USER_ACTION",
  "action": "click",
  "element": "Continue button",
  "page_url": "/my/auto-insurance-quote",
  "user_id": "12345",
  "session_id": "abcde12345",
  "client_ip": "192.168.1.1",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",
  "fields": {
    "field_name_1": {
      "type": "text_input",
      "value": "John Doe"
    },
    "field_name_2": {
      "type": "radio_button",
      "selected_option": "Option A",
      "options": ["Option A", "Option B"]
    }
  },
  "api_call": {
    "request_url": "https://rapi-a.usaa.com/v1/pc/auto/acquisition-experience/launcher/submissions?guid=a7a687a5-ab72-4bee-a677-76d37e0a6d95",
    "request_method": "POST",
    "status_code": 202,
    "status_message": "Accepted",
    "response_time_ms": 150,
    "call_status": "success"
  },
  "navigation": {
    "next_page_url": "/my/auto-insurance-quote/drivers",
    "navigation_type": "redirect"
  },
  "action_status": "success",
  "metadata": {
    "environment": "production",
    "log_source": "frontend",
    "platform": "web",
    "application_version": "1.0.0"
  }
}


Fail Call

{
  "@timestamp": "2024-12-24T15:35:00Z",
  "event_type": "USER_ACTION",
  "action": "click",
  "element": "Continue button",
  "page_url": "/my/auto-insurance-quote",
  "user_id": "12345",
  "session_id": "abcde12345",
  "client_ip": "192.168.1.1",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",
  "fields": {
    "field_name_1": {
      "type": "text_input",
      "value": "John Doe"
    },
    "field_name_2": {
      "type": "radio_button",
      "selected_option": "Option A",
      "options": ["Option A", "Option B"]
    }
  },
  "api_call": {
    "request_url": "https://rapi-a.usaa.com/v1/pc/auto/acquisition-experience/launcher/submissions?guid=a7a687a5-ab72-4bee-a677-76d37e0a6d95",
    "request_method": "POST",
    "status_code": 500,
    "status_message": "Internal Server Error",
    "response_time_ms": 320,
    "call_status": "failure",
    "error_details": "API encountered an internal server error."
  },
  "navigation": {
    "next_page_url": "/my/auto-insurance-quote/error",
    "navigation_type": "redirect"
  },
  "action_status": "failure",
  "metadata": {
    "environment": "production",
    "log_source": "frontend",
    "platform": "web",
    "application_version": "1.0.0"
  }
}
