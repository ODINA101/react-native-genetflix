import Firebase from 'firebase';

var config = {
    apiKey: "AIzaSyCp9QI_mUB7OHDw_glk56IUIwhoV_UR6lM",
    authDomain: "movies-7b17f.firebaseapp.com",
    databaseURL: "https://movies-7b17f.firebaseio.com",
    projectId: "movies-7b17f",
    storageBucket: "movies-7b17f.appspot.com",
    messagingSenderId: "439505540900",
    appId: "1:439505540900:web:b803d1e2121e07f9"
};
let app = Firebase.initializeApp(config);
export const db = app.database();  