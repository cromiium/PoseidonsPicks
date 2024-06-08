import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

// Your firebaseConfig object remains the same
const firebaseConfig = {
    apiKey: "AIzaSyCxvCOkoYI97CLFTKHIVxJ4PGSSGbVfjTY",
    authDomain: "poseidonspicks.firebaseapp.com",
    databaseURL: "https://poseidonspicks.firebaseio.com",
    projectId: "poseidonspicks",
    storageBucket: "poseidonspicks.appspot.com",
    messagingSenderId: "466503908018",
    appId: "1:466503908018:ios:c48d407002ad02b77d27ab",
    measurementId: "" // Add your measurementId here if you have one
};

// Ensure Firebase is initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const firebaseDatabase = database;
export default firebase;

