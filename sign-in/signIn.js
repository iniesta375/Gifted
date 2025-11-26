const fetched = JSON.parse(localStorage.getItem("pawUsers"));
console.log(fetched);


const signIn = (e) => {
  e.preventDefault();
  if (email.value.trim() === "" || password.value.trim() === "") {
    showError.style.display = "block";
    showError2.style.display = "none";
  } else {
    showError.style.display = "none";
    const signInObj = {
      mail: email.value,
      pass: password.value,
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
                    window.location.href = "../index.html";
                }, 2000)
            } else {
                showError2.style.display = 'block'
                setTimeout(() => {
                    showError2.style.display = 'none'
                }, 2000)
            }
    } else {
      showError2.style.display = "block";
      setTimeout(() => {
        showError2.style.display = "none";
      }, 2000);
    }
  }
};
