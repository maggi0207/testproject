
  useEffect(() => {
    if (AddTradeinToCartResult?.status === 'fulfilled') {
      if (window?.mfe?.scmUpgradeMfeEnable) {

        const lineItem = customerInfo?.billAccounts?.[0]?.mtns?.find((line) => line?.mtn === customerInfo?.lookupMtn);
        const deviceSkuIdName = lineItem?.equipmentInfos?.[0]?.deviceInfo?.deviceSku;
       const deviceId = lineItem?.equipmentInfos?.[0]?.deviceInfo?.deviceId;
        Emitter.emit('ADD_SELECTED_DEVICE_TO_CART', { AddTradeinToCart: AddTradeinToCartResult });
      
        window?.mfe?.historyRef.push(
          `${acssMfeBasePath}/product-detail.html?deviceSKU=${deviceSkuIdName}&isByodUpdate=true&deviceId=${deviceId}&isEditAndView=true&activeMtn=${customerInfo?.lookupMtn}&fromPage=Landing&aal=Y`
        );
      } else {
        window.location.href = `/sales/assisted/landing.html`;
      }
    } else if (AddTradeinToCartResult?.status !== 'uninitialized' && AddTradeinToCartResult?.status !== 'pending') {
      setCurrentSection('TermsConditions');
    }
  }, [AddTradeinToCartResult]);


const mockCustomerInfo = {
  billAccounts: [
    {
      mtns: [
        {
          mtn: '1234567890', 
          equipmentInfos: [
            {
              deviceInfo: {
                deviceSku: 'mockSku123',
                deviceId: 'mockDevice456',
              },
            },
          ],
        },
      ],
    },
  ],
  lookupMtn: '1234567890', 
};

