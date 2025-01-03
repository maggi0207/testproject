const getShippingItemDetails = () => {
    const { storeName, storeAddressLine1 = '', address1 = '', city, state } = preferredStoreInfo ?? {};
    const storeDetailsText =
      storeName && (storeAddressLine1 || address1) && city && state
        ? `${storeName}, ${storeAddressLine1 || address1}, ${city}, ${state}`
        : "Just bring your devices and we'll take care of the rest. Find a qualified Verizon store near you.";
    const visionCustomerType = cartDetails?.cartHeader?.visionCustomerType ?? '';
    return {
      storeName,
      storeAddressLine1,
      address1,
      city,
      state,
      storeDetailsText,
      visionCustomerType,
    };
};
