import firebase from "firebase/app";
// import * as firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2v0kU5YtarcxZg-v4Tborrp38MfhYXFU",
  authDomain: "customizableeln.firebaseapp.com",
  projectId: "customizableeln",
  storageBucket: "customizableeln.appspot.com",
  messagingSenderId: "257106249028",
  appId: "1:257106249028:web:5d58c849099ecbdfa14311"
};
// Initialize Firebase

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;