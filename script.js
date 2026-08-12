// ==========================================
// WANDERLOG - TRIP CRUD
// CREATE • READ • UPDATE • DELETE
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const tripForm = document.getElementById("trip-form");
const destinationsGrid = document.getElementById("destinations-grid");
const emptyState = document.getElementById("empty-state");
const tripCount = document.querySelector(".trip-count span");


// ==========================================
// TRIP DATA
// ==========================================

let trips = JSON.parse(
    localStorage.getItem("wanderlogTrips")
) || [];

let editingTripId = null;


// ==========================================
// DESTINATION IMAGES
// ==========================================

function getDestinationImage(destination) {

    const place = destination.toLowerCase();

    const images = {

        goa:
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",

        bali:
            "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",

        paris:
            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",

        london:
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80",

        dubai:
            "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",

        newyork:
            "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=80",

        tokyo:
            "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",

        singapore:
            "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80",

        mumbai:
            "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80",

        manali:
            "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80",

        kerala:
            "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80",

        jaipur:
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80",

        maldives:
            "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80"

    };


    // Check whether destination matches a known place

    for (const placeName in images) {

        if (place.includes(placeName)) {
            return images[placeName];
        }

    }


    // Default travel image

    return "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80";
}


// ==========================================
// LOCAL STORAGE
// ==========================================

function saveTrips() {

    localStorage.setItem(
        "wanderlogTrips",
        JSON.stringify(trips)
    );

}


// ==========================================
// FORM SUBMISSION
// CREATE + UPDATE
// ==========================================

if (tripForm) {

    tripForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const title = document
                .getElementById("trip-title")
                .value
                .trim();


            const destination = document
                .getElementById("trip-destination")
                .value
                .trim();


            const date = document
                .getElementById("trip-date")
                .value;


            const notes = document
                .getElementById("trip-notes")
                .value
                .trim();


            // ==================================
            // VALIDATION
            // ==================================

            if (!title || !destination || !date) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            // ==================================
            // UPDATE EXISTING TRIP
            // ==================================

            if (editingTripId !== null) {

                const tripIndex = trips.findIndex(
                    function (trip) {
                        return trip.id === editingTripId;
                    }
                );


                if (tripIndex !== -1) {

                    trips[tripIndex].title = title;

                    trips[tripIndex].destination =
                        destination;

                    trips[tripIndex].date = date;

                    trips[tripIndex].notes = notes;

                    // Update image if destination changes

                    trips[tripIndex].coverImage =
                        getDestinationImage(
                            destination
                        );


                    saveTrips();

                    editingTripId = null;

                    resetForm();

                    renderTrips();

                }

                return;
            }


            // ==================================
            // CREATE NEW TRIP
            // ==================================

            const newTrip = {

                id: Date.now(),

                title: title,

                destination: destination,

                date: date,

                notes: notes,

                coverImage:
                    getDestinationImage(
                        destination
                    )

            };


            trips.push(newTrip);


            // Save to localStorage

            saveTrips();


            // Reset form

            resetForm();


            // Update cards

            renderTrips();

        }
    );

}


// ==========================================
// EDIT TRIP
// ==========================================

function editTrip(id) {

    const trip = trips.find(
        function (trip) {
            return trip.id === id;
        }
    );


    if (!trip) {
        return;
    }


    // Fill form with existing data

    document.getElementById(
        "trip-title"
    ).value = trip.title;


    document.getElementById(
        "trip-destination"
    ).value = trip.destination;


    document.getElementById(
        "trip-date"
    ).value = trip.date;


    document.getElementById(
        "trip-notes"
    ).value = trip.notes;


    // Store ID of trip being edited

    editingTripId = id;


    // Change button text

    const saveButton =
        document.querySelector(
            ".save-trip-button"
        );


    saveButton.innerHTML =
        'Update Trip <span>→</span>';


    // Scroll to form

    document
        .querySelector(".add-trip-section")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ==========================================
// DELETE TRIP
// ==========================================

function deleteTrip(id) {

    const trip = trips.find(
        function (trip) {
            return trip.id === id;
        }
    );


    if (!trip) {
        return;
    }


    // Confirmation

    const confirmed = confirm(
        `Are you sure you want to delete "${trip.title}"?`
    );


    if (!confirmed) {
        return;
    }


    // Remove selected trip

    trips = trips.filter(
        function (trip) {
            return trip.id !== id;
        }
    );


    // Save updated list

    saveTrips();


    // Re-render cards

    renderTrips();

}


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

    tripForm.reset();

    editingTripId = null;


    const saveButton =
        document.querySelector(
            ".save-trip-button"
        );


    saveButton.innerHTML =
        'Save Trip <span>→</span>';

}


// ==========================================
// RENDER TRIPS
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
            String(trips.length)
                .padStart(2, "0");

    }


    // ==================================
    // EMPTY STATE
    // ==================================

    if (trips.length === 0) {

        emptyState.style.display = "block";

        return;
    }


    emptyState.style.display = "none";


    // ==================================
    // CREATE CARDS DYNAMICALLY
    // ==================================

    trips.forEach(
        function (trip) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "destination-card-item";


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
                            ? `
                                <p class="card-notes">
                                    ${trip.notes}
                                </p>
                            `
                            : ""
                    }

                    <div class="card-actions">

                        <button
                            class="edit-button"
                            onclick="editTrip(${trip.id})"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-button"
                            onclick="deleteTrip(${trip.id})"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            `;


            destinationsGrid.appendChild(card);

        }
    );

}


// ==========================================
// DATE FORMATTER
// ==========================================

function formatDate(dateString) {

    const date = new Date(dateString);


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// ==========================================
// INITIAL LOAD
// ==========================================

renderTrips();