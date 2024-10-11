// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import paymentsReducer from './reducers'; // Import payments reducer

// Create the Redux store
const store = configureStore({
  reducer: {
    payments: paymentsReducer, // Register the payments reducer
  },
});

export default store;



// src/redux/actions.js

import { fetchPayments as fetchPaymentsApi } from '../api/paymentApi'; // Import mock API function

// Action types
export const FETCH_PAYMENTS_REQUEST = 'FETCH_PAYMENTS_REQUEST';
export const FETCH_PAYMENTS_SUCCESS = 'FETCH_PAYMENTS_SUCCESS';
export const FETCH_PAYMENTS_FAILURE = 'FETCH_PAYMENTS_FAILURE';

// Action creator for fetching payments
export const fetchPayments = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PAYMENTS_REQUEST }); // Dispatch request action
    try {
      const data = await fetchPaymentsApi(); // Call the API
      dispatch({ type: FETCH_PAYMENTS_SUCCESS, payload: data }); // Dispatch success action with data
    } catch (err) {
      dispatch({ type: FETCH_PAYMENTS_FAILURE, payload: err.message }); // Dispatch failure action with error
    }
  };
};



// src/redux/reducers.js

import {
  FETCH_PAYMENTS_REQUEST,
  FETCH_PAYMENTS_SUCCESS,
  FETCH_PAYMENTS_FAILURE,
} from './actions';

const initialState = {
  paymentsData: [],
  loading: false,
  error: null,
};

// Payments reducer
const paymentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PAYMENTS_REQUEST:
      return { ...state, loading: true, error: null }; // Set loading to true
    case FETCH_PAYMENTS_SUCCESS:
      return { ...state, loading: false, paymentsData: action.payload }; // Set payments data
    case FETCH_PAYMENTS_FAILURE:
      return { ...state, loading: false, error: action.payload }; // Set error
    default:
      return state;
  }
};

export default paymentsReducer;


// src/api/paymentApi.js

import axios from 'axios';

// Mock API function to simulate fetching payments data
export const fetchPayments = async () => {
  // Mock data to simulate an API response
  const mockData = [
    {
      name: "Example Name",
      sourceSystem: "System A",
      dateHarvested: "2024-10-10",
      paymentsCount: 100,
      activeRunId: 45908,
    },
    {
      name: "Another Name",
      sourceSystem: "System B",
      dateHarvested: "2024-10-09",
      paymentsCount: 0,
      activeRunId: null,
    },
    {
      name: "Third Name",
      sourceSystem: "System C",
      dateHarvested: "2024-10-08",
      paymentsCount: 50,
      activeRunId: 45909,
    },
    {
      name: "Fourth Name",
      sourceSystem: "System D",
      dateHarvested: "2024-10-07",
      paymentsCount: 75,
      activeRunId: 45910,
    },
    {
      name: "Fifth Name",
      sourceSystem: "System E",
      dateHarvested: "2024-10-06",
      paymentsCount: 30,
      activeRunId: 45911,
    },
    {
      name: "Sixth Name",
      sourceSystem: "System F",
      dateHarvested: "2024-10-05",
      paymentsCount: 20,
      activeRunId: null,
    },
  ];

  return new Promise((resolve) => {
    // Simulate a delay for the mock API call
    setTimeout(() => {
      resolve(mockData);
    }, 1000); // Simulates a 1 second API response time
  });

  // Uncomment the following code for the real API call when ready:
  /*
  try {
    const response = await axios.get('https://api.example.com/payments');
    return response.data; // Assuming the API response contains the payment data directly
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error; // Rethrow the error for handling in the action
  }
  */
};


const PaymentsData = () => {
  const dispatch = useDispatch();
  const payments = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchPaymentsAction()); // Dispatch the fetch action
  }, [dispatch]);
