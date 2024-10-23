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
