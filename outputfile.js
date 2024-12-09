import { useMemo } from "react";

const isFormValid = useMemo(() => {
  if (formData.paymentSource === "paymentBroker") {
    return (
      formData.dateSetName !== "" &&
      formData.applicationID !== "" &&
      formData.startDate !== "" &&
      formData.endDate !== "" &&
      formData.startTimeHours !== "" &&
      formData.endTimeHours !== "" &&
      formData.startTimeMinutes !== "" &&
      formData.endTimeMinutes !== ""
    );
  }

  // Default validation for other paymentSource values
  return (
    formData.dateSetName !== "" &&
    formData.applicationID !== "" &&
    formData.sourceChannel !== "" &&
    formData.outboundType !== "" &&
    formData.startDate !== "" &&
    formData.endDate !== "" &&
    formData.startTimeHours !== "" &&
    formData.endTimeHours !== "" &&
    formData.startTimeMinutes !== "" &&
    formData.endTimeMinutes !== ""
  );
}, [formData]);

useEffect(() => {
  setIsFormValid(isFormValid);
}, [isFormValid]);
