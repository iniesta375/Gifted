import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCx6oPD0bwfxBwsZjWWsHn7MEl26lvkSMI",
    authDomain: "pawpalace-4351b.firebaseapp.com",
    projectId: "pawpalace-4351b",
    storageBucket: "pawpalace-4351b.firebasestorage.app",
    messagingSenderId: "913074284438",
    appId: "1:913074284438:web:3b562f9f8fe553f8439fb7"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const signOuted = () => {
    signOut(auth)
      .then(() => {
        console.log("user is signed out");
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 1500);
      })
      .catch((error) => { });
  };
  window.signOuted = signOuted;