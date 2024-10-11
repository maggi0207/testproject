import { useState, useEffect, useRef } from "react";
import { MapTo } from '@adobe/aem-react-editable-components';
import { isValidDomain, sentinelcall_for_refresh_token} from "../../../utils/loginFlow";
import { AuthoringUtils } from '@adobe/aem-spa-page-model-manager';
import { logout, deleteCookies, deleteTokens } from '../../../utils/logoutFlow';
import { isUnsecurePage } from "../../../utils/unsecurePage";
import { ModalAnalyticsCall, dataLayerSessionActiveTimer, dataLayerUserLogoutActiveTimer } from '../../../utils/analyticsUtils';
import NextgenSimpleModal from './Modal/NextgenSimpleModal';
import Countdown, { zeroPad } from "react-countdown";
import jwt_decode from "jwt-decode";
import { getCookie } from "../../../utils/getCookies";
import * as constants from "../../../utils/constants";
import { setLocalStorage } from '../../../utils/genericUtil';

export const SessionTimeoutConfig = {
	emptyLabel: "Session Timeout",

	isEmpty: function(props) {
		return true;
	}
};

export const SessionTimeout = (props) => {
	const TOKEN_EXPIRY_MINUS_FIVE = 300000;
	const SET_TEN_SEC_TIMER = 10000;
	let logoutPath;

	props?.buttonGroup?.map((item) => {
		let trimmedLinkLabel = item.linkLabel?.toLowerCase()?.trim();
		if (trimmedLinkLabel === "sign out" || trimmedLinkLabel === "logout") {
			logoutPath = item.linkPath;
		}
	});

	const isEdit = AuthoringUtils.isEditMode();
	const [isOpen, setIsOpen] = useState(false);
	const [startTime, setStartTime] = useState(0);
	const token = getCookie(constants.ACCESS_TOKEN);
	// Check if refresh_token available, so we can process with sentinel else proceed with exisitng ciam logic
	const refresh_token = getCookie(constants.REFRESH_TOKEN);


	useEffect(() => {
        // Checks if user is not in Edit mode and the URL hostname includes CHC and page is not unsecure.
		if (!isEdit && isValidDomain() && !isUnsecurePage()) {
			const sessionTimer = setInterval(() => {
				let expired, remainingTime, activeSessionTime;
                // Fetches cookie from access token.
				let token_value = getCookie(constants.ACCESS_TOKEN);
				// Fetch refresh token
				let refresh_token_value = getCookie(constants.REFRESH_TOKEN);
                // Checks if cookie is present.
				if (token_value.length > 0) {
					let decoded;
					if(!refresh_token){
						// Decodes the fetched token value.
						decoded = jwt_decode(token_value);
					}else{
						// Decodes refresh token
						decoded = jwt_decode(refresh_token_value);
						const currentTime = Math.floor(Date.now() / 1000);
						const expTime = jwt_decode(refresh_token_value).exp;
						const remainingTimeinSecs = expTime - currentTime;
						const remainingTimeinMins = Math.max(0, Math.floor(remainingTimeinSecs / 60));
						const activeTime = 30 - remainingTimeinMins;
						
						remainingTime = remainingTimeinMins;
						activeSessionTime = activeTime;
					}
                    // Checks if the expiration time of decode value is not null.
					if (decoded.exp !== null) {
                        // Subtracts current time from expiration time of decoded value * 1000.
						expired = (decoded.exp * 1000 - Date.now())
						const date = new Date(expired);
                        // Calculates session time left value.
						window.sessionTimeLeft = `${date.getMinutes()}:${date.getSeconds()}`;
					}
                    // Checks if the expired value is less than the token expiry value.
					if (expired < TOKEN_EXPIRY_MINUS_FIVE) {
                        // Sets setStartTime state value to expired value.
						setStartTime(expired);
                        // Displays the session timeout modal.
						setIsOpen(true);

						if(refresh_token){
							dataLayerSessionActiveTimer(activeSessionTime);
						}
						
						clearInterval(sessionTimer);
						const dataLayerEvents = window.digitalData.events;
						const hasDisplayed = dataLayerEvents.some(event => event?.modal?.id === 'session-timeout');
						!hasDisplayed && ModalAnalyticsCall(props, true);
					}
				}
			}, SET_TEN_SEC_TIMER);
		}
	}, []);

	useEffect(() => {
        // Checks if user is not in Edit mode and the URL hostname includes CHC and page is not unsecure.
		// Existing CIAM logic
		if (!isEdit && isValidDomain() && !isUnsecurePage()) {
			setInterval(() => {
                // Gets new token.
				let new_token = getCookie(constants.ACCESS_TOKEN);
                // Checks if new token is not null and not equal to old token. If not then reloads the page.
				if (new_token !== null & new_token !== token) {
					window.location.reload();
				}
			}, SET_TEN_SEC_TIMER);
		}
		// Sentinel Validation logic
		if (refresh_token && !isEdit && isValidDomain() && !isUnsecurePage()) {
			setInterval(() => {
                // Gets new token.
				let new_refresh_token = getCookie(constants.REFRESH_TOKEN);
                // Checks if new token is not null and not equal to old token. If not then reloads the page.
				if (new_refresh_token !== null & new_refresh_token !== refresh_token) {
					// window.location.reload();
					console.log("Tokens Updated")
				}
			}, SET_TEN_SEC_TIMER);
		}
	}, []); 

    /**
     * Checks if user has clicked on logout  or stay signed in. Executes code depending on the button clicked.
     * @param {Object} item - Modal button.
     */
	const buttonClick = (item) => {
        // Trims the button label and removes white space.
		let trimmedLinkLabel = item.linkLabel.toLowerCase().trim();
        // Checks if the trimmed label is sign out or logout. If yes logouts the user.
		if (trimmedLinkLabel === "sign out" || trimmedLinkLabel === "logout") {
			ModalAnalyticsCall(props, false);			
			logout(item.linkPath);
		} /* Else deletes the cookies and local storage and reloads the page. */ 
		else if (trimmedLinkLabel === "stay signed in") {
			ModalAnalyticsCall(props, false);					
			// Make a servlet call with refresh token to fetch new refresh and access token
			
			//Check logic for setting token and servlet call. servlet call & initiate Logic call
			// Sentinel logic if refresh token available, if not old CIAM logic
			if(refresh_token){
				sentinelcall_for_refresh_token();
			}else{
				deleteCookies();
				setLocalStorage();
				window.open(constants.CIAM_INITIAL_REDIRECT, constants.SELF)
			}
		}
        // Closes session timeout modal.
		setIsOpen(false);
	}	

    /**
     * Displays the time remaining for the user when the user will be logged out if user does not click on any session timeout button.
     * @returns
     */
	const renderer = ({ minutes, seconds, completed }) => {
        // If time remaining is completed then user is forced logged out.
		if (completed) {
			return logout(logoutPath);
		} else {
			return (
				<>
					<span>{props?.description}</span> <span className="sessionTimer"> {zeroPad(minutes)}:{zeroPad(seconds)} {'minutes'}</span><span>{'.'}</span></>
			);
		}
	};

	return (
		<>
			<NextgenSimpleModal
				title={props?.title}
				text={<Countdown date={Date.now() + startTime} renderer={renderer} />}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				hideCloseIcon={true}
				buttonGroup={props?.buttonGroup}
				buttonClick={buttonClick}
				modalType="countdown"
			/>
		</>
	);
};
export default MapTo("ECCHub/components/nextgen/session-timeout")(SessionTimeout, SessionTimeoutConfig);
