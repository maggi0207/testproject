const getSelectedItemCancelStatus = (selected) => {
        const filteredOrders = orderDetailsWithoutError.filter(item => selected.includes(item.mtn));
        const filterPendingOrderItems = filteredOrders.length> 0 && filteredOrders?.pendingOrderDetail.filter(item.pendingOrderNumber === props.pendingOrderId)
        const canCancelOrders = canCancelOrder(filterPendingOrderItems);
        return canCancelOrders;
    }
