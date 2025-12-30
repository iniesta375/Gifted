import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCx6oPD0bwfxBwsZjWWsHn7MEl26lvkSMI",
  authDomain: "pawpalace-4351b.firebaseapp.com",
  projectId: "pawpalace-4351b",
  storageBucket: "pawpalace-4351b.firebasestorage.app",
  messagingSenderId: "913074284438",
  appId: "1:913074284438:web:3b562f9f8fe553f8439fb7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      if (user) {
        window.location.href = '../dashboard/dashBoard.html';
      }
    })
    .catch((error) => {
      console.error("Google Sign-In Error:", error.code);
    });
};
window.signInGoogle = signInGoogle;

const signIn = (e) => {
  e.preventDefault();

  const emailInput = document.getElementById("email").value.trim();
  const passwordInput = document.getElementById("passWord").value;

  if (emailInput === "" || passwordInput === "") {
    alert('Please fill in all fields.');
    return;
  }

  signInWithEmailAndPassword(auth, emailInput, passwordInput)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Logged in as:", user.displayName || user.email);
      
      setTimeout(() => {
        window.location.href = "../dashboard/dashBoard.html";
      }, 1000);
    })
    .catch((error) => {
      const errorCode = error.code;
      
      if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
        alert("Invalid email or password. Please try again.");
      } else if (errorCode === 'auth/too-many-requests') {
        alert("Too many failed attempts. Please try again later.");
      } else {
        alert("Error: " + error.message);
      }
      console.log("Login Error Code:", errorCode);
    });
};
window.signIn = signIn;