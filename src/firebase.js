import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyCb8-0i9-HwOMoVhCCpDkVw4dBWBQ7iMdw",
    authDomain: "react-todoist-f7047.firebaseapp.com",
    databaseURL: "https://react-todoist-f7047-default-rtdb.firebaseio.com",
    projectId: "react-todoist-f7047",
    storageBucket: "react-todoist-f7047.appspot.com",
    messagingSenderId: "352887017453",
    appId: "1:352887017453:web:402c8bac70149db13e21e4"
})

export { firebaseConfig as firebase }