// src/redux/payments.js

import { fetchPayments as fetchPaymentsApi } from '../api/paymentApi'; // Import mock API function

import {
  FETCH_PAYMENTS_REQUEST,
  FETCH_PAYMENTS_SUCCESS,
  FETCH_PAYMENTS_FAILURE,
  ADD_PAYMENT_REQUEST,
  ADD_PAYMENT_SUCCESS,
  ADD_PAYMENT_FAILURE,
  UPDATE_PAYMENT_REQUEST,
  UPDATE_PAYMENT_SUCCESS,
  UPDATE_PAYMENT_FAILURE,
} from './actionTypes';

// Action types
export const FETCH_PAYMENTS_REQUEST = 'FETCH_PAYMENTS_REQUEST';
export const FETCH_PAYMENTS_SUCCESS = 'FETCH_PAYMENTS_SUCCESS';
export const FETCH_PAYMENTS_FAILURE = 'FETCH_PAYMENTS_FAILURE';
export const ADD_PAYMENT_REQUEST = 'ADD_PAYMENT_REQUEST';
export const ADD_PAYMENT_SUCCESS = 'ADD_PAYMENT_SUCCESS';
export const ADD_PAYMENT_FAILURE = 'ADD_PAYMENT_FAILURE';
export const UPDATE_PAYMENT_REQUEST = 'UPDATE_PAYMENT_REQUEST';
export const UPDATE_PAYMENT_SUCCESS = 'UPDATE_PAYMENT_SUCCESS';
export const UPDATE_PAYMENT_FAILURE = 'UPDATE_PAYMENT_FAILURE';

// Initial state
const initialState = {
  paymentsData: [],
  loading: false,
  error: null,
};

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

// Action creator for adding a payment
export const addPayment = (payment) => {
  return async (dispatch) => {
    dispatch({ type: ADD_PAYMENT_REQUEST }); // Dispatch request action
    try {
      // Simulate a successful API call
      // const response = await api.addPayment(payment); // Uncomment when real API is ready
      dispatch({ type: ADD_PAYMENT_SUCCESS, payload: payment }); // Dispatch success action
    } catch (err) {
      dispatch({ type: ADD_PAYMENT_FAILURE, payload: err.message }); // Dispatch failure action with error
    }
  };
};

// Action creator for updating a payment
export const updatePayment = (payment) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_PAYMENT_REQUEST }); // Dispatch request action
    try {
      // Simulate a successful API call
      // const response = await api.updatePayment(payment); // Uncomment when real API is ready
      dispatch({ type: UPDATE_PAYMENT_SUCCESS, payload: payment }); // Dispatch success action
    } catch (err) {
      dispatch({ type: UPDATE_PAYMENT_FAILURE, payload: err.message }); // Dispatch failure action with error
    }
  };
};

// Payments reducer
const paymentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PAYMENTS_REQUEST:
    case ADD_PAYMENT_REQUEST:
    case UPDATE_PAYMENT_REQUEST:
      return { ...state, loading: true, error: null }; // Set loading to true

    case FETCH_PAYMENTS_SUCCESS:
      return { ...state, loading: false, paymentsData: action.payload }; // Set payments data

    case ADD_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentsData: [...state.paymentsData, action.payload], // Add new payment to the list
      };

    case UPDATE_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentsData: state.paymentsData.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ), // Update the specific payment
      };

    case FETCH_PAYMENTS_FAILURE:
    case ADD_PAYMENT_FAILURE:
    case UPDATE_PAYMENT_FAILURE:
      return { ...state, loading: false, error: action.payload }; // Set error

    default:
      return state;
  }
};

export default paymentsReducer;




// src/redux/actions.js

import { fetchPayments as fetchPaymentsApi } from '../api/mockPaymentsApi'; // Import mock API function

// Action types
export const FETCH_PAYMENTS_REQUEST = 'FETCH_PAYMENTS_REQUEST';
export const FETCH_PAYMENTS_SUCCESS = 'FETCH_PAYMENTS_SUCCESS';
export const FETCH_PAYMENTS_FAILURE = 'FETCH_PAYMENTS_FAILURE';
export const ADD_PAYMENT = 'ADD_PAYMENT';
export const UPDATE_PAYMENT = 'UPDATE_PAYMENT';

// Action creator for fetching payments
export const fetchPayments = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PAYMENTS_REQUEST }); // Dispatch request action
    try {
      const data = await fetchPaymentsApi(); // Call the mock API
      dispatch({ type: FETCH_PAYMENTS_SUCCESS, payload: data }); // Dispatch success action with data
    } catch (err) {
      dispatch({ type: FETCH_PAYMENTS_FAILURE, payload: err.message }); // Dispatch failure action with error
    }
  };
};

// Action creator for adding a payment
export const addPayment = (payment) => {
  return {
    type: ADD_PAYMENT,
    payload: payment, // The new payment data to be added
  };
};

// Action creator for updating a payment
export const updatePayment = (payment) => {
  return {
    type: UPDATE_PAYMENT,
    payload: payment, // The updated payment data
  };
};

// Initial state for the payments reducer
const initialState = {
  loading: false,
  paymentsData: [], // Array to hold payments data
  error: null, // To hold any error message
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
    case ADD_PAYMENT:
      return { ...state, paymentsData: [...state.paymentsData, action.payload] }; // Add new payment
    case UPDATE_PAYMENT:
      return {
        ...state,
        paymentsData: state.paymentsData.map((payment) =>
          payment.activeRunId === action.payload.activeRunId ? action.payload : payment
        ), // Update payment by activeRunId
      };
    default:
      return state; // Return current state if no action matches
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

// Mock API function to simulate adding a payment
export const addPaymentApi = async (paymentData) => {
  // Simulate a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPayment = {
        ...paymentData,
        id: Math.random().toString(36).substr(2, 9), // Generate a random ID for the new payment
      };
      resolve(newPayment);
    }, 1000); // Simulates a 1 second API response time
  });

  // Uncomment the following code for the real API call when ready:
  /*
  try {
    const response = await axios.post('https://api.example.com/payments', paymentData);
    return response.data; // Assuming the API response contains the newly added payment
  } catch (error) {
    console.error('Error adding payment:', error);
    throw error; // Rethrow the error for handling in the action
  }
  */
};

// Mock API function to simulate updating a payment
export const updatePaymentApi = async (paymentData) => {
  // Simulate a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedPayment = {
        ...paymentData,
        updatedAt: new Date().toISOString(), // Add an updated timestamp
      };
      resolve(updatedPayment);
    }, 1000); // Simulates a 1 second API response time
  });

  // Uncomment the following code for the real API call when ready:
  /*
  try {
    const response = await axios.put(`https://api.example.com/payments/${paymentData.id}`, paymentData);
    return response.data; // Assuming the API response contains the updated payment
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error; // Rethrow the error for handling in the action
  }
  */
};



const PaymentsData = () => {
  const dispatch = useDispatch();
  const { paymentsData, loading, error } = useSelector((state) => state.payments); 

  useEffect(() => {
    dispatch(fetchPayments()); 
  }, [dispatch]);
