const stringifiedBusinessData = (item) => {
  if (!item) return '';
  
  const addressParts = [
    item.city,
    item.state && item.postalCode ? `${item.state} ${item.postalCode}` : item.state || item.postalCode
  ].filter(Boolean);
  
  const fullAddress = addressParts.join(', ');
  
  return [item.displayName, item.addressLine1, fullAddress]
    .filter(Boolean)
    .join('\n');
};
