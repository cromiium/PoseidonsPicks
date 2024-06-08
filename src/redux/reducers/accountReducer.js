import PLACE_BET from '../actions/accountActions';

const initialState = {
  uuid: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  wallet: 1000000,
  currentBets: [],
  previousBets: [],
};

function accountReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.id]: {
            ...state.users[action.payload.id],
            ...action.payload,
          },
        },
      };
    case 'LOAD_ACCOUNT':
      return {
        ...state,
        ...action.payload,
      };
    case 'PLACE_BET':
      return {
        ...state,
        currentBets: [...state.currentBets, action.payload],
      };
    case 'CREATE_ACCOUNT':
      return {
        ...state,
        email: action.payload.email,
        password: action.payload.password,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        wallet: initialState.wallet, // Reset or set to a specific value if needed
        currentBets: [],
        previousBets: [],
      };
    default:
      return state;
  }
}

export default accountReducer;