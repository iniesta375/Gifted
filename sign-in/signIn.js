 import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAuth, signInWithPopup, GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

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
  const provider = new GoogleAuthProvider();

  const signInGoogle = () => {
    signInWithPopup(auth, provider)
    .then((result)=>{
      const user = result.user;
      console.log(user); 
      if(user){
        setTimeout(() => {
          window.location.href = '../dashboard/dashBoard.html'
        }, 1000);
      } else {
        window.location.href = '../index.html'
      }
    })
    .catch((error)=>{
      const errorCode = error.code
      console.log(errorCode);
    })
  }
  window.signInGoogle = signInGoogle

const fetched = JSON.parse(localStorage.getItem("pawUsers"));
console.log(fetched);


const signIn = (e) => {
  e.preventDefault();
  if (email.value.trim() === "" || passWord.value.trim() === "") {
    // showError.style.display = "block";
    // showError2.style.display = "none";
  } else {
    // showError.style.display = "none";
    const signInObj = {
      mail: email.value,
      pass: passWord.value,
    };

    const found = fetched.find((user) => user.mail === signInObj);
    if (found) {
      const justFound = fetched.find
        (user => user.mail === signInObj && user.pass === signInObj
      );
      if (justFound) {
                console.log('go to dashboard');
                localStorage.setItem('user', JSON.stringify(signInObj))
                setTimeout(()=>{
                    window.location.href = "../dashboard/dashBoard.html";
                }, 2000)
            } else {
                alert("dosen't exist")
                // setTimeout(() => {
                //     showError2.style.display = 'none'
                // }, 2000)
            }
    } else {
                alert("dosen't exist")
      // showError2.style.display = "block";
      // setTimeout(() => {
        // showError2.style.display = "none";
      // }, 2000);
    }
  }
};
window.signIn = signIn