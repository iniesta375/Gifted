import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCx6oPD0bwfxBwsZjWWsHn7MEl26lvkSMI",
  authDomain: "pawpalace-4351b.firebaseapp.com",
  projectId: "pawpalace-4351b",
  storageBucket: "pawpalace-4351b.firebasestorage.app",
  messagingSenderId: "913074284438",
  appId: "1:913074284438:web:3b562f9f8fe553f8439fb7",
};

let pawUser = [];
if (localStorage.pawUsers) {
  const fetched = JSON.parse(localStorage.getItem("pawUsers"));
  pawUser = fetched;
} else {
  pawUser = [];
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signUpGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
      if (user) {
        setTimeout(() => {
          window.location.href = "../dashboard/dashBoard.html";
        }, 1000);
      } else {
        window.location.href = "../index.html";
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log(errorCode);
    });
};
window.signUpGoogle = signUpGoogle;

const signUp = (e) => {
  e.preventDefault();

  const emailVal = document.getElementById("email").value.trim();
  const passwordVal = document.getElementById("passWord").value;
  const displayNameVal = document.getElementById("fullName").value.trim();
  const userNameVal = document.getElementById("userName").value.trim();

  if (
    displayNameVal === "" ||
    emailVal === "" ||
    userNameVal === "" ||
    passwordVal === ""
  ) {
    alert("fill in all inputs");
    return;
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  if (!passwordRegex.test(passwordVal)) {
    alert("Password must be at least 8 characters long and include: \n- One Uppercase letter \n- One Lowercase letter \n- One Number \n- One Special Character (@$!%*?&)");
    return;
  }

  let regexString = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const confirmEmail = regexString.test(emailVal);

  if (confirmEmail) {
    createUserWithEmailAndPassword(auth, emailVal, passwordVal)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User Created:", user);

        updateProfile(auth.currentUser, {
          displayName: displayNameVal,
        })
        .then(() => {
            alert("Account created successfully!");
            window.location.href = "../sign-in/signIn.html";
        })
        .catch((error) => {
            console.error("Profile update error:", error);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/email-already-in-use') {
          alert("This email is already registered. Please sign in instead.");
        } else {
          console.log("Firebase Error:", errorMessage);
          alert(errorMessage);
        }
      });
  } else {
    alert("Please enter a valid email address");
  }

  fullName.value = "";
  userName.value = "";
  email.value = "";
  passWord.value = "";
};
window.signUp = signUp;