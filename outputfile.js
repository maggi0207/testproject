const getSelectedItemCancelStatus = (selected) => {
    const filteredOrders = orderDetailsWithoutError.filter(item => selected.includes(item.mtn));
    const filterPendingOrderItems = filteredOrders.flatMap(order => 
        (order.pendingOrderDetail || []).filter(detail => detail.pendingOrderNumber === props.pendingOrderId)
    );
    return canCancelOrder(filterPendingOrderItems);
};
 {selected.length < orderDetailsWithoutError.length && <StyledButton data-track='service change_delete item' isDark={props.isDark} data-testid='deleteItem' disabled={!getSelectedItemCancelStatus(selected) && (selected.length === 0 || isALPtoLLPChange)} secondary onClick={deleteItem}>Delete Item</StyledButton>}
                     {selected.length === orderDetailsWithoutError.length && <StyledButton  data-track='service change_delete order ' isDark={props.isDark} data-testid='deleteOrder' disabled={!getSelectedItemCancelStatus(selected) && selected.length === 0} secondary onClick={deleteOrder}>Delete Order</StyledButton>}
                 </div>
                    }
