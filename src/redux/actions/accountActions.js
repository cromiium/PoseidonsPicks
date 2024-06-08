import firebaseDatabase from '../../firebase/firebaseConfig.js';
import { updateAccountInFirebase, getAccountFromFirebase } from '../../firebase/firebaseServices';

export const createAccount = (account) => {
  return (dispatch) => {
    console.log("Creating account: ", account);
    createAccountInFirebase(account)
      .then(() => {
        dispatch({
          type: 'CREATE_ACCOUNT',
          payload: account,
        });
      })
      .catch(error => {
        console.error("Error creating account: ", error);
      });
  };
};

export const loadAccount = (UUID) => async (dispatch) => {
  try {
    console.log('Loading account information:', UUID)
    const doc = await getAccountFromFirebase(UUID);
    console.log('Fetched account from Firestore:', doc);

    if (doc.exists) {
      dispatch({
        type: 'LOAD_ACCOUNT',
        payload: doc.data(), // Dispatch the account data on success
      });
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.error('Error fetching account information:', error);
  }
};

export const updateAccount = (UUID, account) => {
  return (dispatch) => {
    updateAccountInFirebase(UUID, account)
      .then(() => {
        dispatch({
          type: 'UPDATE_ACCOUNT',
          payload: account,
        });
      })
      .catch(error => {
        console.error("Error updating account: ", error);
      });
  };
};
export const placeBet = (bet) => {
  return async (dispatch, getState) => {
    console.log("placeBet action called with bet:", bet); // Debug log
    const { account: { UUID }, wallet } = getState();
    console.log("Current state in placeBet:", { UUID, currentBets }); // Debug log
    const updatedBets = [...currentBets, bet];
    try {
      await updateAccountInFirebase(UUID, { currentBets: updatedBets });
      console.log("Updated bets successfully in Firebase", updatedBets); // Debug log
      dispatch({
        type: 'UPDATE_ACCOUNT',
        payload: { currentBets: updatedBets },
      });
    } catch (error) {
      console.error("Error updating bets in Firestore: ", error);
    }
  };
};

export const checkWallet = (bet) => {
  console.log("checkWallet action called with bet:", bet); // Debug log
  return async (dispatch, getState) => {
    const { account: { wallet, UUID, email, firstName } } = getState();
    console.log("Current state in checkWallet:", getState()); // Debug log
    if (wallet >= bet.wager) {
      const newWalletAmount = wallet - bet.wager;
      console.log("New wallet amount:", newWalletAmount); // Debug log
      console.log({wallet: newWalletAmount})
      try {
        console.log("Updating wallet in Firestore"); // Debug log
        await updateAccountInFirebase(UUID, { wallet: newWalletAmount }); // Assuming you need to pass the new wallet amount and UUID
        console.log("Updated wallet successfully in Firebase", newWalletAmount); // Debug log
        dispatch({
          type: 'UPDATE_ACCOUNT',
          payload: {
            UUID, // Assuming UUID doesn't change
            wallet: newWalletAmount, // Updated wallet amount
            email, // Assuming email doesn't change
            firstName, // Assuming firstName doesn't change
            // Add any other fields you want to update here
          },
        });
        console.log("Dispatched UPDATE_ACCOUNT with new wallet amount:", newWalletAmount); // Debug log
        dispatch(placeBet(bet)); // Place the bet if there are sufficient funds
      } catch (error) {
        console.error("Error updating wallet in Firestore: ", error);
      }
    } else {
      console.log('Insufficient funds for bet:', bet);
      alert('Insufficient funds');
    }
  };
};