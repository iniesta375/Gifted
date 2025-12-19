import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCx6oPD0bwfxBwsZjWWsHn7MEl26lvkSMI",
    authDomain: "pawpalace-4351b.firebaseapp.com",
    projectId: "pawpalace-4351b",
    databaseURL: "https://pawpalace-4351b-default-rtdb.firebaseio.com",
    storageBucket: "pawpalace-4351b.firebasestorage.app",
    messagingSenderId: "913074284438",
    appId: "1:913074284438:web:3b562f9f8fe553f8439fb7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function() {
    
    const signInContainer = document.getElementById('nav-signin-container');
    const dashboardContainer = document.getElementById('nav-dashboard-container');
    const logoutButton = document.getElementById('nav-logout-button');
    
    if (!signInContainer || !dashboardContainer || !logoutButton) {
        console.warn("Navigation elements not found. Stopping authentication display logic.");
        return; 
    }

    onAuthStateChanged(auth, function(user) {
        if (user) {
            signInContainer.classList.add('d-none');
            signInContainer.classList.remove('d-flex'); 
            
            dashboardContainer.classList.remove('d-none');
            dashboardContainer.classList.add('d-flex'); 

            logoutButton.classList.remove('d-none');
        } else {
            signInContainer.classList.remove('d-none');
            signInContainer.classList.add('d-flex'); 

            dashboardContainer.classList.add('d-none');
            logoutButton.classList.add('d-none');
        }
    });

    window.signOuted = function() {
        signOut(auth).then(() => {
            alert("You have been signed out. Redirecting to home.");
            const path = window.location.pathname.includes('/dashboard.html') ? './index.html' : '../index.html';
            window.location.href = path; 
        }).catch((error) => {
            console.error("Logout Error:", error);
            alert("Logout failed. Please try again.");
        });
    };
});