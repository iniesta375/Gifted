let pawUser = []
if (localStorage.pawUsers) {
    const fetched = JSON.parse(localStorage.getItem('pawUsers'))
    pawUser = fetched
} else {
    pawUser = []
}

const signUp = (e) => {
    e.preventDefault()
    if (fullName.value.trim() === '' || email.value.trim() === '' || password.value.trim() === '') {
        showError.style.display = 'block'
        showError2.style.display = 'none'
    } else {
        showError.style.display = 'none'
        const userObj = {
            name: fullName.value,
            mail: email.value,
            pass: password.value
        }
        let regexString = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const confirmEmail = regexString.test(userObj.mail)
        if (confirmEmail) {
            const found = pawUser.find(user => user.mail === userObj.mail)
            if (found) {
                alert('account already exists')
            } else {
                pawUser.push(userObj)
                localStorage.setItem('pawUsers', JSON.stringify(pawUser))
                setTimeout(() => {
                    window.location.href = "../../signin/sign in.html"
                }, 2000);
            }
        } else {
            showError2.style.display = 'block'
        }


        fullName = ''
        email.value = ''
        password.value = ''
    }
}
window.signUp = signUp