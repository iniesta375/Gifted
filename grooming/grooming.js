import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  push,
  query as rtdbQuery,
  equalTo,
  orderByChild,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

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

const SERVICE_TYPE = "Grooming";

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
  } else {
    alert("you are not logged in");
    window.location.href = "../sign-in/signIn.html";
  }
});

const checkGroomingInputs = function () {
  const appointmentDateElement = document.getElementById("appointmentDate");
  const service = document.getElementById("serviceValue");
  const pet = document.getElementById("petInput");

  if (!appointmentDateElement || !service || !pet) {
    console.error(
      "HTML Error: One or more required elements are missing (check IDs)."
    );
    alert("There's a problem with the form. Please refresh.");
    return false;
  }

  const appointmentDate = (appointmentDateElement.value || "").trim();
  const serviceValue = (service.value || "").trim();
  const petName = (pet.value || "").trim();

  if (appointmentDate === "" || serviceValue === "" || petName === "") {
    alert("Alert! Please fill in all the required inputs!");
    return false;
  }

  return {
    appointmentDate: appointmentDate,
    checkOutDate: null,
    service: serviceValue,
    petName: petName,
  };
};

async function bookService(
  appointmentDate,
  checkOutDate,
  serviceValue,
  petName
) {
  const user = auth.currentUser;

  if (!user) {
    alert("Please sign in to book a service.");
    return;
  }

//   try {
    // const dateQuery = rtdbQuery(
    //     bookingsRef,
    //     orderByChild('appointmentDate'),
    //     equalTo(appointmentDate)
    // );

//     const snapshot = await get(dateQuery);
//     let conflictExists = false;

//     if (snapshot.exists()) {
//       snapshot.forEach((childSnapshot) => {
//         const booking = childSnapshot.val();
//         if (booking.serviceType === SERVICE_TYPE) {
//           conflictExists = true;
//         }
//       });
//     }

//     if (conflictExists) {
//       alert(
//         `The date ${appointmentDate} is already fully booked for ${SERVICE_TYPE}. Please choose another day.`
//       );
//       return;
//     }
//   } catch (error) {
//     console.error("RTDB Error checking date conflict:", error);
//     alert("Could not check date availability. Please try again.");
//     return;
//   }

  const bookingData = {
    serviceType: SERVICE_TYPE,
    appointmentDate: appointmentDate,
    package: serviceValue,
    petName: petName,
    dateBooked: new Date().toISOString(),
    status: "Pending",
  };

  try {
    const bookingsRef = ref(db, `users/${uid}/bookings`);
    await push(bookingsRef, bookingData);

    alert(
      `${SERVICE_TYPE} booking successful! Appointment on ${appointmentDate} submitted.`
    );
    document.getElementById("grooming-form").reset();
  } catch (error) {
    console.error("RTDB Error saving document: ", error);
    alert("Booking failed due to a database error. Check RTDB rules.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.groomSubmit = async (e) => {
    e.preventDefault();

    const inputs = checkGroomingInputs();

    if (inputs) {
      await bookService(
        inputs.appointmentDate,
        inputs.checkOutDate,
        inputs.service,
        inputs.petName
      );
    }
  };
});
