import PLACE_BET from '../actions/accountActions';

const initialState = {
    accountName: 'Test1',
    password: 'password1',
    firstName: 'Yianni',
    lastName: 'Skilitis',
    wallet: 1000,
    currentBets: [],
    previousBets: [],
};

function accountReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        ...action.payload,
      };
      case 'PLACE_BET':
        return {
          ...state,
          currentBets: [...state.currentBets, action.payload],
        };
    default:
      return state;
  }
}

export default accountReducer;