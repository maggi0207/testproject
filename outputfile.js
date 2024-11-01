const handleSubmit = async (event) => {
  event?.preventDefault();

  const payload = {
    datasetId: collectionData.id,
    dataSetName: collectionData.name,
  };

  try {
    // Dispatch the action and wait for it to complete
    const response = await dispatch(createTestRunAction(payload));

    // Check if the response was successful
    if (response?.success) {
      navigate("/run-catalog");
    } else {
      // Handle any unsuccessful response if necessary
      console.error("Test run creation was unsuccessful:", response);
    }
  } catch (error) {
    // Handle any errors during the action dispatch
    console.error("Error during test run creation:", error);
  }
};
