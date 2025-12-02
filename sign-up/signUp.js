import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
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

// Initialize Firebase
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
  if (
    fullName.value.trim() === "" ||
    email.value.trim() === "" ||
    userName.value.trim() === "" ||
    passWord.value.trim() === ""
  ) {
    alert("fill in all inputs");
  } else {
    // alert('fill in all inputs')
    const userObj = {
      name: fullName.value,
      userName: userName.value,
      mail: email.value,
      pass: passWord.value,
    };
    let regexString = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const confirmEmail = regexString.test(userObj.mail);
    if (confirmEmail) {
      const found = pawUser.find((user) => user.mail === userObj.mail);
      if (found) {
        alert("account already exists");
      } else {
        pawUser.push(userObj);
        localStorage.setItem("pawUsers", JSON.stringify(pawUser));
        setTimeout(() => {
          window.location.href = "../sign-in/signIn.html";
        }, 2000);
      }
    } else {
      alert("sign up");
    }

    fullName.value = "";
    userName.value = "";
    email.value = "";
    passWord.value = "";
  }
};
window.signUp = signUp;
