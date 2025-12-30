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

window.generateReceipt = function(name, price, date) {
    const receiptWindow = window.open('', '_blank');
    if (!receiptWindow) return alert("Please allow popups to view receipt");

    const container = receiptWindow.document.createElement('div');
    container.style.fontFamily = 'sans-serif';
    container.style.padding = '40px';
    container.style.textAlign = 'center';
    container.style.border = '2px solid #eee';
    container.style.maxWidth = '500px';
    container.style.margin = 'auto';

    container.innerHTML = `
        <h1 style="color: #265073;">Gifted Pets</h1>
        <p style="color: #666;">Official Adoption Receipt</p>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <div style="text-align: left; margin-top: 20px;">
            <p><strong>Pet Name:</strong> ${name}</p>
            <p><strong>Amount Paid:</strong> ${price}</p>
            <p><strong>Date:</strong> ${date}</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999;">Thank you for your adoption!</p>
    `;

    receiptWindow.document.body.appendChild(container);
    
    setTimeout(() => {
        receiptWindow.print();
        receiptWindow.close();
    }, 500);
};

window.signOuted = function () {
  signOut(auth).then(() => {
      window.location.href = "../index.html";
  });
};

const displayUserBookings = (activeUid) => {
  const serviceTable = document.getElementById("show3");
  const adoptionContainer = document.getElementById("adoption-cards-container");
  
  if (!serviceTable || !adoptionContainer) return;

  const bookingsRef = ref(db, `users/${activeUid}/bookings`);

  onValue(bookingsRef, (snapshot) => {
    serviceTable.innerHTML = "";
    adoptionContainer.innerHTML = "";

    if (!snapshot.exists()) {
      serviceTable.innerHTML = '<tr><td colspan="5" class="text-center py-4">No services found.</td></tr>';
      adoptionContainer.innerHTML = '<div class="col-12 text-center text-muted">No pets adopted yet.</div>';
      return;
    }

    const data = snapshot.val();
    let hasServices = false;
    let hasAdoptions = false;

    Object.keys(data).forEach((key) => {
      const item = data[key];
      const type = (item.serviceType || "").trim().toLowerCase();

      if (type === "purchase" || type === "adoption") {
        hasAdoptions = true;
        const date = item.dateBooked ? new Date(item.dateBooked).toLocaleDateString() : "N/A";
        
       const cardHtml = `
  <div class="col-md-6 col-lg-4 mb-3">
    <div class="card border-0 shadow-sm h-100" style="border-radius: 12px;">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between mb-2">
          <h5 class="fw-bold m-0">${item.petName || 'Pet'}</h5>
          <span class="badge bg-success rounded-pill">Adopted</span>
        </div>
        <p class="text-muted small mb-4">${date}</p>
        <div class="d-flex justify-content-between align-items-center mt-auto">
          <span class="fw-bold text-primary">${item.amountPaid || 'Paid'}</span>
          
          <button class="btn btn-sm btn-outline-primary receipt-trigger-btn" 
            data-name="${item.petName}" 
            data-price="${item.amountPaid}" 
            data-date="${date}">
            Receipt
          </button>
          
        </div>
      </div>
    </div>
  </div>`;

adoptionContainer.insertAdjacentHTML('beforeend', cardHtml);
      } 
      else {
        hasServices = true;
        const sDate = item.appointmentDate ? new Date(item.appointmentDate + "T00:00:00").toLocaleDateString() : "N/A";
        const row = `
          <tr>
            <td>${item.serviceType}</td>
            <td>${sDate}</td>
            <td>${item.petName || "N/A"}</td>
            <td><span class="badge ${item.status === 'Confirmed' ? 'bg-success' : 'bg-warning text-dark'}">${item.status}</span></td>
            <td><button class="btn btn-sm btn-outline-danger" onclick="deleteItem('${key}')">Delete</button></td>
          </tr>`;
        serviceTable.insertAdjacentHTML('beforeend', row);
      }
    });
    const receiptButtons = document.querySelectorAll('.receipt-trigger-btn');
receiptButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const name = e.target.getAttribute('data-name');
        const price = e.target.getAttribute('data-price');
        const dateStr = e.target.getAttribute('data-date');
        
        window.generateReceipt(name, price, dateStr);
    });
});

    if (!hasServices) serviceTable.innerHTML = '<tr><td colspan="5" class="text-center">No service bookings.</td></tr>';
    if (!hasAdoptions) adoptionContainer.innerHTML = '<div class="col-12 text-center text-muted">No pets adopted yet.</div>';
  });

  window.deleteItem = function(key) {
    if (confirm("Delete this entry?")) {
      remove(ref(db, `users/${activeUid}/bookings/${key}`));
    }
  };
};

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const name = user.displayName || user.email.split('@')[0];
      const welcome = document.getElementById("show");
      const welcomeMob = document.getElementById("show2");
      if (welcome) welcome.textContent = `Welcome, ${name}!`;
      if (welcomeMob) welcomeMob.textContent = `Welcome, ${name}!`;

      displayUserBookings(user.uid);
    } else {
      window.location.href = "../sign-in/signIn.html";
    }
  });
});