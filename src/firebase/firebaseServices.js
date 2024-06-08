import {firebase, firebaseDatabase} from './firebaseConfig';
import firestore from '@react-native-firebase/firestore'; // Add this line


export const updateAccountInFirebase = (UUID, accountData) => {
    return firestore().collection('users').doc(UUID).update(accountData);
};
  

export const createAccountInFirebase = (accountData) => {
    return firestore().collection('users').add(accountData);
};

export const getAccountFromFirebase = async (UUID) => {
    try {
        console.log('Fetching account from Firestore using UUID:', UUID);
        const doc = await firestore().collection('users').doc(UUID).get();
        console.log('Fetched account from Firestore:', doc);
        return doc;
    } catch (error) {
        console.error('Error fetching account from Firestore using UUID:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

