import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  remove,
  onValue,
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

window.signOuted = function () {
  signOut(auth)
    .then(function () {
      alert("You have been signed out. Redirecting to home.");
      window.location.href = "../index.html";
    })
    .catch(function (error) {
      console.error("Logout Error:", error);
      alert("Logout failed. Please try again.");
    });
};

window.overView = function () {
  window.location.reload();
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
  } else {
    alert("you are not logged in");
    window.location.href = "../sign-in/signIn.html";
  }
});

const displayUserBookings = (uid, serviceTable) => {
  serviceTable.innerHTML =
    '<tr><td colspan="5" class="text-center py-4 text-ph-gold">Fetching your bookings...</td></tr>';

  const bookingsRef = ref(db, `users/${uid}/bookings`);

  onValue(
    bookingsRef,
    (snapshot) => {
      serviceTable.innerHTML = "";

      if (!snapshot.exists()) {
        serviceTable.innerHTML =
          '<tr><td colspan="5" class="text-center py-4">You have no upcoming service bookings.</td></tr>';
        return;
      }

      let hasServiceBookings = false;
      const data = snapshot.val();

      Object.keys(data).forEach((key) => {
        const booking = data[key];

        if (booking.serviceType !== "Purchase") {
          hasServiceBookings = true;

          const rawDate = new Date(booking.appointmentDate + "T00:00:00");
          const displayDate = rawDate.toLocaleDateString();

          let statusClass =
            booking.status === "Confirmed"
              ? "bg-success"
              : booking.status === "Pending"
              ? "bg-warning text-dark"
              : "bg-secondary";

          const row = serviceTable.insertRow();
          row.innerHTML = `
                    <td>${booking.serviceType}</td>
                    <td>${displayDate}</td>
                    <td>${booking.petName || "N/A"}</td>
                    <td><span class="badge ${statusClass}">${
            booking.status
          }</span></td>
                    <td><button class="btn btn-sm btn-outline-danger" onclick="deleteBooking('${key}')">Delete</button></td>
                `;
        }
      });

      window.deleteBooking = function (bookingKey) {
        if (!confirm("Are you sure you want to delete this booking?")) return;

        console.log(bookingKey);

        const user = auth.currentUser;

        if (user) {
          const bookingPath = `users/${user.uid}/bookings/${bookingKey}`;
          const bookingRef = ref(db, bookingPath);

          remove(bookingRef)
            .then(() => {
              alert("Booking deleted successfully!");
            })
            .catch((error) => {
              console.error("Delete failed:", error);
              alert("Error deleting booking.");
            });
        }
      };

      if (!hasServiceBookings) {
        serviceTable.innerHTML =
          '<tr><td colspan="5" class="text-center py-4">You have no upcoming service bookings.</td></tr>';
      }
    },
    (error) => {
      console.error("RTDB Error:", error);
      serviceTable.innerHTML =
        '<tr><td colspan="5" class="text-center text-danger py-4">Error loading bookings. Check network.</td></tr>';
    }
  );
};

document.addEventListener("DOMContentLoaded", function () {
  const showUserName = document.getElementById("show");
  const showMobileUserName = document.getElementById("show2");
  const tableBodyServices = document.getElementById("show3");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userNameToDisplay =
        user.displayName ||
        (user.email
          ? user.email.substring(0, user.email.indexOf("@"))
          : "User");

      showUserName.textContent = `Welcome, ${userNameToDisplay}!`;
      showMobileUserName.textContent = `Welcome, ${userNameToDisplay}!`;

      displayUserBookings(user.uid, tableBodyServices);
      // updateSummaryCards(user.uid);
    } else {
      window.location.href = "../index.html";
    }
  });
});
