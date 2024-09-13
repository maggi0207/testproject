import { useState, useEffect,useRef } from 'react';
import DropzoneComp from '../Dropzone';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import {getSAPId} from '../../../../Services/getSAPId';
import { getCPIMData } from '../../../../Services/getCPIMData';
import GetUserAssetAndContactInfo from '../../../../Services/getUserAssetAndContactInfo';
import CreateCase, { GetProductTypeList, GetProductSubTypeList, GetDynamicFieldList, GetAwsQueue } from '../../../../Services/createCase';
import { useIndexedDB } from 'react-indexed-db';
import DynamicFieldComp from './DynamicField';
import NextgenSimpleModal from '../Modal/NextgenSimpleModal';
import { loadingIndicatorActions } from '../../../../store/LoadingIndicator/LoadingIndicatorSlice';
import * as Constants from '../../../../utils/constants';
import { dataLayerCaseEvent,ModalAnalyticsCall, fireDLEventForAttachments, dataLayerCaseCreationTimer,dataLayerHelpDocumentation } from '../../../../utils/analyticsUtils';
import {decode} from 'html-entities';
import TextAreaFieldCounter from '../TextAreaFieldCounter';
import CaseSecondaryContact from '../CaseDetail/CaseSecondaryContacts';
import { GetSecondaryContacts } from '../../../../Services/secondaryContacts';
import { getContactInitials, sortArray, handleRedirect, reduceArrayOfObjects } from '../../../../utils/genericUtil';
import { LearningPagesList } from './LearningPagesList';
import { HelpfulPopup } from '../Modal/HelpfulPopup';
import ReactTooltip from 'react-tooltip';

//TODO - data has been moved to temporarily address the issues caused by mutating props in openCaseFormBody. 
// This is not recommended and should be reverted when possible by moving data modifications into in app state.
const newCaseData = {
    "openCaseTitle": "Submit a New Case",
    "cancelBtnLabel": "Cancel",
    "submitBtnLabel": "Submit",
    "openCaseDescription": "Please fill out all the required fields below to connect with a support analyst. To chat about an existing case, please start chat from the case details page.\r\n",
    "formLabelList": [
        {
            "type": "account_name",
            "fieldType": "dropdown",
            "fieldLabel": "Account Name"
        },
        {
            "type": "account_type_id",
            "fieldType": "dropdown",
            "fieldLabel": "Account Identifier"
        },
        {
            "type": "Product_Name__c",
            "fieldType": "dropdown",
            "fieldLabel": "Please select a product"
        },
        {
            "fieldType": "dropdown",
            "type": "partners_account_name",
            "fieldLabel": "Partner Account Name"
        },
        {
            "type": "Platform__c",
            "fieldType": "dropdown",
            "fieldLabel": "Please select a platform"
        },
        {
            "type": "Product_Issue_Type__c",
            "fieldType": "dropdown",
            "fieldLabel": "Product Request Type"
        },
        {
            "type": "Product_Issue_Subtype__c",
            "fieldType": "dropdown",
            "fieldLabel": "Product Request Subtype"
        },
        {
            "type": "Description",
            "fieldType": "textArea",
            "fieldLabel": "Description",
            "maxLength": 200
        }
    ]
};

