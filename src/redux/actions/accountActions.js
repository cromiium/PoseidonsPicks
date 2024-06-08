export function updateAccount(account) {
  return {
    type: 'UPDATE_ACCOUNT',
    payload: account,
  };
}

export function placeBet(bet) {
  return {
    type: 'PLACE_BET',
    payload: bet,
  };
}

export function checkWallet(bet) {
  return (dispatch, getState) => {
    const state = getState();
    console.log(state);
    if (state.wallet >= bet.wager) { // Corrected path to wallet
      dispatch(placeBet(bet));
      dispatch(updateAccount({ wallet: state.wallet - bet.wager })); // Corrected updateAccount dispatch
    }
    else {
      alert('Insufficient funds');
    }
  };
}