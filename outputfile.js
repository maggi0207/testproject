
import { Page, withModel } from '@adobe/aem-react-editable-components';
import { Provider } from "react-redux";
import LoadingIndicator from './components/NextGen/components/LoadingIndicator';
import store from "./store/index";
import { setUserActive, setUserInactive } from './store/UserActivity/userActivitySlice';
import { initializeUserActivityListeners } from './utils/userActivityTracker';

// This component is the application entry point
class App extends Page {

    constructor(props) {
        super(props);
        console.log("clas props", props);
        this.activityTimeout = null;
    }

    componentDidMount() {
        this.initUserActivityListeners();
    }

    componentWillUnmount() {
        this.cleanupUserActivityListeners();
    }

    initUserActivityListeners = () => {
        this.cleanupListeners = initializeUserActivityListeners(
            this.handleUserActive,
            this.handleUserInactive
        );
    }

    cleanupUserActivityListeners = () => {
        if (this.cleanupListeners) {
            this.cleanupListeners();
        }
    }

    handleUserActive = () => {
        store.dispatch(setUserActive());
    }

    handleUserInactive = () => {
        store.dispatch(setUserInactive());
    }

    render() {
        return (
            <Provider store={store}>
                {this.childComponents}
                {this.childPages}
                <LoadingIndicator />
            </Provider>
        );
    }
}

export default withModel(App);
