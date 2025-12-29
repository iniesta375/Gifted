import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

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
const db = getDatabase(app);
const auth = getAuth(app);

const getInquiryData = () => {
    const name = document.getElementById('inquiry-name')?.value;
    const email = document.getElementById('inquiry-email')?.value;
    const message = document.getElementById('inquiry-message')?.value;
    const petId = document.getElementById('pet-id-hidden')?.value;
    const petName = document.getElementById('pet-name-display')?.textContent;

    if (!auth.currentUser) {
        alert("Please sign in first.");
        return null;
    }

    return { name, email, message, petId, petName, userId: auth.currentUser.uid };
};

window.submitAdoptionInquiry = async function (event) {
    event.preventDefault();
    const data = getInquiryData();
    if (!data) return;

    try {
        const inquiryRef = ref(db, 'inquiries');
        const newInquiryRef = push(inquiryRef); 
        
        await set(newInquiryRef, {
            ...data,
            dateSubmitted: new Date().toISOString(),
            status: "New Inquiry"
        });

        alert(`Inquiry sent for ${data.petName}!`);
        const modalEl = document.getElementById('inquiryModal');
        if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal?.hide();
        }
        document.getElementById('inquiry-form')?.reset();
    } catch (e) {
        console.error(e);
        alert("Error sending inquiry.");
    }
};


window.goToCheckout = function(event) {
    if (event) event.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert("Please sign in to complete your adoption.");
        window.location.href = "../sign-in/signIn.html";
        return;
    }

    const petId = document.getElementById('pet-id-hidden')?.value;
    const petName = document.getElementById('pet-name-display')?.textContent;

    if (!petId || !petName) {
        alert("Error: Pet information is missing.");
        return;
    }

const checkoutURL = `../checkout.html?petId=${petId}&petName=${encodeURIComponent(petName)}`;
    
    console.log("Navigating to Checkout...");
    window.location.href = checkoutURL;
};