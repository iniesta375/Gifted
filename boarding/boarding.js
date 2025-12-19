import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, get, push,} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

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
const db = getDatabase(app);
let uid;

const SERVICE_TYPE = 'Boarding'; 

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
  } else {
    alert("you are not logged in");
    window.location.href = "../sign-in/signIn.html";
  }
});

const checkBoardingInputs = function() {
    const checkIn = document.getElementById('checkInDate');
    const checkOut = document.getElementById('checkOutDate');
    const service = document.getElementById('serviceValue');
    const pet = document.getElementById('petInput');

    if (!checkIn || !service || !pet) {
        console.error("HTML Error: One or more required elements are missing.");
        alert("There's a problem with the form. Please refresh.");
        return false;
    }

    const checkInDate = (checkIn.value || '').trim();
    const serviceValue = (service.value || '').trim();
    const petName = (pet.value || '').trim();
    
    const checkOutDate = (checkOut && checkOut.value) ? checkOut.value.trim() : null;

    if (checkInDate === "" || serviceValue === "" || petName === "" || (SERVICE_TYPE === 'Boarding' && checkOutDate === "")) {
        alert("Alert! Please fill in ALL the required inputs!");
        return false;
    }

    return { 
        checkIn: checkInDate, 
        checkOut: checkOutDate, 
        service: serviceValue,
        petName: petName
    };
};

async function bookService(checkInDate, checkOutDate, serviceValue, petName) {
    const user = auth.currentUser;
    
    if (!user) {
        alert("Please sign in to book a service.");
        return;
    }

    // try {
    //     const bookingsRef = ref(db, 'bookings');
    //     const dateQuery = rtdbQuery(
    //         bookingsRef,
    //         orderByChild('appointmentDate'), 
    //         equalTo(checkInDate)             
    //     );
        
    //     const snapshot = await get(dateQuery);
    //     let conflictExists = false;

    //     if (snapshot.exists()) {
    //         snapshot.forEach((childSnapshot) => {
    //             const booking = childSnapshot.val();
    //             if (booking.serviceType === SERVICE_TYPE) {
    //                 conflictExists = true;
    //             }
    //         });
    //     }

    //     if (conflictExists) {
    //         alert(`The date ${checkInDate} is already fully booked for ${SERVICE_TYPE}. Please choose another day.`);
    //         return;
    //     }
    // } catch (error) {
    //     console.error("RTDB Error checking date conflict:", error);
    //     alert("Could not check date availability. Please try again.");
    //     return;
    // }
    
    const bookingData = {
        userId: user.uid,
        serviceType: SERVICE_TYPE,
        appointmentDate: checkInDate,
        checkoutDate: checkOutDate,
        package: serviceValue,
        petName: petName,
        dateBooked: new Date().toISOString(), 
        status: "Pending",
    };

    try {
        const bookingsRef = ref(db, `users/${uid}/bookings`);
        await push(bookingsRef, bookingData);
        
        alert(`${SERVICE_TYPE} booking successful! Check-in on ${checkInDate} submitted.`);
        document.getElementById('boarding-form').reset();
    } catch (error) {
        console.error("RTDB Error saving document: ", error);
        alert("Booking failed due to a database error.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.boardSubmit = async (e) => {
        e.preventDefault();
        
        const inputs = checkBoardingInputs();

        if (inputs) {
            await bookService(inputs.checkIn, inputs.checkOut, inputs.service, inputs.petName);
        }
    };
});