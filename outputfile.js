const getSelectedItemCancelStatus = (selected) => {
    const filteredOrders = orderDetailsWithoutError.filter(item => selected.includes(item.mtn));
    const filterPendingOrderItems = filteredOrders.flatMap(order => 
        (order.pendingOrderDetail || []).filter(detail => detail.pendingOrderNumber === props.pendingOrderId)
    );
    return canCancelOrder(filterPendingOrderItems);
};
