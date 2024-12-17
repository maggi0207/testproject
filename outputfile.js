import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentDatasetAPI } from "./api"; // Import your API call
import { updateItemsAction } from "./actions"; // Import Redux action
import { COMPLETED, FAILURE } from "./constants"; // Import status constants

const PollingComponent = ({ paymentDataset }) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.paymentDatasetState.items); // Get current items from Redux

  const WAIT_FOR = 30000; // 30 seconds delay

  useEffect(() => {
    const poll = async () => {
      await new Promise((resolve) => setTimeout(resolve, WAIT_FOR)); // Wait for 30 seconds

      try {
        const response = await getPaymentDatasetAPI(paymentDataset.id); // Fetch updated data
        if (response) {
          const updatedItems = items.map((item) =>
            item.id === response.id ? response : item
          );

          dispatch(updateItemsAction(updatedItems)); // Dispatch updated items to Redux
        }
      } catch (error) {
        console.error("Error while polling:", error);
      }
    };

    if (![COMPLETED, FAILURE].includes(paymentDataset.status)) {
      poll();
    }
  }, [dispatch, items, paymentDataset]);

  return <div>Polling payment dataset...</div>;
};

export default PollingComponent;
