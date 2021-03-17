import firebase from "firebase/app";
// import * as firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6_d7WVmT_sDZprD5Po9wJzX_yXS51TX0",
  authDomain: "mychecklists-9ab38.firebaseapp.com",
  projectId: "mychecklists-9ab38",
  storageBucket: "mychecklists-9ab38.appspot.com",
  messagingSenderId: "808272937433",
  appId: "1:808272937433:web:c68767ec79bd10f040d9c8"
};
// Initialize Firebase

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;