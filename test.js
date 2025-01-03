const getShippingItemDetails = () => {
    const storeName = preferredStoreInfo?.storeName;
    const storeAddressLine1 = preferredStoreInfo?.storeAddressLine1 ?? '';
    const address1 = preferredStoreInfo?.address1 ?? '';
    const city = preferredStoreInfo?.city;
    const state = preferredStoreInfo?.state;
    const storeDetailsText =
      storeName && (storeAddressLine1 || address1) && city && state
        ? `${storeName}, ${storeAddressLine1 || address1}, ${city}, ${state}`
        : "Just bring your devices and we'll take care of the rest. Find a qualified Verizon store near you.";
    const visionCustomerType = cartDetails?.cartHeader?.visionCustomerType || '';
    return {
      storeName: storeName,
      storeAddressLine1: storeAddressLine1,
      address1: address1,
      city: city,
      state: state,
      storeDetailsText: storeDetailsText,
      visionCustomerType: visionCustomerType,
    };
  }
