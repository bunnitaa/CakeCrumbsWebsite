import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRH-thAW1SjOyCQlrOlUQCGBVRua8jLxU",
    authDomain: "cakecrumbs-d1290.firebaseapp.com",
    projectId: "cakecrumbs-d1290",
    storageBucket: "cakecrumbs-d1290.appspot.com",
    messagingSenderId: "543242101407",
    appId: "1:543242101407:web:d6dd372813b0f5a4ae38aa",
    measurementId: "G-755838ERP4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };