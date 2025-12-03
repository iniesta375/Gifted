import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCx6oPD0bwfxBwsZjWWsHn7MEl26lvkSMI",
  authDomain: "pawpalace-4351b.firebaseapp.com",
  projectId: "pawpalace-4351b",
  storageBucket: "pawpalace-4351b.firebasestorage.app",
  messagingSenderId: "913074284438",
  appId: "1:913074284438:web:3b562f9f8fe553f8439fb7",
};

let groomTime = JSON.parse(localStorage.getItem("time")) || [];
if (localStorage.groomTime) {
  displayService();
} else {
  // groomTime = "";

}

const displayService = () => {
    groomTime.forEach((services) => {
      show3.innerHTML += `
      <tr>
        <td>${services.sevice}</td>
        <td>${services.dat}</td>
        <td>Luna</td>
      </tr>
    `;
    });
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
    .catch((error) => {});
};
window.signOuted = signOuted;

const overView = () => {
  window.location.href = "dashBoard.html";
};
window.overView = overView;

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user);
    show.innerHTML += `
                        <h5>Welcome, ${user.displayName}</h5>
                        `;
    show2.innerHTML += `
            <h5>Welcome, ${user.displayName}</h5>
      `;
  } else {
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1000);
  }
});
