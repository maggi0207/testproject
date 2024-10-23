// src/JS/App.js

import { Page, withModel } from '@adobe/aem-react-editable-components';
import { Provider } from 'react-redux';
import LoadingIndicator from './components/NextGen/components/LoadingIndicator';
import store from "./store/index";
import { setUserActive, setUserInactive } from './redux/userActivitySlice'; // Redux actions for activity
import { initializeUserActivityListeners } from './utils/userActivityTracker'; // Utility for event tracking

class App extends Page {
  constructor(props) {
    super(props);
    this.activityTimeout = null;
  }

  componentDidMount() {
    super.componentDidMount(); // Ensure we call the parent class's componentDidMount()

    // Initialize user activity listeners and dispatch Redux actions
    this.cleanupListeners = initializeUserActivityListeners(
      this.handleUserActive.bind(this),
      this.handleUserInactive.bind(this)
    );
  }

  componentWillUnmount() {
    super.componentWillUnmount(); // Ensure we call the parent class's componentWillUnmount()

    // Cleanup event listeners on unmount
    if (this.cleanupListeners) {
      this.cleanupListeners();
    }
  }

  handleUserActive() {
    store.dispatch(setUserActive()); // Dispatch Redux action for user active
  }

  handleUserInactive() {
    store.dispatch(setUserInactive()); // Dispatch Redux action for user inactive
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



// userActivitySlice.js
const initialState = {
  isUserActive: true,
};

// Action types
const USER_ACTIVE = 'USER_ACTIVE';
const USER_INACTIVE = 'USER_INACTIVE';

// Action creators
export const setUserActive = () => ({
  type: USER_ACTIVE,
});

export const setUserInactive = () => ({
  type: USER_INACTIVE,
});

// Reducer
const userActivityReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_ACTIVE:
      return { ...state, isUserActive: true };
    case USER_INACTIVE:
      return { ...state, isUserActive: false };
    default:
      return state;
  }
};

export default userActivityReducer;


// userActivityTracker.js
export const initializeUserActivityListeners = (onUserActive, onUserInactive) => {
  let activityTimeout;

  const resetInactivityTimeout = () => {
    clearTimeout(activityTimeout);
    onUserActive(); // Dispatch active status
    activityTimeout = setTimeout(() => {
      onUserInactive(); // Dispatch inactive status
    }, 300000); // 5-minute idle timer (adjust as needed)
  };

  // Register event listeners for user interactions
  window.addEventListener('mousemove', resetInactivityTimeout);
  window.addEventListener('keypress', resetInactivityTimeout);
  window.addEventListener('scroll', resetInactivityTimeout);

  resetInactivityTimeout(); // Start the initial timeout

  return () => {
    // Cleanup event listeners
    window.removeEventListener('mousemove', resetInactivityTimeout);
    window.removeEventListener('keypress', resetInactivityTimeout);
    window.removeEventListener('scroll', resetInactivityTimeout);
  };
};

const dispatch = useDispatch();

  useEffect(() => {
    // Initialize user activity listeners and dispatch Redux actions
    const cleanupListeners = initializeUserActivityListeners(
      () => dispatch(setUserActive()),
      () => dispatch(setUserInactive())
    );

    // Cleanup on unmount
    return () => {
      cleanupListeners();
    };
  }, [dispatch]);

const isUserActive = useSelector((state) => state.userActivity.isUserActive);
