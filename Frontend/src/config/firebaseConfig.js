import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB67hmMu7GNrG7L5rhLO3zoE1dpSdSdfXo",
    authDomain: "dal-vacation-home-429313.firebaseapp.com",
    projectId: "dal-vacation-home-429313",
    storageBucket: "dal-vacation-home-429313.appspot.com",
    messagingSenderId: "444808752616",
    appId: "1:444808752616:web:d213c996d504b58abcc85d",
    measurementId: "G-6PLPHB9KJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const firestore = getFirestore(app);

export { firestore };
