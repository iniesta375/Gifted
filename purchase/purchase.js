import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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
const db = getFirestore(app);
const auth = getAuth(app); 

const getInquiryData = function() {
    const nameElement = document.getElementById('inquiry-name');
    const emailElement = document.getElementById('inquiry-email');
    const messageElement = document.getElementById('inquiry-message');
    
    const petIdElement = document.getElementById('pet-id-hidden'); 
    const petNameElement = document.getElementById('pet-name-display'); 
    
    if (nameElement === null || emailElement === null || petIdElement === null) {
        alert("Form error: Missing required fields or pet data.");
        return false;
    }
    
    
    if (auth.currentUser === null) {
        alert("Please sign in before submitting an inquiry.");
        console.log(auth);
       
        return;
    }

    return { 
        userName: nameElement.value,
        userEmail: emailElement.value,
        userMessage: messageElement.value,
        petId: petIdElement.value,
        petName: petNameElement.textContent,
        userId: auth.currentUser.uid,        
    };
        console.log('userName', 'userEmail')

};

window.submitAdoptionInquiry = function (event) {
    event.preventDefault(); 
    
    const details = getInquiryData();
    if (details === false) return;

    const inquiryData = {
        userId: details.userId,
        petId: details.petId,
        petName: details.petName,
        inquirerName: details.userName,
        inquirerEmail: details.userEmail,
        message: details.userMessage,
        dateSubmitted: new Date(),
        status: "New Inquiry" 
    };

    addDoc(collection(db, "inquiries"), inquiryData) 
    .then(function(docRef) {
        alert(`Thank you, ${details.userName}! Your inquiry for ${details.petName} has been submitted.`);
        
        const modalElement = document.getElementById('inquiryModal');
        const modal = bootstrap.Modal.getInstance(modalElement); 
        if (modal) {
             modal.hide();
        }
        
        document.getElementById('inquiry-form').reset();
    })
    .catch(function(error) {
        console.error("Error submitting inquiry: ", error);
        alert("Failed to submit inquiry. Please try calling instead.");
    });
};

// =========================================================================
// 4. FINAL PURCHASE LOGIC (Called separately for finalized adoption)
// =========================================================================

const getPurchaseDetails = function() {
    const petIdElement = document.getElementById('pet-id-hidden');
    const petNameElement = document.getElementById('pet-name-display'); 
    
    if (petIdElement === null || petNameElement === null) {
        console.error("Purchase details are missing.");
        alert("Error: Pet information is unavailable. Cannot complete purchase.");
        return false;
    }
    
    const petId = petIdElement.value;
    const petName = petNameElement.textContent;
    
    if (petId === "" || petName === "") {
        alert("Error: Missing pet details.");
        return false;
    }
    return { petId: petId, petName: petName };
};

window.purchaseSubmit = function (event) {
    event.preventDefault(); 
    
    const details = getPurchaseDetails(); 
    if (details !== false) {
        const user = auth.currentUser;
        if (user === null) {
             alert("please sign in to submit inquiry");

            const signInPath = "../../sign-in/signIn.html";

             setTimeout(() => {
            window.location.href = signInPath
        }, 2000); return; 
    }

        const bookingsCollection = collection(db, "bookings");
        
        const purchaseData = {
            userId: user.uid,
            serviceType: 'Purchase', 
            petId: details.petId, 
            petName: details.petName,
            appointmentDate: new Date().toISOString().split('T')[0], 
            dateBooked: new Date(),
            status: "Completed", 
        };

        addDoc(bookingsCollection, purchaseData)
        .then(function(docRef) {
            alert("Congratulations! You have successfully adopted " + details.petName + "!");
            console.log("Purchase recorded with ID: ", docRef.id);
            // Typically redirect user here
        })
        .catch(function(error) {
            console.error("Error recording purchase: ", error);
            alert("Purchase record failed due to a database error. Please contact support.");
        });
    }
};