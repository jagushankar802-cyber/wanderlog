// ==========================================
// WANDERLOG - TRIP CRUD
// CREATE + READ
// ==========================================

const tripForm = document.getElementById("trip-form");
const destinationsGrid = document.getElementById("destinations-grid");
const emptyState = document.getElementById("empty-state");
const tripCount = document.querySelector(".trip-count span");


// ==========================================
// LOAD TRIPS FROM LOCAL STORAGE
// ==========================================

let trips = JSON.parse(localStorage.getItem("wanderlogTrips")) || [];


// ==========================================
// SAVE TRIPS TO LOCAL STORAGE
// ==========================================

function saveTrips() {
    localStorage.setItem("wanderlogTrips", JSON.stringify(trips));
}


// ==========================================
// CREATE TRIP
// ==========================================

if (tripForm) {

    tripForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const title = document.getElementById("trip-title").value.trim();
        const destination = document.getElementById("trip-destination").value.trim();
        const date = document.getElementById("trip-date").value;
        const notes = document.getElementById("trip-notes").value.trim();


        // Required-field validation

        if (!title || !destination || !date) {

            alert("Please fill in all required fields.");

            return;
        }


        // Create new trip object

        const newTrip = {
            id: Date.now(),
            title: title,
            destination: destination,
            date: date,
            notes: notes,
            coverImage: "assets/travel.png"
        };


        // Add trip to array

        trips.push(newTrip);


        // Save to localStorage

        saveTrips();


        // Update the page

        renderTrips();


        // Clear form

        tripForm.reset();


        // Scroll to saved trips

        document
            .querySelector(".saved-trips-section")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

}


// ==========================================
// READ / DISPLAY TRIPS
// ==========================================

function renderTrips() {

    if (!destinationsGrid) {
        return;
    }


    // Clear existing cards

    destinationsGrid.innerHTML = "";


    // Update trip counter

    if (tripCount) {
        tripCount.textContent =
            String(trips.length).padStart(2, "0");
    }


    // Show empty state

    if (trips.length === 0) {

        emptyState.style.display = "block";

        return;
    }


    // Hide empty state

    emptyState.style.display = "none";


    // Create cards

    trips.forEach(function (trip) {

        const card = document.createElement("article");

        card.className = "destination-card-item";


        card.innerHTML = `
            <img
                src="${trip.coverImage}"
                alt="${trip.destination}"
            >

            <div class="destination-card-content">

                <span class="card-date">
                    ${formatDate(trip.date)}
                </span>

                <h3>
                    ${trip.title}
                </h3>

                <p class="card-destination">
                    ● ${trip.destination}
                </p>

                ${
                    trip.notes
                        ? `<p class="card-notes">${trip.notes}</p>`
                        : ""
                }

            </div>
        `;


        destinationsGrid.appendChild(card);

    });

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

}


// ==========================================
// INITIAL RENDER
// ==========================================

renderTrips();