const OpenCaseFormBody = ({data=newCaseData, isCreateCaseComp, toggleChat, isActive, minimizeWindow, setIsLoading, handleSubmitForm, handleCaseError, calculateChatOperationHours, disableCreateCaseBtnOnAwsHours, setAccountIDForChat=undefined}) => {
    //URLSearchParams object instance, Iterator with search params in the browser url search
    const queryParams = new URLSearchParams(window.location.search);
    //Get value of partnerCase searchParam from the URL. It will be true in partner case creation flow or null
    const partnerCaseQueryParam = queryParams.get('partnerCase');
    //isPartnerNewCase - true in partner create case flow and null otherwise
    const isPartnerNewCase = isCreateCaseComp ? partnerCaseQueryParam : null;
	const userInfoProps = useSelector((state) => state.userInfo.userInfoProps);
    const userData = userInfoProps?.userdata;
    const dispatch = useDispatch();
    const [accountId, setAccountId] = useState('');
    const [phone, setPhone] = useState();
 	const [openCaseEventFired, setOpenCaseEventFired] = useState(true);
    const [userAsset, setUserAsset] = useState();
    const [accountNameList, setAccountNameList] = useState();
 	const [accountNameforText, setAccountNameforText] = useState();
	const [accountIdentiferforText, setAccountIdentiferforText] = useState();
   	const [accountIdentifierList, setAccountIdentifierList] = useState([]);
   	const [accountIdentifier, SetAccountIdentifier] = useState({ label: 'Select One'});
	const [accountIdentifierId, setAccountIdentifierId] = useState('');
	const [userAssetOriginalData, setUserAssetOriginalData] = useState();
   	const [partnerNameList, setPartnerNameList] = useState([]);
   	const [partnerName, setPartnerName] = useState({ label: 'Select One'});
	const [partnerNameId, setPartnerNameId] = useState('');
    const [productNameList, setProductNameList] = useState([]);
    const [platformList, setPlatformList] = useState([]);
    const [productTypeList,setProductTypeList] = useState([]);
    const [productSubTypeList,setProductSubTypeList] = useState([]);
    const [dynamicFieldList,setDynamicFieldList] = useState([]);
    const [dynamicFieldData,setDynamicFieldData] = useState([]);
    const [product, SetProduct] = useState({ label: 'Select One'});
    const [platform, setPlatform] = useState({ label: 'Select One'});
    const [casetype, SetCaseType] = useState({ label: 'Select One'});
    const [casesubtype, SetCaseSubType] = useState({ label: 'Select One'});
    const [accountname, SetAccountName] = useState({ label: 'Select One'});
    const [description, setDescription] = useState('');
    const [customer_ref_no, setCustomerRefNo] = useState('');
    const [combinedFileSizeErrorModal, setCombinedFileSizeErrorModal] = useState(false);
    const [descAttachModal,setDescAttachModal] = useState(false);
    const [clearAllAttachment,setClearAllAttachment] = useState(false);
    const [productCaseType,setProductCaseType] = useState('');
    const [isHelpDocumentOpened,setIsHelpDocumentOpened] = useState(false);
    const [isHelpPlatformDocumentOpened,setIsPlatformHelpDocumentOpened] = useState(false);
    const [userAssetInfoData, setUserAssetInfoData] = useState({});
    const [payloadContactsList, setPayloadContactsList] = useState([]);
    const [caseCreationStartTime, setCaseCreationStartTime] = useState(null);
    const [textValues, setTextValues] = useState({});
    const accountIdentifierForNewPartnerCase = [
        {
            label: 'Tax ID',
            value: 'TaxId'
        },
        {
            label: 'RPA ID',
            value: 'RpaId'
        }
        
    ]
    const [accountidentifierSearchOpt, setAccountidentifierSearchOpt] = useState({label: accountIdentifierForNewPartnerCase[0].label, value: accountIdentifierForNewPartnerCase[0].value});
    const [accountIdentifierDisplayId, setAccountIdentifierDisplayId] = useState({ inputValueOnChange: '', inputValueOnBlur: ''});
    const [selectedContactsList, setSelectedContactsList] = useState([]);
    const [contactsList, setContactsList] = useState([]);
    const [errorModalMessage, setErrorModalMessage] = useState({errorModalTitle: '', errorModalDescription: ''});
    const descriptionRef = useRef(null);
    const [modalState, setModalState] = useState({
        confirmationModal: false,
        successModal: false,
        errorModal: false,
    });
    const [editingValueRep, setEditingValueRep] = useState();
    const [currentSelectedDropdown, setCurrentSelectedDropdown] = useState({
        type: '',
        label: '',
        value: ''
    });
    const [currentSelectedText, setCurrentSelectedText] = useState({
        type: '',
        label: '',
        value: ''
    });
    const account_name = useRef(null);
	const account_type_id = useRef(null);
	const partner_type_name = useRef(null);
    const Product_Name__c = useRef(null);
    const Product_Issue_Type__c = useRef(null);
    const Product_Issue_Subtype__c = useRef(null);

    const [showMultiFields,setShowMultiFields] = useState(false);
    const [mutliFieldsData,setMultiFieldsData] = useState([]);
    const [multiFieldsList,setMultiFieldsList] = useState([]);
    const [prepopulateData,setPrepopulateData] = useState([]);
    const [learningPageLinks, setLearningPageLinks] = useState({ showLearningPageLinks: false, learningPagesList: {}});
    const prepopulateMapping = {
        'Tax ID': Constants?.PREPOPULATE_KEY?.[0],
        'Payer ID': Constants?.PREPOPULATE_KEY?.[1],
        'Submitter ID': Constants?.PREPOPULATE_KEY?.[2],
        'RPA ID': Constants?.PREPOPULATE_KEY?.[3]
    };
    const { getAll, clear } = useIndexedDB('ECCH_Data');
    const multifieldLabels = ['ERA Status (Missing ERA)', 'Missing ERA'];
    const [platformAssigned, setPlatformAssigned] = useState(false)
    const maxCharactersLength = 50;

    let staticFields = {};

    // Form fields added to form errors object.
    data?.formLabelList?.forEach((field, index) => {
        if ((field.type !== 'your_name') && (field.type !== 'email_address') && (field.type !== 'phone_number') && (field.type !== 'account_id') && (field.type !=='External_Reference__c') && (field.type !=='secondary_contact')) {
            staticFields = {...staticFields, [field.type]: null }
        }
    });

    [
        {
            "type": "account_name",
            "fieldType": "dropdown",
            "fieldLabel": "Account Name"
        },
        {
            "type": "account_type_id",
            "fieldType": "dropdown",
            "fieldLabel": "Account Identifier"
        },
        {
            "type": "Product_Name__c",
            "fieldType": "dropdown",
            "fieldLabel": "Please select a product"
        },
        {
            "fieldType": "dropdown",
            "type": "partners_account_name",
            "fieldLabel": "Partner Account Name"
        },
        {
            "type": "Platform__c",
            "fieldType": "dropdown",
            "fieldLabel": "Please select a platform"
        },
        {
            "type": "Product_Issue_Type__c",
            "fieldType": "dropdown",
            "fieldLabel": "Product Request Type"
        },
        {
            "type": "Product_Issue_Subtype__c",
            "fieldType": "dropdown",
            "fieldLabel": "Product Request Subtype"
        },
        {
            "type": "Description",
            "fieldType": "textArea",
            "fieldLabel": "Description",
            "maxLength": 200
        }
    ]

    console.log("data-formlist",data.formLabelList);

    // Fiel dropzone table columns.
    const gridColumns = data?.attachmentTabList?.map((item) => ({
        dataName: `${item?.fieldType}`,
        text: `${item?.fieldLabel}`,
      }
    ));
    //TODO - check if the below functioning as expected since timer should be initiated at initiation and not at isCreateCaseComp change
    //Create Case startTime event
    useEffect(() => {
        if(isCreateCaseComp)
        {
            setCreateCaseStarted();
            setCaseCreationStartTime(new Date().getTime());
        }
    }, [isCreateCaseComp]);

    const [formErrors, setFormErrors] = useState(staticFields);
    const [formErrorsStatic, setFormErrorsStatic] = useState(staticFields);
    const [disableBtn, setDisableBtn] = useState(true);

    const fetchAccountDetails = (result) => {
        const userAssetAndContactData = {
            userAssetDataList:
                result?.compositeResponse[0].body.records?.map((item, i) => ({
                    Account_Name__c: `${item.Account_Name__c}`,
                    AccountId: `${item.AccountId}`,
                    AssetId: `${item.Id}`,
                    Product_Name__c: `${item.Product_Name__c}`,
                    Platform__c :item.Platform__c ? item.Platform__c : '',
                    PartnerName: item.Partner_Name__c ? item.Partner_Name__c : '',
                    Product_Case_Type__c: `${item.Product_Case_Type__c}`,
                    GlobalAccountId: `${item?.Account?.global_account_id__c}`,
                    ProviderId: item?.Account?.Federal_Tax_ID__c ? item.Account.Federal_Tax_ID__c : '',
                    PayerId: item?.Account?.Payer_ID__c ? item.Account.Payer_ID__c : '',
                    SubmitterId: item?.Account?.Submitter_ID__c ? item.Account.Submitter_ID__c : '',
                    RpaId: item?.Account?.AccountNumber ? item.Account.AccountNumber : '',
					HubChatEnabled: item?.Product2?.Hub_Chat_Enabled__c,
                    SupportDataAccess__c: item?.Account?.SupportDataAccess__c ? item.Account.SupportDataAccess__c : '',
                })),
                Phone:result?.compositeResponse[1].body.records[0].Phone,
                contactId:result?.compositeResponse[1].body.records[0].Id
        }
        // Sets user phone no in setPhone state.
        setPhone(userAssetAndContactData?.Phone !== undefined ? userAssetAndContactData?.Phone : '' )
        let uniqueUserAssetData = userAssetAndContactData.userAssetDataList.filter((elem, index) =>
        userAssetAndContactData.userAssetDataList.findIndex(obj => obj.Account_Name__c === elem.Account_Name__c && obj.Product_Name__c === elem.Product_Name__c && obj.AccountId === elem.AccountId && obj.PartnerName === elem.PartnerName && obj.Platform__c === elem.Platform__c) === index);
		let hubSupportedData;
		if (!isCreateCaseComp) {
			uniqueUserAssetData = uniqueUserAssetData?.filter(obj => obj.HubChatEnabled === true);
			hubSupportedData = userAssetAndContactData?.userAssetDataList?.filter(obj => obj.HubChatEnabled === true);
		}

        const UserAssetAndContactInfoProps = {
            userAssetInfo: uniqueUserAssetData,
            contactId: userAssetAndContactData.contactId
        }
        // Sets user's asset info and contact id in setUserAsset state.
        setUserAsset(UserAssetAndContactInfoProps);
        setUserAssetOriginalData(!isCreateCaseComp ? hubSupportedData : userAssetAndContactData.userAssetDataList);
        const uniqueAccountNameData = UserAssetAndContactInfoProps.userAssetInfo.filter((elem, index) =>
                                        UserAssetAndContactInfoProps.userAssetInfo.findIndex(obj => obj.Account_Name__c === elem.Account_Name__c) === index);
        const  AccountNameList = uniqueAccountNameData?.map((propItem, Index) => {
            return {
                label:propItem.Account_Name__c,
                value:propItem.GlobalAccountId
            }
        });
        if (AccountNameList?.length === 1) {
            data?.formLabelList.map((element) => {
                if (element.type === 'account_name') {
                    element.fieldType = "text";
                }
            });
            setAccountNameforText(AccountNameList[0]?.label);

            setAccountId(AccountNameList[0]?.value);
            SetAccountName({ label: AccountNameList[0]?.label });
            let uniqueAccountIdsList = [];

            if (UserAssetAndContactInfoProps?.userAssetInfo) {
				if (isPartnerNewCase === 'true') {
					uniqueAccountIdsList = getAccountIdentifierIds(UserAssetAndContactInfoProps.userAssetInfo, AccountNameList[0]?.label);
					let updatedFormError = { ...formErrorsStatic, 'account_type_id': false, 'account_name': false };
					//Sets the account identifier as dropdown or text
					setAccountIdentifer(data?.formLabelList, uniqueAccountIdsList, AccountNameList[0]?.label, updatedFormError, UserAssetAndContactInfoProps.userAssetInfo);
					setAccountIdentifierList(uniqueAccountIdsList);
				} else {
					let filteredSapIds = [];
					//Get SAP Ids for pre populated account id when there is only one account
					filteredSapIds = getSAPIdForSelectedAccount(UserAssetAndContactInfoProps.userAssetInfo, AccountNameList[0]?.label);
					filteredSapIds.then((result) => {
						// Calls getAccountIdentifierIds method and gets the unique account identifier list
						uniqueAccountIdsList = getAccountIdentifierIds(UserAssetAndContactInfoProps.userAssetInfo, AccountNameList[0]?.label, result);
						let updatedFormError = { ...formErrorsStatic, 'account_type_id': false, 'account_name': false };
						//Sets the account identifier as dropdown or text
						setAccountIdentifer(data?.formLabelList, uniqueAccountIdsList, AccountNameList[0]?.label, updatedFormError, UserAssetAndContactInfoProps.userAssetInfo);
						setAccountIdentifierList(uniqueAccountIdsList);
					});
				}

            }  else {
                setAccountIdentifierList([]);
            }
            if (isPartnerNewCase === 'true') {
                let productList = [];
                let uniqueProductList = [];
                UserAssetAndContactInfoProps?.userAssetInfo?.map((propItem) => {
                    if (propItem.Account_Name__c === AccountNameList[0]?.label && propItem.AccountId === uniqueAccountIdsList[0]?.value) {
                        productList.push({
                            label: propItem.Product_Name__c,
                            value: propItem.Product_Case_Type__c
                        });
                    }
                });
                uniqueProductList = productList.filter((obj,index) => 
                    productList.findIndex(elem => elem.label === obj.label && elem.value === obj.value) === index)
                uniqueProductList.sort((a, b) => { return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : ((b.label.toLowerCase() > a.label.toLowerCase()) ? -1 : 0); });
                //Setting products list
                setProductNameList(uniqueProductList);
                SetProduct({ label: 'Select One' });
                setPlatform({ label: 'Select One' });
                setPartnerName({label: 'Select One'});
                SetCaseType({ label: 'Select One' });
                SetCaseSubType({ label: 'Select One' });
            }
        } else {
            // Populate account list in account dropdown after sorting
            AccountNameList.sort((a, b) => { return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : ((b.label.toLowerCase() > a.label.toLowerCase()) ? -1 : 0); });
            setAccountNameList(AccountNameList);
        }
    }

    useEffect(() => {
        // If the user email is not test email and component is not New Partner Case.
        if (userInfoProps?.userCallSuccessful && isPartnerNewCase === null) {
            // Call API to get user contact info.
            const userAssetAndContactInfoData = GetUserAssetAndContactInfo();
            userAssetAndContactInfoData?.then(result => {
                if (result) {
                    fetchAccountDetails(result);
                    setUserAssetInfoData(result);
                }
            });
        }
    }, [userData]);

     /**
     * Checks if chat window is open and user is in chat open case form component.
     */
    const fetchAccountIdentifier = () => {
        if (!minimizeWindow && !isCreateCaseComp && accountIdentiferforText) {
            let accountIdentifierList = [];
            // Calls getAccountIdentifierIds method and gets the unique account identifier list
            accountIdentifierList = getAccountIdentifierIds(userAsset?.userAssetInfo, accountname?.label);
            if (accountIdentifierList?.length === 1) {
                data?.formLabelList?.map((element) => {
                    if (element.type === 'account_type_id') {
                        element.fieldType = "text";
                    }
                });
                setAccountIdentiferforText(accountIdentifierList[0]?.label !== 'Other' ? accountIdentifierList[0]?.label : 'N/A');
                setAccountIdentifierId(accountIdentifierList[0]?.value);
                validateFields('text', accountIdentifierList[0].label, 'account_type_id');
            }
        }
    }

    /**
     * Called when user closes or opens the chat window.
     */
    useEffect(() => {
        if (isActive) {
            setFormErrors((errors) => ({...errors, 'Description': null}));
            setFormErrorsStatic((errors) => ({...errors, 'Description': null}));
            if(accountname.label && accountname.label !== 'Select One') {
                clearFormValuesOnAccountOptChange();
                fetchAccountDetails(userAssetInfoData);
                setPayloadContactsList([]);
            } else {
                setDescription('');
                descriptionRef.current.value = '';
            }
        }
    }, [isActive]);

    /**
     * Called when user maximize chat open case form.
     */
     useEffect(() => {
        fetchAccountIdentifier(); //TODO - duplication of code written below wich partnernewcase null check, dedupe the code
        // Checks if chat window is open and user is in chat open case form component.
        if (!minimizeWindow && !isCreateCaseComp && accountIdentiferforText && isPartnerNewCase === null) {
            let accountIdentifierList = [];
            // Calls getAccountIdentifierIds method and gets the unique account identifier list
            accountIdentifierList = getAccountIdentifierIds(userAsset?.userAssetInfo, accountname?.label);
            if (accountIdentifierList?.length === 1) {
                data?.formLabelList?.map((element) => {
                    if (element.type === 'account_type_id') {
                        element.fieldType = "text";
                    }
                });
                setAccountIdentiferforText(accountIdentifierList[0]?.label !== 'Other' ? accountIdentifierList[0]?.label : 'N/A');
                setAccountIdentifierId(accountIdentifierList[0]?.value);
                validateFields('text', accountIdentifierList[0].label, 'account_type_id');
            }
        }
    }, [minimizeWindow]);

    //TODO - we dont need the first useEffect if formErrors can be added to the dependencies of the second useeffect below
    /* Error Handling Code Start Here */
    useEffect(() => {
        // If any property in formErrors object is true or null then disable create case button.
        if (Object.values(formErrors).includes(true) || Object.values(formErrors).includes(null)) {
            setDisableBtn(true);
        } else {
            setDisableBtn(false);
        }
    }, [formErrors]);

    useEffect(() => {
        // If product, case type, subtype dropdowns contain Select One as label then disable create case button.
        if (product?.label?.trim() === 'Select One' || casetype?.label?.trim() === 'Select One' || casesubtype?.label?.trim() === 'Select One' || accountIdentifier?.label?.trim() === 'Select One' || partnerName?.label?.trim() === 'Select One' || platform?.label?.trim() === 'Select One') {
            setDisableBtn(true);
        } else {
            // If any property in formErrors object is true or null then disable create case button.
            if (Object.values(formErrors).includes(true) || Object.values(formErrors).includes(null)) {
                setDisableBtn(true);
            } else {
                setDisableBtn(false);
            }
        }
    }, [product, casetype, casesubtype, accountIdentifier, platform]);

    useEffect(() => {
        let contactsListConst = [];
        if (accountIdentifierId && isCreateCaseComp) {
            const getSecondaryContacts = GetSecondaryContacts(accountIdentifierId, userAsset?.contactId, 'createcase');
            getSecondaryContacts.then((result) => {
                result?.records?.map((record, index) => {
                    contactsListConst.push({
                        label: getContactInitials(record?.Contact?.FirstName, record?.Contact?.LastName, 'secondaryContacts'),
                        value: `${record?.Contact?.FirstName} ${record?.Contact?.LastName} ${index}`,
                        contactId: record?.ContactId,
                        accountId: record?.AccountId
                    });
                });
                contactsListConst = sortArray(contactsListConst, 'value');
            });
            setContactsList(contactsListConst);
        }
    }, [accountIdentifierId]);

    /**
     * Fire analytics for create case event.
     */
	const setCreateCaseStarted = () => {
        // Checks if the analytics is fired earlier or not.
		if (openCaseEventFired) {
			dataLayerCaseEvent("Case: Create Case Started");
            // Sets openCaseEventFired as false so the analytics is fired one time only.
			setOpenCaseEventFired(false);
		}
	}

    /**
     * Validates all the form fields.
     * @param {string} field - Field eg. dropdown, text.
     * @param {string} value - Field value.
     * @param {string} fieldType - Field type.
     */
    const validateFields = (field, value, fieldType) => {
        if (field === 'text') {
            let flag = null;
            // Sets flag as true if value is null.
            if (value?.trim() === '') {
                flag = true;
                if (fieldType === 'Description') {
                    setDescription('');
                }
            } else {
                flag = false;
                /* If value is valid and fieldtype is descrition or external ref no then sets respective state with the value
                    as these fields have only null check validation. */
                if (fieldType === 'Description') setDescription(value);
                if (fieldType === 'External_Reference__c') setCustomerRefNo(value);
            }
            // Sets setFormErrors state properties with respective flag value.
            setFormErrors({
                ...formErrors, [fieldType]: flag
            });
            // Sets setFormErrorsStatic state properties with respective flag value for static fields only.
            if(!fieldType.includes('dynField')){
                setFormErrorsStatic({
                    ...formErrorsStatic, [fieldType]:flag
                });
            }
        } else if (field === 'dropdown') {
            let flagdropdown = null;
            // Sets flag as true if value is null or Select One.
            if (value?.trim() === '' || value?.trim() === 'Select One') {
                flagdropdown = true;
            } else {
                flagdropdown = false;
            }
            // Sets setFormErrors state properties with respective flag value.
            setFormErrors({
                ...formErrors, [fieldType]: flagdropdown
            });
            // Sets setFormErrorsStatic state properties with respective flag value for static fields only.
            if(!fieldType.includes('dynField')){
                setFormErrorsStatic({
                    ...formErrorsStatic, [fieldType]:flagdropdown
                });
            }
        }
    }
    /* Error Handling Code End Here */

    /**
     * Called when user updates external ref field value and sets setCustomerRefNo if text length is less than 50 chars.
     * @param {string} value - Field value.
     */
    const externalRefValidation = (value) => {
        // Sets setCustomerRefNo with value if text length is less than 50 chars.
        if (value?.length <= 50) {
            setCustomerRefNo(value);
        }
    }

    //This method calls the sap id api and returns a list of unique spa ids
	const getSAPIdForSelectedAccount = async (userAssets, accountLabel) => {
		let accountIdList = [];
		let uniqueAccountIdList = [];
		let finalUniqueSAPIds = [];
		//Gets all account ids for the selected account name
		userAssets?.forEach((propItem) => {
			if (propItem.Account_Name__c === accountLabel) {
				accountIdList.push(
					`'${propItem.AccountId}'`
				);
			}
		});
		// Remove duplicate Account Ids
		uniqueAccountIdList = accountIdList?.filter((item, index) => accountIdList.indexOf(item) === index);
		//Create comman separated string of account ids
		let accountIdCommaSeparated = uniqueAccountIdList?.toString();

		//Call api and get SAP Ids for the selected account id
		const sapIds = getSAPId(accountIdCommaSeparated);
		finalUniqueSAPIds = await sapIds.then((result) => {
            let sapIdList = [];
            let uniqueSAPIds = [];
			result?.records?.forEach((record) => {
				if (record?.Type__c === "SAP ID" && record?.Name != null && record?.Account__c !== '') {
					sapIdList.push({
						label: `SAP ID: ${record?.Name}`,
						value: `${record?.Account__c}`
					});
				}
			});
			// Remove duplicate SAP Ids
			uniqueSAPIds = sapIdList.filter((v, i, a) => a.findIndex(v2 => (v2.label === v.label)) === i);
			return uniqueSAPIds;
		});
		return finalUniqueSAPIds;
	}

	/**
	* For the selected account name, we would iterate through all the records and list of account identifier is created.
	* This list would have values like this - ProviderId:4238, PayerId:5676, SubmitterId:999.
	* If all the (PayerId, ProviderId and SubmitterId) are null, then we would add "Other" to the list.
	* @param {string} userAssets - list of records from UserAsset api call.
	* @param {string} accountLabel - Selected account name.
	*/
	const getAccountIdentifierIds = (userAssets, accountLabel,sapIdList) => {
		let uniqueAccountIdentifierList = [];
		//Add the sap ids to the account identifier list
		if (sapIdList?.length > 0) {
            uniqueAccountIdentifierList.push.apply(uniqueAccountIdentifierList, sapIdList);
        }
		userAssets?.forEach((propItem) => {
			if (propItem.Account_Name__c === accountLabel) {
				if (propItem.ProviderId === "" && propItem.PayerId === "" && propItem.SubmitterId === "" && propItem.RpaId === "" && sapIdList != null && sapIdList.length < 1) {
					uniqueAccountIdentifierList.push({
						label: `Other`,
						value: propItem.AccountId,
                        globalId: propItem?.GlobalAccountId
					});
				} else {
					let rpaId = propItem.RpaId !== "" ? `/RPA ID: ${propItem.RpaId}` : "";
					if (propItem.ProviderId !== "") {
						uniqueAccountIdentifierList.push({
							label: `Tax ID: ${propItem.ProviderId}${rpaId}`,
							value: propItem.AccountId,
                            [Constants?.PREPOPULATE_KEY?.[0]]:propItem.ProviderId,
                            [Constants?.PREPOPULATE_KEY?.[3]]:propItem.RpaId,
                            globalId: propItem?.GlobalAccountId
						});
					}
					if (propItem.PayerId !== "") {
						uniqueAccountIdentifierList.push({
							label: `Payer ID: ${propItem.PayerId}${rpaId}`,
							value: propItem.AccountId,
                            [Constants?.PREPOPULATE_KEY?.[1]]:propItem.PayerId,
                            [Constants?.PREPOPULATE_KEY?.[3]]:propItem.RpaId,
                            globalId: propItem?.GlobalAccountId
						});
					}
					if (propItem.SubmitterId !== "") {
						uniqueAccountIdentifierList.push({
							label: `Submitter ID: ${propItem.SubmitterId}${rpaId}`,
							value: propItem.AccountId,
                            [Constants?.PREPOPULATE_KEY?.[2]]:propItem.SubmitterId,
                            [Constants?.PREPOPULATE_KEY?.[3]]:propItem.RpaId,
                            globalId: propItem?.GlobalAccountId
						});
					}
                    if (propItem.RpaId !== "" && propItem.ProviderId === "" && propItem.PayerId === "" && propItem.SubmitterId === "") {
						uniqueAccountIdentifierList.push({
							label: `RPA ID: ${propItem.RpaId}`,
							value: propItem.AccountId,
                            [Constants?.PREPOPULATE_KEY?.[3]]: propItem.RpaId,
                            globalId: propItem?.GlobalAccountId
						});
					}
				}
			}
		});

		// Removing duplicate account identifier ids
		let uniqueData = uniqueAccountIdentifierList.filter((tag, index, array) => array.findIndex(t => t.label == tag.label) == index);

		// Sorting the account identifiers alphabetically but keeping "Other" at the end
		uniqueData.sort((a, b) => {
			if (a.label == "Other") return 1;
			if (b.label == "Other") return -1;
			return a.val - b.val;
		});
		return uniqueData;
	}

	/**
	* This method checks if account identifier list has one record, then converts the account identifier dropdown to "Text" field.
	* Also this method populates the product dropdown if account idenfier is grayed-out (for single value).
	* If account identifier list has more than one record then account identifer dropdown is set but
	* product dropdown is emptied. When user will select, account identifer, then product dropdown will be populated.
	* @param {string} dataList - Authored list from AEM which field types and other labels
	* @param {string} accountIdentifierList - List of account identifiers
	* @param {string} label - Selected account name.
	* @param {string} formError - formerror data to validation
	* @param {string} userAssets - list of records from UserAsset api call.
	*/
	const setAccountIdentifer = (dataList, accountIdentifierList, label, formError, userAssets) => {
		//Checking if account identifier list has one record,then converts the account identifier dropdown to "Text" field
        if (accountIdentifierList?.length === 1) {
            //TODO - inplace updating of dataList can be changed
			dataList.map((element) => {
				if (element.type === 'account_type_id') {
					element.fieldType = "text";
				}
			});
            setPrepopulateData(accountIdentifierList[0]);
            setAccountIdentifierId(accountIdentifierList[0]?.value);
            if (isPartnerNewCase === null) {//POINTER - non partner create case flow
                setAccountIdentiferforText(accountIdentifierList[0]?.label !== 'Other' ? accountIdentifierList[0]?.label : 'N/A');
                validateFields('text', accountIdentifierList[0].label, 'account_type_id');
            }
            let updatedFormError = { ...formError, 'account_type_id': false, 'account_name': false };

			let productList = [];

			// Populates the product dropdown if account idenfier is grayed-out (for single value).
			userAssets?.forEach((propItem) => {
				if (propItem.Account_Name__c === label && propItem.AccountId === accountIdentifierList[0]?.value) {
					productList.push({
						label: propItem.Product_Name__c,
						value: propItem.Product_Case_Type__c
					});
				}
			});

			// Sorting the product list
            let uniqueProductList = [];
            uniqueProductList = productList.filter((obj,index) => 
                productList.findIndex(elem => elem.label === obj.label && elem.value === obj.value) === index)
			uniqueProductList.sort((a, b) => { return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : ((b.label.toLowerCase() > a.label.toLowerCase()) ? -1 : 0); });
			setProductNameList(uniqueProductList);
			SetProduct({ label: 'Select One' });
			SetCaseType({ label: 'Select One' });
			SetCaseSubType({ label: 'Select One' });
            setPlatform({ label: 'Select One'})
            setPartnerName({ label: 'Select One'})
			//Updating form errors state for validation
			if (!descAttachModal) {
				setFormErrors({ ...updatedFormError, 'Product_Name__c': null, 'Product_Issue_Type__c': null, 'Product_Issue_Subtype__c': null,'partners_account_name':null, 'Platform__c': null });
				setFormErrorsStatic({ ...updatedFormError, 'Product_Issue_Type__c': null, 'Product_Issue_Subtype__c': null,'partners_account_name':null, 'Platform__c': null  });
			}
		} else if (isPartnerNewCase === 'true') {
            if (!descAttachModal) {
                let updatedFormError = { ...formError, 'account_type_id': false, 'account_name': false };
                setFormErrors({ ...updatedFormError, 'Product_Name__c': null, 'Product_Issue_Type__c': null, 'Product_Issue_Subtype__c': null, 'Platform__c': null });
                setFormErrorsStatic({ ...updatedFormError, 'Product_Issue_Type__c': null, 'Product_Issue_Subtype__c': null, 'Platform__c': null  });
            }
            setAccountIdentifierId(accountIdentifierList[0]?.value);
        } else if (isPartnerNewCase === null) {
			//If account identifier list has more than one record then account identifer dropdown is set
			dataList?.map((element) => {
				if (element.type === 'account_type_id') {
					element.fieldType = "dropdown";
				}
			});
			setAccountIdentifierList(accountIdentifierList);
			SetAccountIdentifier({ label: 'Select One' });
            setAccountIdentiferforText('');
			setProductNameList([]);
			//Updating form errors state for validation
			if (!descAttachModal) {
				setFormErrors({ ...formError, 'account_type_id': null, 'Product_Name__c': null, 'Product_Issue_Type__c': null, 'Product_Issue_Subtype__c': null,'partners_account_name':null, 'Platform__c': null });
				setFormErrorsStatic({ ...formError, 'account_type_id': null, 'Product_Issue_Type__c': null, 'Product_Issue_Subtype__c': null,'partners_account_name':null, 'Platform__c': null  });
			}
		}
	}

	/**
	* This method creates the dropdown list of unique partner names if partners are more than one. Otherwise hides the partner name field.
	* @param {string} dataList - Authored list from AEM which has field types and other labels
	* @param {string} accountLabel - Selected account name.
	* @param {string} productLabel - Selected product name
	*/
	const processPartnerName = (accountLabel, productLabel, updatedFormError) => {
        let partnerNameList = [];
		// Filters the userasset data array for the selected account name and product name and then creates a partner name list
        //TODO - partner list being created, this can be made for loop with break for efficiency
		userAssetOriginalData?.forEach((propItem) => {
			if (propItem.Account_Name__c === accountLabel && propItem.Product_Name__c === productLabel?.label) {
                partnerNameList.push({
						label: propItem.PartnerName !== "" ? propItem.PartnerName : 'N/A',
						value: propItem.AssetId
					}
                ) 
			}
		});

		// Remove duplicate partner names
		let uniquePartnerNames = partnerNameList.filter((tag, index, array) => array.findIndex(t => t.label === tag.label) === index);
        
        // Sorting the partner name alphabetically but keeping "N/A" at the end
        !!uniquePartnerNames && uniquePartnerNames.sort((a, b) => {
            if (a.label === "N/A") return 1;
            if (b.label === "N/A") return -1;
            return a.label > b.label ? 1 : -1;
        });

        setPartnerNameList(uniquePartnerNames);

        //Checks length of uniquePartnerNames array
		if (uniquePartnerNames?.length === 1) {
            updatedFormError = {...updatedFormError, 'partners_account_name': false}
            if(uniquePartnerNames[0].label === 'N/A'){
                processPlatformField(productLabel, updatedFormError )
            } else{
                setPartnerName({label : uniquePartnerNames[0].label})
                processPlatformField(productLabel, updatedFormError , uniquePartnerNames[0])
            }
		} else if(uniquePartnerNames?.length === 0){
            setPartnerName({label : 'Select One'})
			updatedFormError = {...updatedFormError, 'partners_account_name': false}
            processPlatformField(productLabel, updatedFormError)
        } else {
			setPartnerName({ label: 'Select One' });
            if (!descAttachModal) {
                setFormErrors({...updatedFormError, 'partners_account_name': null});
                setFormErrorsStatic({...updatedFormError, 'partners_account_name': null});
            }
		}
	}

    /**
     * Populates Product, Type, Subtype dropdown fields.
     * @param {string} type - Dropdown field type name.
     * @param {string} label - Dropdown field label.
     * @param {string} value - Field value.
     */
    const onChangeDropdown = (type, label, value) => {
        /* Create DropDown Object */
        const dropDownTypeLabelObj = [
            {type: 'account_name', label: accountname?.label},
            {type: 'Product_Name__c', label: product?.label},
            {type: 'Product_Issue_Type__c', label: casetype?.label},
            {type: 'Product_Issue_Subtype__c', label: casesubtype?.label}
        ];

		if (!accountIdentiferforText) {
            const accountIndex = dropDownTypeLabelObj.findIndex(({type}) => type === 'account_name');
            dropDownTypeLabelObj.splice(accountIndex + 1, 0, {type: 'account_type_id', label: accountIdentifier?.label});
		}

        let showConfirmationPopUp = false;
        const matchIndex = dropDownTypeLabelObj.findIndex(item => item.type === type);
        if(dropDownTypeLabelObj.some(field => field.label !== 'Select One' && field.type === type)){
            const productIssueTypeIndex = dropDownTypeLabelObj.findIndex(({type}) => type === 'Product_Issue_Type__c');
            if (matchIndex !== -1 && matchIndex <= productIssueTypeIndex && dropDownTypeLabelObj[matchIndex + 1]['label'] !== 'Select One') {
                showConfirmationPopUp = true;
            }
            if(type === 'Product_Issue_Subtype__c' && dynamicFieldData?.length > 0){
                showConfirmationPopUp = true;
            }
        }

        /* Check If user Selected the Same value Then Return */
        if(dropDownTypeLabelObj.some(field => field.label === label && field.type === type && field.value === value)){
            return;
        } else {
            setLearningPageLinks({ showLearningPageLinks: false, learningPagesList: {} });
        }

        /* Checks if user selects already selected dropdown label. If not then sets setCurrentSelectedDropdown state
            with currently selected dropdown values. */
        if (label !== currentSelectedDropdown.label) {
            setCurrentSelectedDropdown({ type: type, label: label, value: value});
        }

        let isDescAttachModal = false;
        getAll().then(res => {
            if((res?.length || descriptionRef?.current?.value) && (label !== currentSelectedDropdown.label) && showConfirmationPopUp){
                isDescAttachModal = true;
                setDescAttachModal(true);
            }
            let updatedFormError = {...formErrorsStatic, [type]: false}
            if (type === 'Product_Name__c' && !isDescAttachModal) {
                let productName = label;
                setShowContent(true);

                SetProduct({label, value});
                setProductCaseType(value);
                if(isPartnerNewCase === 'true'){
                    updatedFormError = {...updatedFormError, 'partners_account_name': false}
                    processPlatformField({label, value}, updatedFormError)
                }else {
                    processPartnerName(accountname.label, {label, value}, updatedFormError);
                }
                !isCreateCaseComp && !!setAccountIDForChat && setAccountIDForChat(accountIdentifierId)
                // Set case type dropdown to Select One.
                SetCaseType({label: 'Select One'});
                // Set case subtype dropdown to Select One.
                SetCaseSubType({label: 'Select One'});
                setPartnerName({label: 'Select One'})
                setDynamicFieldData([]);
                setProductSubTypeList([]);
                setDynamicFieldList([]);
                setShowMultiFields(false);
                setMultiFieldsData([]);
                setMultiFieldsList([]);
			} else if (type === 'partners_account_name' && !isDescAttachModal) {
                //TODO - setPartnerNameId is extra state being set here, partnerName can be used where ever we are using partnerNameId
				setPartnerName({ label });
				setPartnerNameId(value);
				updatedFormError = descriptionRef?.current?.value !== '' ? { ...formErrors, 'Description': false, [type]: false} : { ...formErrors, 'Description': null, [type]: false };
                processPlatformField(product, updatedFormError, { label, value })
			} else if (type === 'Platform__c' && !isDescAttachModal) {
                setPlatform({label:label, value:  value})
                setShowContent(false);
                setPlatformAssigned(true);
                updatedFormError = {...updatedFormError, [type]: false}
                processProductTypeList(true, label, product, updatedFormError)
                // Set case type dropdown to Select One.
                SetCaseType({label: 'Select One'});
                // Set case subtype dropdown to Select One.
                SetCaseSubType({label: 'Select One'});
                setDynamicFieldData([]);
                setProductSubTypeList([]);
                setDynamicFieldList([]);
                setShowMultiFields(false);
                setMultiFieldsData([]);
                setMultiFieldsList([]);
            } else if (type === 'Product_Issue_Type__c' && !isDescAttachModal) {
                // SetsetCaseType state to label.
                SetCaseType({label: label});
                if(!!platformAssigned && platform.label !== 'N/A'){
                    let subTypeList = processCPIMData({Product_Case_Type__c : productCaseType, Platform__c: platform.label, Product_Issue_Type__c: label})
                    let res = { subtypes : reduceArrayOfObjects(subTypeList, 'Product_Issue_Subtype__c')}
                    processProductSubTypeList(res, updatedFormError);
                } else {
                    // Calls Servlet to get case subtype list.
                    const ProductSubTypeData = GetProductSubTypeList(label);
                    ProductSubTypeData.then(result => {
                        processProductSubTypeList(result, updatedFormError)
                    });
                }
                
                setDynamicFieldData([]);
                setDynamicFieldList([]);
                setShowMultiFields(false);
                setMultiFieldsData([]);
                setMultiFieldsList([]);
            } else if (type === 'Product_Issue_Subtype__c' && !isDescAttachModal) {
                SetCaseSubType({label: label});
                if (isCreateCaseComp) {
                    
                    let dynamicFieldsPlatformFiltered=[];
                    if(!!platformAssigned && platform?.label !== 'N/A'){
                        let dynamicFieldsDataObj = processCPIMData({Product_Case_Type__c : productCaseType, Platform__c: platform.label, Product_Issue_Type__c: casetype.label, Product_Issue_Subtype__c: label})
                        if(dynamicFieldsDataObj?.length === 1){
                            dynamicFieldsDataObj[0].Required_Case_Attribute_Names__c?.split(';').forEach(field => dynamicFieldsPlatformFiltered.push({fieldName: field, isRequired: true}));
                            dynamicFieldsDataObj[0].Case_Attribute_Names__c?.split(';').forEach(field => dynamicFieldsPlatformFiltered.push({fieldName: field, isRequired: false}));
                        }
                    }
                    // Servlet call for getting dynamic fields.
                    const DynamicFieldsData = GetDynamicFieldList(productCaseType, casetype.label, label);
                    setDynamicFieldData([]);
                    setDynamicFieldList([]);
                    DynamicFieldsData.then(result => {
                        let dynamicFields = {};
                        if(!!platformAssigned && platform?.label !== 'N/A' && result && Object.keys(result).length !== 0){
                            dynamicFields = {
                                dynamicfield : dynamicFieldsPlatformFiltered.map(field => {
                                                for(let elem of result.dynamicfield){
                                                    if(elem.dynamicField === field.fieldName) return elem;
                                                }
                                                return ({
                                                            "dynamicField": field.fieldName,
                                                            "fieldProperties": {
                                                                "isRequired": field.isRequired,
                                                                "type": "text",
                                                                "specialCharAllowed": true,
                                                                "charLimit": ""
                                                            }
                                                        })
                                                }),   
                                learningPage : result.learningPages
                            }
                        } else {
                            dynamicFields = result;
                        }
                        
                        if (dynamicFields?.learningPages && Object.keys?.(dynamicFields?.learningPages)?.length > 0) {
                            const fieldInfo = {
                                product: productCaseType,
                                Type: casetype.label,
                                SubType: label
                            };
                        
                            const linkInfos = dynamicFields?.learningPages.map(learningPage => ({
                                linkText: learningPage.pageTitle,
                                linkUrl: learningPage.pagePath,
                              })).slice(0, 3);
                        
                            const helpCard = {
                                fieldInfo: fieldInfo,
                                linkInfos: linkInfos
                            };
                        
                            dataLayerHelpDocumentation("Help : Open help", helpCard);
                            setLearningPageLinks({ showLearningPageLinks: true, learningPagesList: dynamicFields?.learningPages });
                        }
                        else{

                            const fieldInfo = {
                                product: productCaseType,
                                Type: casetype.label,
                                SubType: label
                            };
                        
                            const helpCard = {
                                fieldInfo: fieldInfo,
                            };
                            dataLayerHelpDocumentation("Help : Not Avaliable", helpCard);

                        }
                        if (dynamicFields?.dynamicfield && Array.isArray(dynamicFields?.dynamicfield)) {
                            // Set dynamicFieldList state to dynamicFields fetched from API.
                            let validateDynFields = {};
                            let dynamicFieldsfields = [];
                            let multiFieldfields = [];
                            let Inc = 1;
                            dynamicFields?.dynamicfield?.forEach((item, index) => {
                                if(multifieldLabels.includes(label) && item?.dynamicField?.includes('Check')) {
                                    multiFieldfields.push(item)
                                }else{
                                    const dynamicFieldKey = `dynField${Inc}`;
                                    if (item?.fieldProperties?.isRequired) {
                                        const prepopulateKey = Object.keys(prepopulateMapping).find(title => item?.dynamicField?.includes(title));
                                        if (prepopulateKey && prepopulateData?.hasOwnProperty(prepopulateMapping[prepopulateKey])) {
                                            validateDynFields = {...validateDynFields, ...{[dynamicFieldKey]: false} }
                                        }else{
                                            validateDynFields = {...validateDynFields, ...{[dynamicFieldKey]: null} }
                                        }
                                    }
                                    dynamicFieldsfields.push({ key: dynamicFieldKey });
                                    Inc++;
                                }
                            });

                            setDynamicFieldData(dynamicFieldsfields);
                            updatedFormError = descriptionRef?.current?.value !== '' ?  {...updatedFormError, 'Description': false} : {...updatedFormError, 'Description': null};

                            let isMultiFields = false;
                            if(multifieldLabels.includes(label)) {
                                isMultiFields = true;
                                updatedFormError = {...updatedFormError, 'multiFields': null,[type]:false};
                                const filteredArr = dynamicFields?.dynamicfield?.filter(obj => !obj.dynamicField.toLowerCase().includes("check"));
                                setDynamicFieldList(filteredArr);
                                setMultiFieldsList(multiFieldfields);
                            }else{
                                setDynamicFieldList(dynamicFields?.dynamicfield);
                                isMultiFields = false;
                                const { multiFields, ...rest } = updatedFormError;
                                updatedFormError = rest;
                            }

                            // Set formErrors state with required dynamic fields.
                            setFormErrors({...updatedFormError,  [type]:false, ...validateDynFields});
                            setFormErrorsStatic({...updatedFormError, [type]:false});
                            setShowMultiFields(isMultiFields);
                        } else {
                            setShowMultiFields(false);
                            setDynamicFieldList([]);
                            setDynamicFieldData([]);
                            setFormErrors({...updatedFormError, [type]:false});
                            setFormErrorsStatic({...updatedFormError, [type]:false});
                        }
                    });
                } else {
                    GetAwsQueue(productCaseType, casetype.label, label).then(res => {
                        calculateChatOperationHours(res);
                    });
                    // Set formErrors state.
                    setFormErrors({...updatedFormError,  [type]:false});
                    setFormErrorsStatic({...updatedFormError, [type]:false});
                }
			} else if (type === 'account_type_id' && !isDescAttachModal) {
                const prepopulatedObj = accountIdentifierList?.find(obj => obj?.label === label);
                prepopulatedObj && prepopulatedObj?.globalId && setAccountId(accountId => prepopulatedObj ? prepopulatedObj?.globalId : accountId);
                setPrepopulateData(prepopulatedObj ? prepopulatedObj : []);
                if (value !== accountIdentifierId) {
                    setContactsList([]);
                }
                if (label !== accountIdentifier?.label) {
                    setSelectedContactsList([]);
                }
                SetAccountIdentifier({ label: label });
                setAccountIdentifierId(value);
				let productList = [];
				//Populates product dropdown for the selected account idenfier and account name
				userAsset?.userAssetInfo?.forEach((propItem) => {
					if (propItem.Account_Name__c === accountname.label && propItem.AccountId === value) {
						productList.push({
							label: propItem.Product_Name__c,
							value: propItem.Product_Case_Type__c
						});
					}
				});
                let uniqueProductList = [];
                uniqueProductList = productList.filter((obj,index) => 
                    productList.findIndex(elem => elem.label === obj.label && elem.value === obj.value) === index)
                uniqueProductList.sort((a, b) => { return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : ((b.label.toLowerCase() > a.label.toLowerCase()) ? -1 : 0); });
                //Setting products list
				setProductNameList(uniqueProductList);
				SetProduct({ label: 'Select One' });
				setPartnerName({label: 'Select One'});
				SetCaseType({ label: 'Select One' });
				SetCaseSubType({ label: 'Select One' });
                setPlatform({ label: 'Select One' });

				updatedFormError = descriptionRef?.current?.value !== '' ? { ...updatedFormError, 'Description': false } : { ...updatedFormError, 'Description': null };

				if (!descAttachModal) {
					setFormErrors({ ...updatedFormError, 'Product_Name__c': null, 'Product_Issue_Type__c': null, 'Product_Issue_Subtype__c': null, 'Platform__c': null });
					setFormErrorsStatic({ ...updatedFormError, 'Product_Name__c': null, 'Product_Issue_Type__c': null, 'Product_Issue_Subtype__c': null,  'Platform__c': null });
				}

				//Setting the lists as empty
				setDynamicFieldData([]);
				setDynamicFieldList([]);
				setProductTypeList([]);
                setPlatformList([]);
				setPartnerNameList([]);
				setProductSubTypeList([]);
                setShowMultiFields(false);
                setMultiFieldsData([]);
                setMultiFieldsList([]);
                setPlatformAssigned(false)
                setPartnerNameId('')
			} else if (type === 'account_name' && !isDescAttachModal) {
                if (userAsset?.userAssetInfo) {
                    //Setting the account name for the selected value
					SetAccountName({label: label});
                    setAccountId(value);

                    setContactsList([]);
                    setSelectedContactsList([]);
                    
                    let filteredSapIds = [];
					//Gets Unique SPA Ids for the selected account
					filteredSapIds = getSAPIdForSelectedAccount(userAsset.userAssetInfo, label);
					filteredSapIds.then((result) => {
                    let accountIdentifierList = [];
                    // Calls getAccountIdentifierIds method and gets the unique account identifier list
                    accountIdentifierList = getAccountIdentifierIds(userAsset.userAssetInfo, label,result);
                    //Sets the account identifier as dropdown or text
                    setAccountIdentifer(data?.formLabelList, accountIdentifierList, label, updatedFormError, userAsset.userAssetInfo);


					//Setting the lists as empty
                    SetProduct({label: 'Select One'});
					setPartnerName({label: 'Select One'});
                    SetCaseType({label: 'Select One'});
                    SetCaseSubType({label: 'Select One'});
                    setPlatform({ label: 'Select One' });
                    setPlatformAssigned(false)
                    setPartnerNameId('')
                    });
                } else {
					setAccountIdentifierList([]);
                }
                setDynamicFieldData([]);
                setDynamicFieldList([]);
                setProductTypeList([]);
                setPlatformList([]);
 				setPartnerNameList([]);
                setProductSubTypeList([]);
                setShowMultiFields(false);
                setMultiFieldsData([]);
                setMultiFieldsList([]);
            }
        });
    }

    /**
     * Used to fetch product type list and set corresponding validations.
     * @param {String} key - the key for which cpim data has to be returne
     * @param {String} value - value of the key that is selected from drop down
     */
    const processCPIMData = (filterObj) => {
        if(cpimData){
            let result = cpimData.filter((cpimObj) => {
                for(let key in filterObj){
                    if(filterObj[key] !== cpimObj[key]) return false;
                }
                return true;
            })
            return result;
        }
    }

    const processPlatformField = (product, updatedFormError, partnerName) => {
        //Populates platform dropdown for the selected account idenfier and product name
        let platformArray =[]
        let fieldInfo = {product: product?.label}

        if(!!partnerName && partnerName?.label === 'N/A'){
            userAsset?.userAssetInfo?.forEach((propItem) => {
                if (propItem?.AssetId === partnerName.value) {
                    platformArray.push({
                        label: propItem.Platform__c !== ''? propItem.Platform__c : 'N/A',
                        value: propItem.AssetId
                    });
                }
            });
        } else {
            userAsset?.userAssetInfo?.forEach((propItem) => {
                if (propItem?.Product_Name__c === product?.label && propItem?.AccountId === accountIdentifierId && (!!partnerName ? propItem?.PartnerName === partnerName?.label : true)) {
                    platformArray.push({
                        label: propItem.Platform__c !== ''? propItem.Platform__c : 'N/A',
                        value: propItem.AssetId
                    });
                }
            });
        }

        

        // Remove duplicate platform names
		let uniquePlatformNames = platformArray.filter((tag, index, array) => array.findIndex(t => t.label === tag.label) === index);

        // Sorting the platform name alphabetically but keeping "N/A" at the end
        !!uniquePlatformNames && uniquePlatformNames.sort((a, b) => {
            if (a.label === "N/A") return 1;
            if (b.label === "N/A") return -1;
            return a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1;
        });
        setPlatformList(uniquePlatformNames)

        if(platformArray?.length === 1)
        {
            updatedFormError = {...updatedFormError, 'Platform__c': false}
            dataLayerHelpDocumentation("Platform Help : Platform not avaliable", {fieldInfo});
            if(platformArray[0]?.label === 'N/A'){
                setPlatformAssigned(false);
                processProductTypeList(false, platformArray[0].label, product, updatedFormError)
            } else {
                setPlatform(platformArray[0]);
                setPlatformAssigned(true);
                processProductTypeList(true, platformArray[0].label, product, updatedFormError)
            }
        }
        else if (platformArray?.length === 0)
        { 
            let assetIdWhenNoPlatform = '';
            for(let propItem of userAsset?.userAssetInfo){
                if(propItem.Product_Name__c === product?.label && propItem?.AccountId === accountIdentifierId){
                    assetIdWhenNoPlatform = propItem.AssetId;
                    break;
                }
            }
            setPlatform({
                label:'noPlatform', 
                value: assetIdWhenNoPlatform
            })
            setPlatformAssigned(false);
            updatedFormError = {...updatedFormError, 'Platform__c': false}
            dataLayerHelpDocumentation("Platform Help : Platform not avaliable", {fieldInfo});
            processProductTypeList(false, 'noPlatform', product, updatedFormError)
        } else if(!!platformArray && platformArray.length > 1){
            setPlatform({ label: 'Select One' });
            setPlatformAssigned(false);
            updatedFormError = {...updatedFormError, 'Platform__c': null}
            if(!isEmptyObject(textValues))
            {
                const linkInfos ={
                    heading :  textValues?.helpfultip_text1,
                    linkText: textValues?.helpfultip_text2?.text,
                    linkUrl:  textValues?.helpfultip_text2?.href,
                    }
            
                const helpCard = {
                    fieldInfo: fieldInfo,
                    linkInfos: linkInfos
                };

                dataLayerHelpDocumentation("Plaform Help : Platform open help", helpCard);
            }
            if(!descAttachModal){
                setFormErrors({...updatedFormError});
                setFormErrorsStatic({...updatedFormError});
            } 
        }
    }

    /**
     * Used to fetch product type list and set corresponding validations.
     * @param {Object} subTypeList - object containing list of subtypes
     * @param {Object} updatedFormError - for validation
     */
    const processProductSubTypeList = (subTypeList, updatedFormError) => {
        let res = subTypeList;
        if (res?.subtypes) {
            let prdData = res?.subtypes?.map((item) => ({
                label: decode(item),
                value: decode(item)
            }));
            prdData.sort((a, b) => {return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : ((b.label.toLowerCase() > a.label.toLowerCase()) ? -1 : 0);});
            // Populate case subtype list dropdown.
            setProductSubTypeList(prdData);
            SetCaseSubType({label: 'Select One'});
        } else {
            setProductSubTypeList([]);
        }

        updatedFormError = descriptionRef?.current?.value !== '' ?  {...updatedFormError, 'Description': false} : {...updatedFormError, 'Description': null};

        if (!descAttachModal) {
            setFormErrors({...updatedFormError, 'Product_Issue_Type__c': false, 'Product_Issue_Subtype__c': null});
            setFormErrorsStatic({...updatedFormError,'Product_Issue_Type__c': false, 'Product_Issue_Subtype__c': null});
        }
    }

    const [cpimData, setCPIMData] = useState([])
    /**
     * Used to fetch product type list and set corresponding validations.
     * @param {String} label - productName
     * @param {String} value - productCaseType
     * @param {Object} updatedFormError - for validation
     */
    const processProductTypeList = (platformAssignedValue, platformLabel, product, updatedFormError) => {
        let value = product?.value;
        const ProductTypeData = !!platformAssignedValue && platformLabel !== 'N/A' ? getCPIMData({pdtn: value, pltf: platformLabel}) : GetProductTypeList(value);
        ProductTypeData.then(result => {
            let res = result;
            if(!!platformAssignedValue && platformLabel !== 'N/A'){
                setCPIMData(result.records)
                res = { types : reduceArrayOfObjects(res.records, 'Product_Issue_Type__c')}
            } 

            if(res?.types) {
                let prdData = res?.types?.map((item,i) => ({
                    label: decode(item),
                    value: decode(item)
                }));
                prdData.sort((a, b) => {return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : ((b.label.toLowerCase() > a.label.toLowerCase()) ? -1 : 0);});
                // Populate product list dropdown.
                setProductTypeList(prdData);
            } else {
                setProductTypeList([]);
            }
            setProductSubTypeList([])
            updatedFormError = descriptionRef?.current?.value !== '' ?  {...updatedFormError, 'Description': false} : {...updatedFormError, 'Description': null};
            if (!descAttachModal) {
                setFormErrors({...updatedFormError, 'Product_Issue_Type__c': null, 'Product_Issue_Subtype__c': null});
                setFormErrorsStatic({...updatedFormError, 'Product_Issue_Type__c': null, 'Product_Issue_Subtype__c': null});
            } else {
                setFormErrors({ ...updatedFormError });
                setFormErrorsStatic({ ...updatedFormError });
            }
        });
    }

    /**
     * Called when user updates description field.
     * @param {Object} e - Event object.
     */
    const handleDescriptionChange = (e) => {
        validateFields('text', e.target.value, 'Description');
    }

    const clearFormValuesOnAccountOptChange = () => {
        data?.formLabelList.map((element) => {
            if (element.type === 'account_name') {
                element.fieldType = "dropdown";
            }
        });
        SetAccountName({ label: 'Select One'});
        setAccountNameforText('');
        setAccountNameList([]);
        setProductNameList([]);
        setPartnerNameList([]);
        setProductTypeList([]);
        setPlatformList([]);
        setProductSubTypeList([]);
        setDynamicFieldData([]);
        setDynamicFieldList([]);
        setShowMultiFields(false);
        setMultiFieldsData([]);
        setAccountIdentifierId('');
        setAccountIdentifierList([]);
        setDescription('');
        setMultiFieldsList([]);
        setAccountId('');
        SetAccountIdentifier({ label: 'Select One' });
        SetProduct({ label: 'Select One' });
        setPlatform({ label: 'Select One' });
        setPartnerName({label: 'Select One'});
        SetCaseType({ label: 'Select One' });
        SetCaseSubType({ label: 'Select One' });
        setContactsList([]);
    }
    /**
     * Called when user updates the account identifier option dropdown in Partner Create Case.
     * @param {string} label -  Dropdown label.
     * @param {string} value - Dropdown value.
     */
    const changeAccIdentifierOpt = (label, value) => {
        let isDescAttachModal = false;
        getAll().then(res => {
            if((res?.length || descriptionRef?.current?.value) && (accountname?.label !== 'Select One' || accountNameforText) && (label !== accountidentifierSearchOpt.label)) {
                isDescAttachModal = true;
                setDescAttachModal(true);
                setCurrentSelectedDropdown({ type: 'account_type_id', label: label, value: value });
            }
            if (label !== accountidentifierSearchOpt.label && !isDescAttachModal) {
                setAccountidentifierSearchOpt({label: label, value: value});
                setAccountIdentifierDisplayId({ inputValueOnChange: '', inputValueOnBlur: '' });
                setFormErrors({ ...formErrors, 'account_type_id': null });
                setFormErrorsStatic({ ...formErrorsStatic, 'account_type_id': null });
                clearFormValuesOnAccountOptChange();
            }
        });
    }

    /**
     * Called when user focuses out of the account identifier text field in Partner Create Case.
     * @param {string} value - Input value.
     */
    const onBlurEvent = (value) => {
        let isDescAttachModal = false;
        const inputValue = value;
        getAll().then(res => {
            if((res?.length || descriptionRef?.current?.value) && (accountname?.label !== 'Select One' || accountNameforText) && (accountIdentifierDisplayId?.inputValueOnBlur !== inputValue)) {
                isDescAttachModal = true;
                setDescAttachModal(true);
                setCurrentSelectedText({ type: 'account_type_id', value: inputValue });
                setCurrentSelectedDropdown({ type: 'account_type_id', value: inputValue, label: 'account_type_id_text_field' });
            }
            let updatedFormError = { 'account_name': null, 'Product_Name__c': null, 'Product_Issue_Type__c': null, 'Product_Issue_Subtype__c': null, 'Platform__c': false};
            if (accountIdentifierDisplayId?.inputValueOnBlur !== inputValue && inputValue && !isDescAttachModal) {
                setAccountIdentifierDisplayId({ ...accountIdentifierDisplayId, inputValueOnBlur: inputValue});
                if (userInfoProps?.userCallSuccessful && isPartnerNewCase === 'true') {
                    //TODO - we should be calling this API only when the validation for accountID field is true, we are calling on blur events
                    // Call API to get user contact info.
                    const userAssetAndContactInfoData = GetUserAssetAndContactInfo(accountidentifierSearchOpt, inputValue);
                    userAssetAndContactInfoData?.then(result => {
                        if (result?.compositeResponse[0]?.body?.records?.length > 0) {
                            setFormErrors({ ...updatedFormError, 'account_type_id': false });
                            setFormErrorsStatic({ ...updatedFormError, 'account_type_id': false });
                            clearFormValuesOnAccountOptChange();
                            fetchAccountDetails(result);
                        } else {
                            clearFormValuesOnAccountOptChange();
                            setFormErrors({ ...updatedFormError, 'account_type_id': { "flag": true, "errorMessage": 'Please enter a valid account identifier' }});
                            setFormErrorsStatic({ ...updatedFormError, 'account_type_id': { "flag": true, "errorMessage": 'Please enter a valid account identifier' }});
                        }
                    });
                }
            } else if (!inputValue && !isDescAttachModal) {
                clearFormValuesOnAccountOptChange();
                setFormErrors({ ...updatedFormError, 'account_type_id': { "flag": true, "errorMessage": 'You must enter value for the field' }});
                setFormErrorsStatic({ ...updatedFormError, 'account_type_id': { "flag": true, "errorMessage": 'You must enter value for the field' }});
            }
        });
    }

    // Triggering AA on Start time Partner Account Identifier
    const handleAccountIdentifierInputChange = (event) => {
        const { value } = event.target;
        setAccountIdentifierDisplayId({
          ...accountIdentifierDisplayId,
          inputValueOnChange: value,
        });
      };

    /**
     * Displays text fields in DOm
     * @param {string} fieldType - Text field type.
     * @returns Text fields DOM elements.
     */
    const displayTextField = (fieldType) => {
        let inputValue = '';
        inputValue = fieldType === 'your_name' ? userData?.given_name?.concat(" ", userData?.family_name) :
        inputValue = fieldType === 'email_address' ? userData?.email :
        inputValue = fieldType === 'phone_number' ? phone :
        inputValue = fieldType === 'account_id' ? accountId :
        inputValue = fieldType === 'account_name' ? accountNameforText :
		inputValue = fieldType === 'account_type_id' ? accountIdentiferforText : inputValue = '';
        // If fieldtype is name, email, phone number, account id, account name then keep the field disabled.
        if ((fieldType === 'your_name') || (fieldType === 'email_address') || (fieldType === 'phone_number') || (fieldType === 'account_id') || (fieldType === 'account_name') || (fieldType === 'account_type_id' && isPartnerNewCase === null)) {
            return (
                <input className="form__inputBox" value={inputValue} disabled />
            )
        }  /* For Account Identifier field in New Partner Case. */ else if (fieldType === 'account_type_id' && isPartnerNewCase === 'true') {
            return (
                <>
                    <input onChange={handleAccountIdentifierInputChange} className={`accountTypeIdentifier__textField ${formErrors[fieldType]?.flag ? "error-border form__inputBox" : "form__inputBox"}`} value={accountIdentifierDisplayId.inputValueOnChange} onBlur={(e) => onBlurEvent(e?.target?.value)} />
                    {formErrors[fieldType]?.flag &&
                        <p className="error-message">{formErrors[fieldType]?.errorMessage ? formErrors[fieldType]?.errorMessage : 'You must enter value for the field'}</p>
                    }
                </>
            )
        } /* For other text fields. */ else {
            return (
                <>
                    <input className={formErrors[fieldType] ? "error-border form__inputBox" : "form__inputBox"} onChange={(e) => validateFields('text', e.target.value, fieldType)} />
                    {formErrors[fieldType] &&
                        <p className="error-message">You must enter value for the field</p>
                    }
                </>
            )
        }
    }

    /**
     * Called when user clicks on OK button of combined file size error modal.
     */
    const Morethan10MBHandler = () => {
        // Closes the combined file size error modal.
        setCombinedFileSizeErrorModal(false);
		const modalAnalytics = {title:data?.moreThan10MBErrorTitle, description:data?.moreThan10MBErrorDesc};
        // Calls modal analytics.
		ModalAnalyticsCall(modalAnalytics, false);
        setDisableBtn(false);
    }


    let attachmentData = [];

    const calculateDuration = (startTime, endTime) => {
      // Calculate the time difference in milliseconds
      const timeDiff = endTime - startTime;

      // Convert milliseconds to seconds
      const totalSeconds = Math.floor(timeDiff / 1000);

      return totalSeconds;
    };

    /**
     * Called when user clicks on Submit Case button. Calls the create case API and posts the form data.
     */
    const submitButtonHandler = () => {
              getAll().then(res => {
             editingValueRep?.map((data) => {
                res?.map((item) => {
                    // If editingValueRep file name is equal to res file name and if descrition is already present for the file.
                    if ((data?.File?.file?.name === item?.File?.file?.name) && (data?.description)) {
                        // Copy the description from editingValueRep to res for the file.
                        item.description = data.description;
                    }
                });
            });
            const maxFileSize = Constants.MAX_FILE_SIZE;
            let fileSize = res?.map((item) => item?.File.file?.size);
            let fileMaxSize = fileSize?.reduce(function (a, b) {
                return a + b;
            }, 0);

            // If combined files size is greater then the allowed limit then open combined file size error modal.
            if (fileMaxSize > maxFileSize) {
				res?.length > 0 && fireDLEventForAttachments(res, 'Error Uploading Attachments', "Files combined size is more than 25MB");
                setCombinedFileSizeErrorModal(true);
            } else {
                // Disables Create Case button.
                setDisableBtn(true);
                if (isCreateCaseComp) {
                    // Loading indicator is dispatched and displayed on screen for create case component.
                    dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: true }));
                } else {
                    // Loading indicator is dispatched and displayed on chat window screen for create case component in chat.
                    setIsLoading(true);
                }
                // AA case endTimer
                if(caseCreationStartTime)
                {
                    let endTime = new Date().getTime();
                    dataLayerCaseCreationTimer(calculateDuration(caseCreationStartTime, endTime))
                }
                attachmentData = res;
                let assetId;
                const accountName = accountNameforText ? accountNameforText : accountname.label;
				if (isPartnerNewCase === 'true') {
                    let id;
                    if (accountidentifierSearchOpt?.label === 'Tax ID') {
                        id = 'ProviderId';
                    } else {
                        id = 'RpaId';
                    }
                    let assetItem = false;
                    if(platformAssigned && platform?.label === 'N/A')assetId = platform?.value
                    else{
                        userAsset?.userAssetInfo?.forEach((propItem) => {
                            if (propItem.Account_Name__c === accountname?.label && propItem?.Product_Name__c === product?.label
                                    && propItem?.[id] == accountIdentifierDisplayId?.inputValueOnBlur && !assetItem && (platformAssigned ? propItem?.Platform__c ===  platform.label :true)) {
                                        assetId = propItem?.AssetId;
                                        assetItem = true;
                            }
                        });
                    }
                } else {
                    if(partnerName.label === 'N/A') assetId = partnerNameId
                    else if(platformAssigned && platform?.label === 'N/A') assetId = platform?.value
                    else {
                        userAsset?.userAssetInfo.forEach((item) => {
                            if (item?.Account_Name__c === accountName && item?.Product_Name__c === product.label && item?.AccountId === accountIdentifierId && 
                                (platformAssigned ? item?.Platform__c ===  platform?.label :true) && (partnerName.label !== 'Select One' && partnerName.label !== 'N/A'? item?.PartnerName === partnerName.label: true)) {
                                    assetId = item?.AssetId;
                            }
                        });
                    }
				}
                // Create case data object to be sent to the API. Gets the data from the respective field states.
                const opencaseData = {
                    accountname: accountName,
                    casesubtype: casesubtype.label,
                    casetype: casetype.label,
                    customer_ref_no: customer_ref_no,
                    description: description,
                    product: product.label,
                    productCaseType:productCaseType
                }

                // Gets the dynamic data.
                let filtered = dynamicFieldData.map(({label, value}) => ({label, value}));
                // Check If Multifields get MultiFields Data
                let multifieldData = [];
                if(showMultiFields){
                    mutliFieldsData?.forEach((row, index) => {
                        const paddedIndex = String(index + 1).padStart(2, '0');
                        let key1 = row.field1label.split(" ");
                        let key2 = row.field2label.split(" ");
                        let key3 = row.field3label.split(" ");
                        multifieldData.push(
                            { Name: `${key1?.[0]} ${paddedIndex} ${key1?.[1]}`, Value: row.field1 },
                            { Name: `${key2?.[0]} ${paddedIndex} ${key2?.[1]}`, Value: row.field2 },
                            { Name: `${key3?.[0]} ${paddedIndex} ${key3?.[1]}`, Value: row.field3 }
                        );
                    });
                }

                /**
                 * Create case service for calling create case API.
                 * @param {Object} opencaseData - Create case static fields data object.
                 * @param {Object} filtered - Create case dynamic fields data object.
                 * @param {string} accountIdentifierId - Account identifier ID.
                 * @param {string} assetId - User asset ID.
                 * @param {string} userAsset?.contactId - User contact ID.
                 * @param {Object} attachmentData - Attached files data.
                 * @param {Function} setModalState - Modal state callback function.
                 * @param {Function} dispatch - Redux store dispatch function.
                 * @param {Array} multifieldData - Check amount, date, fields data.
                 * @param {Array} payloadContactsList - Contact list selected by user on create case form.
                 * @param {Object} setErrorModalMessage - State for updating the error modal title and description.
                 * @param {Boolean} isCreateCaseComp - Checks if the component is called through Create Case page or chat window.
                 * @param {Function} handleSubmitForm - Called on success response of case created through chat window.
                 * @param {Function} handleCaseError - Called on error response of case created through chat window.
                 */
                CreateCase(opencaseData, filtered, accountIdentifierId, assetId, userAsset?.contactId, attachmentData, setModalState, dispatch,
                    multifieldData, payloadContactsList, setErrorModalMessage, isCreateCaseComp, handleSubmitForm, handleCaseError, false, '');
            }
        });
    }

    /**
     *  Redirect User to Dashboard Page Based on User Role
     */
     const redirectUser = () => {
        if(userInfoProps?.userdata?.roles?.includes('Account_Case_Manager') && modalState?.caseId && isPartnerNewCase !== 'true') {
            handleRedirect({Id:modalState?.caseId}, data?.casesLandingPath, false, true);
        } else if(modalState?.caseId && isPartnerNewCase === 'true' && userInfoProps?.userdata?.roles?.includes('Partner_Case_Manager')){
            handleRedirect({Id:modalState?.caseId}, data?.casesLandingPath, true, false);
        } else if(modalState?.caseId){
            handleRedirect({Id:modalState?.caseId}, data?.casesLandingPath, false, false);
        }
    }

    /**
     * Called when user clicks on Cancel on Acknowledgement modal.
     */
    const cancelOpenCaseModal = () => {
        let analyticsData = {};
        dynamicFieldData.map(({label, value}) => {
            analyticsData = {...analyticsData, [label] :value}
        });
        const caseData = {
            Priority:'Standard',
            product:product.label,
            casetype:casetype.label,
            casesubtype:casesubtype?.label,
            'payer id':analyticsData?.['Payer ID'],
            'claim amount':analyticsData?.['Claim Amount'],
            'change healthcare claim id':analyticsData?.['Change Healthcare Claim ID (CORN Ref d9)'],
            'description':description,
        }
        // Fires cancel create case analytics with create case form info.
        dataLayerCaseEvent("Case: Cancel Create Case", caseData);

        // Fires modal analytics.
        const modalAnalytics = { id:data?.id,  title:data?.confirmCloseCaseTitle, type:'', description:data?.confirmCloseCaseDesc ? data?.confirmCloseCaseDesc : data?.confirmCloseCaseTitle};
        ModalAnalyticsCall(modalAnalytics, false);

        // Sets all modal states to false.
        setModalState({
            confirmationModal: false,
            successModal: false,
            errorModal: false,
        });
        // Clears indexed DB with any attached files.
        clear().then(() => {
            });

        // If cases landing page is authored then redirects to the authored page URL or else reloads current page.
        redirectUser();
    }

    /**
     * Called when user clicks on OK button on Success modal after case is successfuly created.
     */
    const confirmOpenCaseModal = () => {
        // Sets all modal states to false.
        setModalState({
            confirmationModal: false,
            successModal: false,
            errorModal: false,
        });

        // Clears indexed DB with any attached files.
        clear().then(() => {
            });

        // Fires create case success analytics call.
        const successModalAnalytics = { id:data?.id,  title:data?.acknowledgeCloseCaseTitle, type:'Create Case Success', description:data?.acknowledgeCloseCaseDesc ? data?.acknowledgeCloseCaseDesc : data?.acknowledgeCloseCaseTitle};
        ModalAnalyticsCall(successModalAnalytics, false);

        // If cases landing page is authored then redirects to the authored page URL or else reloads current page.
        redirectUser();
    }

    /**
     * Called when user clicks on OK on Error modal if create case fails.
     */
    const confirmOpenCaseErrorModal = () => {
        // Sets all modal states to false.
        setModalState({
            confirmationModal: false,
            successModal: false,
            errorModal: false,
        });
        setDisableBtn(false);

        // Fires create case error analytics call.
        const errorModalAnalytics = { id:data?.id,  title:'Something went Wrong', type:'Sorry, an unexpected error occurred while submitting your case. Please try again later', description:'Create Case Failure'};
        ModalAnalyticsCall(errorModalAnalytics, false);

        // If cases landing page is authored then redirects to the authored page URL or else reloads current page.
        redirectUser();
    }

    /**
     * Called when user clicks on OK button on description and attachments clear data modal.
     */
    const descAttachModalHandler = () => {
        // Destructure currentSelectedDropdown state object values.
        const { type, label, value } = currentSelectedDropdown;
        let dropdownErrorState;
        if (type === 'account_name') {
            dropdownErrorState = {
                'Product_Issue_Type__c': null,
                'Product_Issue_Subtype__c': null,
                'Product_Name__c': null
            }
        } else if (type === 'Product_Name__c') {
            dropdownErrorState = {
                'Product_Issue_Type__c': null,
                'Product_Issue_Subtype__c': null
            }
        } else if (type === 'Product_Issue_Type__c') {
            dropdownErrorState = {
                'Product_Issue_Subtype__c': null
            }
        } else if (type === 'account_type_id') {
            data?.formLabelList.map((element) => {
                if (element.type === 'account_name') {
                    element.fieldType = "dropdown";
                }
            });
            dropdownErrorState = {
                'account_name': null,
                'Product_Issue_Type__c': null,
                'Product_Issue_Subtype__c': null,
                'Product_Name__c': null
            }
        }
        setFormErrors({
            ...formErrors, ...dropdownErrorState, 'Description': null
        });
        setFormErrorsStatic({
            ...formErrorsStatic, ...dropdownErrorState,'Description': null
        });
        // Clears description text area value.
        setDescription('');
        descriptionRef.current.value = '';
        if (isPartnerNewCase === 'true' && (currentSelectedDropdown?.type === 'account_type_id')) {
            if (label === 'account_type_id_text_field') {
                onBlurEvent(currentSelectedText?.value);
            } else {
                onBlurEvent('');
            }
            let accIdentifierOptionCallback = false;
            accountIdentifierForNewPartnerCase?.map((item) => {
                if (item?.label === label && item?.value === value) {
                    accIdentifierOptionCallback = true;
                }
            });
            setAccountIdentifierDisplayId({...accountIdentifierDisplayId, inputValueOnBlur: accountIdentifierDisplayId?.inputValueOnChange});
            if (accIdentifierOptionCallback) {
                changeAccIdentifierOpt(label, value);
            } else if (label !== 'account_type_id_text_field') {
                onChangeDropdown(type, label, value);
            }
        } else {
            // Calls dropdown function with the recently selected dropdown values fetched from currentSelectedDropdown state.
            onChangeDropdown(type, label, value);
        }

        // Clears all attachments.
        setClearAllAttachment(true);
        // Closes the modal.
        setDescAttachModal(false);
        // Fires modal analytics event.
		const modalAnalytics = {title:data?.clearFormModalTitle ? data?.clearFormModalTitle : Constants.CLEAR_FORM_MODAL_TITLE, description:data?.clearFormModalDesc ? data?.clearFormModalDesc : Constants.CLEAR_FORM_MODAL_DESC};
		ModalAnalyticsCall(modalAnalytics, false);
    }

    /**
     * Called when user clicks cancel on description and attachments clear data modal.
     */
    const descAttachModalCloseHandler = () => {
        let SelectedfieldType = currentSelectedDropdown.type;
        setCurrentSelectedDropdown({...currentSelectedDropdown, value: SelectedfieldType?.current?.props?.value?.label, label: SelectedfieldType?.current?.props?.value?.label })
        setClearAllAttachment('');
        setDescAttachModal(false);
        if (isPartnerNewCase === 'true') {
            setAccountIdentifierDisplayId({ ...accountIdentifierDisplayId, inputValueOnChange: accountIdentifierDisplayId.inputValueOnBlur});
        }
    }

    const handleHelpPageClick = (linkInfo) =>{
        const fieldInfo = {
            product: productCaseType,
            Type: casetype.label,
            SubType: casesubtype.label
        };
    
        const helpCard = {
            fieldInfo: fieldInfo,
            linkInfo: linkInfo
        };
        setIsHelpDocumentOpened(true);
        dataLayerHelpDocumentation("Platform help : Platform link Click", helpCard);
    }

    const handleHelpPopupClick = (linkInfo) =>{
        const fieldInfo = {
            product: productCaseType
        };
    
        const helpCard = {
            fieldInfo: fieldInfo,
            linkInfo: linkInfo
        };
        setIsPlatformHelpDocumentOpened(true);
        dataLayerHelpDocumentation("Platform help: Platform Link Click", helpCard);
    }

    const handleHelpPopupCloseHandler = () =>{
        const fieldInfo = {
            product: productCaseType,
        };
    
        const helpCard = {
            fieldInfo: fieldInfo,
            isLinkOpened :  isHelpPlatformDocumentOpened
        };
        setShowContent(false);
        dataLayerHelpDocumentation("Platform help: Platform help Close", helpCard);
        setIsPlatformHelpDocumentOpened(false);
    }

    const handleHelpPageCloseHandler = () =>{

        const fieldInfo = {
            product: productCaseType,
            Type: casetype.label,
            SubType: casesubtype.label
        };
    
        const helpCard = {
            fieldInfo: fieldInfo,
            isLinkOpened :  isHelpDocumentOpened
        };

        dataLayerHelpDocumentation("Help : Help Close", helpCard);
        setLearningPageLinks({...learningPageLinks, showLearningPageLinks: false})
        setIsHelpDocumentOpened(false);
    }

    // Helpful Platform data

    const [showContent, setShowContent] = useState(true);
    useEffect(() => {
        const readTextValues = () => {
            const notificationClasses = ['helpfultip_heading', 'helpfultip_title', 'helpfultip_description'];

            const newValues = {};

            notificationClasses.forEach((className, index) => {
                const element = document.querySelector(`.${className}`);
                if (element) {
                    if (element.tagName.toLowerCase() === 'a') { 
                        newValues[`helpfultip_text${index + 1}`] = {
                            text: element.textContent,
                            href: element.getAttribute('href')
                        }

                    } else {
                        newValues[`helpfultip_text${index + 1}`] = element.textContent;
                    }
                }
            });
            setTextValues(newValues);
        };
        readTextValues();
    }, []);

    const isEmptyObject = (obj) => {
        return Object.keys(obj).length === 0;
    };

    return (
        <>
            <div className={`openCaseForm__notification${!isCreateCaseComp ? ' preChat__notification' : ''}`} dangerouslySetInnerHTML={{__html: data?.openCaseDescription}} />
            <div className={`openCaseForm__body${!isCreateCaseComp ? ' preChat__body' : ''}`}>
                {data?.formTitle && <div className="openCaseForm__bodyTitle">{data?.formTitle}</div>}
                <div className="form__element form">
                    <ul className="form__fieldset">
                        {data?.formLabelList?.map((field, index) =>
                            field.fieldType === 'dropdown' && field.type !== 'secondary_contact' &&
                            (field.type === 'Platform__c' ? platformList.length > 1 : true)?
                            (
                                <>  
                                {/* //TODO - partner name list should be hidden using js like platform not css */}
                                    <li key={index} className={`form__field ${field.type === 'partners_account_name' ? (partnerNameList?.length <= 1 ? 'nodisplay' : '') : ''}` }>
                                        <span className="form__label">
                                              {`${field.fieldLabel}${formErrorsStatic?.hasOwnProperty(field.type) ? '*' : ''}`}
                                        </span>
                                            {field.type === 'Platform__c' && (
                                                <>
                                                    {platformList.length > 1 && !isEmptyObject(textValues) && <HelpfulPopup textValues={textValues} showContent={showContent} onPageClick = {handleHelpPopupClick} onHelpPageClose={handleHelpPopupCloseHandler} />}
                                                </>
                                            )}
                                        <Select
                                            className={formErrors[field.type] ? "basic-single error-border" : "basic-single"}
                                            placeholder="Select One"
                                            ref={field.type === 'Product_Issue_Subtype__c' ? Product_Issue_Subtype__c :
                                                field.type === 'Platform__c' ? platform :
                                                field.type === 'Product_Name__c' ? Product_Name__c :
                                                field.type === 'account_type_id' ? account_type_id :
                                                field.type === 'partners_account_name' ? partner_type_name :
                                                field.type === 'Product_Issue_Type__c' ? Product_Issue_Type__c :
                                                field.type === 'account_name' && account_name
                                            }
                                            classNamePrefix="select"
                                            label={field.fieldLabel}
                                            id={field.type}
                                            menuShouldScrollIntoView={true}
                                            value={field.type === 'Product_Issue_Subtype__c' ? casesubtype :
                                                field.type === 'Product_Name__c' ? product :
                                                field.type === 'Platform__c' ? platform :
                                                field.type === 'Product_Issue_Type__c' ? casetype :
                                                 field.type === 'account_type_id' ? accountIdentifier :
                                                field.type === 'partners_account_name' ? partnerName :
                                                field.type === 'account_name' ? accountname : ''}
                                            onChange={(e) => {onChangeDropdown(field.type, e?.label, e?.value)}}
                                            options={field.type === 'Product_Issue_Subtype__c' ?  productSubTypeList :
                                                field.type === 'Product_Name__c' ? productNameList :
                                                field.type === 'Platform__c' ? platformList :
                                                field.type === 'Product_Issue_Type__c' ? productTypeList :
                                                field.type === 'account_type_id' ? accountIdentifierList :
                                                field.type === 'partners_account_name' ? partnerNameList :
                                            field.type === 'account_name' ? accountNameList : ''
                                            }
                                        />
                                        {formErrors[field.type] &&
                                            <p 
                                            className="error-message">You must enter value for the field</p>
                                        }
                                    </li>
                                    </>

                              
                            )
                            : field.fieldType === 'text' && field.type !== 'secondary_contact' && field.type !== 'External_Reference__c' ?
                            (
                                <li key={index} className="form__field">

                                    <span className={formErrors[field.type] ? "error-message" : "form__label"}>
                                        {`${field.fieldLabel}${formErrorsStatic?.hasOwnProperty(field.type) ? '*' : ''}`}
                                    </span>
                                    <div className={`${isPartnerNewCase === 'true' && field.type === 'account_type_id' && 'form__field--wrapper'}`}>
                                        {isPartnerNewCase === 'true' && field.type === 'account_type_id' &&
                                            <Select
                                                className={`${formErrors[field.type] ? "basic-single error-border" : "basic-single"}
                                                            ${isPartnerNewCase === 'true' && field.type === 'account_type_id' && "account-id--opt"}`}
                                                classNamePrefix="select"
                                                label={field.fieldLabel}
                                                defaultValue={accountIdentifierForNewPartnerCase[0]}
                                                id={`${field.type}-opt`}
                                                menuShouldScrollIntoView={true}
                                                value={accountidentifierSearchOpt}
                                                onChange={(e) => changeAccIdentifierOpt(e?.label, e?.value)}
                                                options={accountIdentifierForNewPartnerCase}
                                            />
                                        }
                                        <div className="form__data--input">
                                            {displayTextField(field.type)}
                                        </div>
                                    </div>
                                </li>
                            )
                            : ''
                        )}

                        {dynamicFieldList &&
                            <DynamicFieldComp
                                FieldsData={dynamicFieldList}
                                formErrors={formErrors}
                                setDynamicFieldData={setDynamicFieldData}
                                dynamicFieldData={dynamicFieldData}
								setFormErrors={setFormErrors}
                                showMultiFields={showMultiFields}
                                setMultiFieldsData={setMultiFieldsData}
                                multiFieldsList={multiFieldsList}
                                PrepopulateData={prepopulateData}
                            />
                        }
                        {data?.formLabelList?.find(({ type }) => type === 'Description') &&

                            <li className="form__field fullWidth">
                                <span className={formErrors['Description'] ? "error-message" : "form__label"}>
                                    {data?.formLabelList?.find(({ type }) => type === 'Description')?.fieldLabel}*
                                </span>
                                <div className="form__data--textArea">
                                    <TextAreaFieldCounter
                                        totalCharacters={data?.formLabelList?.find(({ type }) => type === 'Description')?.maxLength || 30000 }
                                        charactersEntered={description?.length}
                                        value={description}
                                        handleChange={handleDescriptionChange}
                                        maxLength={data?.formLabelList?.find(({ type }) => type === 'Description')?.maxLength || 30000 }
                                        classList={formErrors['Description'] ? "error-border" : ""}
                                        isTextArea={true}
                                        isAutoFocus={false}
                                        placeholder="Type your description here"
                                        ref={descriptionRef}
                                    />
                                    {formErrors['Description'] &&
                                        <p className="error-message float-left">You must enter value for the field</p>
                                    }
                                </div>
                            </li>
                        }
                       
                    </ul>
                </div>
                {isCreateCaseComp &&
                    <DropzoneComp
                        dropAreaTitle={data?.dropAreaTitle}
                        dropAreaMessage={data?.dropAreaMessage}
                        errorMessage={data?.errorMessage}
                        errorMessageZeroKb={data?.errorMessageZeroKb}
                        supportedFilesMessage={data?.supportedFilesMessage}
                        uploadButtonLabel={data?.uploadButtonLabel}
                        enableUploadButton={data?.enableUploadButton}
                        attachmentModalAction={data?.attachmentAction}
                        attachmentSuccessTitle={data?.attachmentSuccessTitle}
                        attachmentSuccessDescription={data?.attachmentSuccessDescription}
                        tableColumnHeading={data?.attachmentTabList}
                        gridColumns={gridColumns}
                        clearAllRecord={clearAllAttachment}
                        setClearAllRecord={setClearAllAttachment}
                        setEditingValueRep={setEditingValueRep}
                    />
                }
                {isCreateCaseComp &&
                    <div className="form__element form secondaryContactContainer">
                        <ul className="form__fieldset">
                            {data?.formLabelList?.filter(field => field.type === 'secondary_contact').map((field, index) =>
                            (
                                <li key={index} className="form__field secondaryContactList fullWidth">
                                    <CaseSecondaryContact
                                        setContactsList={setContactsList}
                                        contactsList={contactsList}
                                        isCreateCase={true}
                                        label={data?.formLabelList?.find(({ type }) => type === 'secondary_contact')?.fieldLabel}
                                        setPayloadContactsList={setPayloadContactsList}
                                        accountIdentifierId={accountIdentifierId}
                                    />
                                </li>

                            ))}
                            {data?.formLabelList?.filter(field => field.type === 'External_Reference__c').map((field, index) =>
                            (
                                <li key={index} className="form__field">
                                    <span className={formErrors[field.type] ? "error-message" : "form__label"}>
                                        {`${field.fieldLabel}${formErrorsStatic?.hasOwnProperty(field.type) ? '*' : ''}`}
                                        <i data-tip data-for="external_reference" className="iconCircleInfo">
                                        </i>
                                    </span>
                                    <ReactTooltip id="external_reference" place='top'>
                                        {maxCharactersLength - customer_ref_no.length}  Characters Remaining
                                    </ReactTooltip>
                                    <>
                                        <input className="form__inputBox" value={customer_ref_no} onChange={(e) => externalRefValidation(e.target.value)} />
                                        <TextAreaFieldCounter
                                            totalCharacters={maxCharactersLength}
                                            charactersEntered={customer_ref_no.length}
                                            maxLength={maxCharactersLength}
                                            showCharactersCount={false}
                                            isTextArea={false}
                                        />
                                    </>
                                </li>
                            ))}
                        </ul>
                    </div>
                }
            </div>
            <div className={`openCaseForm__footer${!isCreateCaseComp ? ' preChat__footer' : ''}`}>
                {!isCreateCaseComp ? (
                    <button className="btn-primary" type="button" disabled={disableCreateCaseBtnOnAwsHours ? true : disableBtn} onClick={() => submitButtonHandler()}>Start Chat</button>
                ) : (
                    <button className="btn-primary" type="button" disabled={disableBtn} onClick={() => submitButtonHandler()}>{data?.submitBtnLabel}</button>
                )}
                <button className="btn-secondary" type="button"
               onClick={isCreateCaseComp ? () => setModalState({ ...modalState, confirmationModal: true }) :
               () =>{toggleChat()}}>{data?.cancelBtnLabel}</button>
            </div>
            {modalState.confirmationModal &&
                <NextgenSimpleModal
                    title={data?.confirmCloseCaseTitle}
                    OnCloseModalCall={() => setModalState({...modalState, confirmationModal: false})}
                    hideCloseIcon={false}
                    isChild={false}
                    text={data?.confirmCloseCaseDesc}
                    buttonText={data?.confirmCloseCaseButtonLabel}
                    cancelBtnText={data?.confirmCancelButtonLabel}
                    isOpen={modalState?.confirmationModal}
                    setIsOpen={setModalState.confirmationModal}
                    HandleButtonClick={() => cancelOpenCaseModal()}
                />
            }
            {modalState.successModal &&
                <NextgenSimpleModal
                    title={data?.acknowledgeCloseCaseTitle}
                    hideCloseIcon={true}
                    isChild={false}
                    text={data?.acknowledgeCloseCaseDesc}
                    buttonText={data?.acknowledgeCcButtonLabel}
                    isOpen={modalState?.successModal}
                    setIsOpen={setModalState.successModal}
                    HandleButtonClick={() => confirmOpenCaseModal()}
                />
            }
            {modalState.errorModal &&
                <NextgenSimpleModal
                    title={errorModalMessage?.errorModalTitle}
                    hideCloseIcon={true}
                    isChild={false}
                    text={errorModalMessage?.errorModalDescription}
                    buttonText={data?.acknowledgeCcButtonLabel}
                    isOpen={modalState?.errorModal}
                    setIsOpen={setModalState.errorModal}
                    HandleButtonClick={() => errorModalMessage?.attachmentCallFailed ? confirmOpenCaseModal() : confirmOpenCaseErrorModal()}
                />
            }
            {combinedFileSizeErrorModal &&
                <NextgenSimpleModal
                    title={data?.moreThan10MBErrorTitle ? data?.moreThan10MBErrorTitle : "Your attachments combined size is more than 25MB"}
                    text={data?.moreThan10MBErrorDesc ? data?.moreThan10MBErrorDesc : "Please delete a few attachments to make the combined file size lower than 25MB"}
                    isOpen={true}
                    OnCloseModalCall={() => setCombinedFileSizeErrorModal(false)}
                    setIsOpen={setCombinedFileSizeErrorModal}
                    hideCloseIcon={true}
                    HandleButtonClick= {() => Morethan10MBHandler()}
                    buttonText="Ok"
                />
            }
            {/* //TODO - the descAttachModal should be given to isOpenattribute and not used as && operator. Check if that is leading to 'false' string in UI. Then we need to return empty div or not return */}
            {descAttachModal &&
                <NextgenSimpleModal
                    title={data?.clearFormModalTitle ? data?.clearFormModalTitle : Constants.CLEAR_FORM_MODAL_TITLE}
                    text={data?.clearFormModalDesc ? data?.clearFormModalDesc : Constants.CLEAR_FORM_MODAL_DESC}
                    isOpen={true}
                    OnCloseModalCall={() => descAttachModalCloseHandler()}
                    hideCloseIcon={false}
                    HandleButtonClick= {() => descAttachModalHandler()}
                    buttonText={data?.clearFormYesButtonLabel ? data?.clearFormYesButtonLabel : "Confirm"}
                    cancelBtnText={data?.clearFormNoButtonLabel ? data?.clearFormNoButtonLabel : "Cancel"}
                />
            }
            {learningPageLinks?.showLearningPageLinks &&
                <LearningPagesList setLearningPageLinks={setLearningPageLinks} onPageClick = {handleHelpPageClick} onHelpPageClose={handleHelpPageCloseHandler} learningPageLinks={learningPageLinks} />
            }
        </>
    )
}

export default OpenCaseFormBody;
