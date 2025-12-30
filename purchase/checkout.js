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

const params = new URLSearchParams(window.location.search);
const petName = params.get('petName') || "Selected Pet";
const petId = params.get('petId') || "000";
const petPrice = params.get('price') || "150.00";

const displayEl = document.getElementById('displayPetName');
if(displayEl) displayEl.textContent = petName;

const priceDisplay = document.getElementById('displayPetPrice');
if(priceDisplay) priceDisplay.innerText = `$${petPrice}`;

const totalEl = document.getElementById('displayTotal');
    if (totalEl) totalEl.innerText = `$${petPrice}`;

window.processManualPayment = async function(e) {
    e.preventDefault();
    const btn = document.getElementById('payBtn');
    if(payBtn) payBtn.innerHTML = `<i class="bi bi-lock-fill"></i> Pay $${petPrice} Securely`;
    const user = auth.currentUser;

    if (!user) {
        alert("Session expired. Please sign in again.");
        return;
    }

    btn.disabled = true;
    btn.classList.add('btn-processing');
    btn.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span class="ms-2">Verifying with Bank...</span>
    `;

    try {
       
        await new Promise(resolve => setTimeout(resolve, 3000));

        const cvvInput = e.target.querySelector('input[placeholder="CVV"]');
        if (cvvInput && cvvInput.value === "000") {
            throw new Error("Declined: Insufficient Funds");
        }

        const userBookingsRef = ref(db, `users/${user.uid}/bookings`);
const newRecordRef = push(userBookingsRef);
        const globalStatusRef = ref(db, `petStatus/${petId}`);
await set(globalStatusRef, { sold: true, owner: user.uid });

        await Promise.all([
        set(newRecordRef, {
            serviceType: 'Purchase', // This triggers the card in your dashboard
            petId: petId,
            petName: petName,
            amountPaid: `$${petPrice}`,
            dateBooked: new Date().toISOString(),
            status: "Completed"
        }),
        set(globalStatusRef, { 
            sold: true, 
            owner: user.uid 
        })
    ]);

    console.log("Purchase successful!");
        showSuccessUI();

    } catch (error) {
        console.error(error);
        alert("Payment Failed: " + error.message);
        
        btn.disabled = false;
        btn.classList.remove('btn-processing');
        btn.innerHTML = `<i class="bi bi-lock-fill"></i> <span>Complete Secure Adoption</span>`;
    }
};

function showSuccessUI() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#31908e', '#FFD700', '#ffffff'] 
        });
    }
    document.body.innerHTML = `
        <div class="container text-center py-5" style="margin-top: 100px;">
            <div class="py-5 shadow-sm bg-white rounded-4">
                <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
                <h1 class="mt-4 fw-bold text-gp-navy">Adoption Confirmed!</h1>
                <p class="lead">Congratulations! <strong>${petName}</strong> is officially part of your family.</p>
                <p class="text-muted">A receipt and adoption certificate have been added to your account.</p>
                <div class="mt-4">
                    <a href="../dashboard/dashboard.html" class="btn btn-gp-teal px-5 py-2 rounded-pill shadow-sm">
                        Go to My Dashboard
                    </a>
                </div>
            </div>
        </div>
    `;
}