const isDropdownDisabled = (options) => {
    return !options?.length || (options?.length === 1 && options[0]?.label === 'Select One');
};

isDisabled={isDropdownDisabled(
        field.type === 'Product_Issue_Subtype__c' ? productSubTypeList :
        field.type === 'Product_Name__c' ? productNameList :
        field.type === 'Platform__c' ? platformList :
        field.type === 'Product_Issue_Type__c' ? productTypeList :
        field.type === 'account_type_id' ? accountIdentifierList :
        field.type === 'partners_account_name' ? partnerNameList :
        field.type === 'account_name' ? accountNameList : []
    )}
