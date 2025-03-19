useEffect(() => {
    // Find which top-level props changed
    Object.keys(props).forEach(key => {
      // If the prop is a nested object and has changed
      if (typeof props[key] === 'object' && props[key] !== null) {
        if (!isEqual(prevProps.current[key], props[key])) {
          console.log(`Prop "${key}" changed:`, {
            from: prevProps.current[key],
            to: props[key]
          });
          
          // Optional: Find which nested properties changed
          findNestedChanges(prevProps.current[key], props[key], key);
        }
      } else if (prevProps.current[key] !== props[key]) {
        console.log(`Prop "${key}" changed:`, {
          from: prevProps.current[key],
          to: props[key]
        });
      }
    });
    
    prevProps.current = JSON.parse(JSON.stringify(props)); // Deep clone
  });
  
  return <div>{/* Your component content */}</div>;
}

// Helper to find changes in nested objects
function findNestedChanges(oldObj, newObj, path = '') {
  if (!oldObj || !newObj) return;
  
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
  
  allKeys.forEach(key => {
    const oldVal = oldObj[key];
    const newVal = newObj[key];
    const currentPath = path ? `${path}.${key}` : key;
    
    if (typeof oldVal === 'object' && typeof newVal === 'object' && 
        oldVal !== null && newVal !== null) {
      // Recursively check nested objects
      findNestedChanges(oldVal, newVal, currentPath);
    } else if (!isEqual(oldVal, newVal)) {
      console.log(`Nested prop "${currentPath}" changed:`, {
        from: oldVal,
        to: newVal
      });
    }
  });
}
