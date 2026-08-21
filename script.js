// ==========================================
// WANDERLOG - WEEK 3
// TRIPS + PHOTO UPLOAD + FILEREADER
// ==========================================

console.log("WANDERLOG SCRIPT LOADED");

const tripForm = document.getElementById("trip-form");
const destinationsGrid = document.getElementById("destinations-grid");
const emptyState = document.getElementById("empty-state");
const tripCount = document.querySelector(".trip-count span");

let trips = JSON.parse(
    localStorage.getItem("wanderlogTrips") || "[]"
);

let editingTripId = null;
let selectedImage = null;


// ==========================================
// PHOTO ELEMENTS
// ==========================================

const photoInput =
    document.getElementById("trip-photo");

const photoPreview =
    document.getElementById("photo-preview");

const previewImage =
    document.getElementById("preview-image");


// ==========================================
// COMPRESS IMAGE
// ==========================================

function compressImage(file) {

    return new Promise(function(resolve) {

        const reader = new FileReader();

        reader.onload = function(event) {

            const img = new Image();

            img.onload = function() {

                const canvas =
                    document.createElement("canvas");

                const maxWidth = 900;
                const maxHeight = 600;

                let width = img.width;
                let height = img.height;


                if (width > maxWidth) {

                    height =
                        height * (maxWidth / width);

                    width = maxWidth;
                }


                if (height > maxHeight) {

                    width =
                        width * (maxHeight / height);

                    height = maxHeight;
                }


                canvas.width = width;
                canvas.height = height;


                const ctx =
                    canvas.getContext("2d");

                ctx.drawImage(
                    img,
                    0,
                    0,
                    width,
                    height
                );


                resolve(
                    canvas.toDataURL(
                        "image/jpeg",
                        0.65
                    )
                );
            };


            img.src = event.target.result;
        };


        reader.readAsDataURL(file);

    });
}


// ==========================================
// PHOTO PREVIEW
// ==========================================

if (photoInput) {

    photoInput.addEventListener(
        "change",
        async function() {

            const file =
                photoInput.files[0];

            if (!file) {
                return;
            }


            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select an image file."
                );

                photoInput.value = "";

                return;
            }


            selectedImage =
                await compressImage(file);


            if (previewImage) {

                previewImage.src =
                    selectedImage;
            }


            if (photoPreview) {

                photoPreview.style.display =
                    "block";
            }

        }
    );
}


// ==========================================
// FORM SUBMIT
// ==========================================

if (tripForm) {

    tripForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const title =
                document
                    .getElementById("trip-title")
                    .value
                    .trim();


            const destination =
                document
                    .getElementById("trip-destination")
                    .value
                    .trim();


            const date =
                document
                    .getElementById("trip-date")
                    .value;


            const notes =
                document
                    .getElementById("trip-notes")
                    .value
                    .trim();


            if (!title || !destination || !date) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            // ==================================
            // EDIT EXISTING TRIP
            // ==================================

            if (editingTripId !== null) {

                const index =
                    trips.findIndex(
                        trip =>
                            trip.id === editingTripId
                    );


                if (index !== -1) {

                    trips[index].title =
                        title;

                    trips[index].destination =
                        destination;

                    trips[index].date =
                        date;

                    trips[index].notes =
                        notes;


                    if (selectedImage) {

                        trips[index].coverImage =
                            selectedImage;
                    }


                    if (!saveTrips()) {
                        return;
                    }


                    resetForm();

                    renderTrips();

                    return;
                }
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
                    selectedImage ||
                    getDestinationImage(
                        destination
                    )
            };


            trips.push(newTrip);


            if (!saveTrips()) {

                trips.pop();

                return;
            }


            resetForm();

            renderTrips();

        }
    );
}


// ==========================================
// SAVE TO LOCAL STORAGE
// ==========================================

function saveTrips() {

    try {

        localStorage.setItem(
            "wanderlogTrips",
            JSON.stringify(trips)
        );

        return true;

    } catch (error) {

        console.error(
            "Could not save trip:",
            error
        );


        alert(
            "Trip could not be saved. Please use a smaller image."
        );


        return false;
    }
}


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

    if (tripForm) {

        tripForm.reset();
    }


    editingTripId = null;

    selectedImage = null;


    if (photoPreview) {

        photoPreview.style.display =
            "none";
    }


    if (previewImage) {

        previewImage.src = "";
    }


    const saveButton =
        document.querySelector(
            ".save-trip-button"
        );


    if (saveButton) {

        saveButton.innerHTML =
            "Save Trip <span>→</span>";
    }
}


// ==========================================
// EDIT TRIP
// ==========================================

function editTrip(id) {

    const trip =
        trips.find(
            trip => trip.id === id
        );


    if (!trip) {
        return;
    }


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
    ).value = trip.notes || "";


    editingTripId = id;


    selectedImage =
        trip.coverImage || null;


    if (
        selectedImage &&
        previewImage &&
        photoPreview
    ) {

        previewImage.src =
            selectedImage;

        photoPreview.style.display =
            "block";
    }


    const saveButton =
        document.querySelector(
            ".save-trip-button"
        );


    if (saveButton) {

        saveButton.innerHTML =
            "Update Trip <span>→</span>";
    }


    const addTripSection =
        document.querySelector(
            ".add-trip-section"
        );


    if (addTripSection) {

        addTripSection.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// ==========================================
// DELETE TRIP
// ==========================================

function deleteTrip(id) {

    const trip =
        trips.find(
            trip => trip.id === id
        );


    if (!trip) {
        return;
    }


    if (
        !confirm(
            `Are you sure you want to delete "${trip.title}"?`
        )
    ) {

        return;
    }


    trips =
        trips.filter(
            trip => trip.id !== id
        );


    saveTrips();

    renderTrips();
}


// ==========================================
// DESTINATION IMAGE
// ==========================================

function getDestinationImage(destination) {

    const place =
        destination.toLowerCase();


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

        tokyo:
            "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",

        mumbai:
            "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80",

        kerala:
            "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80",

        jaipur:
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80"
    };


    for (
        const name in images
    ) {

        if (
            place.includes(name)
        ) {

            return images[name];
        }
    }


    return "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80";
}


// ==========================================
// RENDER TRIPS
// ==========================================

function renderTrips() {

    if (!destinationsGrid) {
        return;
    }


    destinationsGrid.innerHTML = "";


    if (tripCount) {

        tripCount.textContent =
            String(
                trips.length
            ).padStart(2, "0");
    }


    if (trips.length === 0) {

        if (emptyState) {

            emptyState.style.display =
                "block";
        }

        return;
    }


    if (emptyState) {

        emptyState.style.display =
            "none";
    }


    trips.forEach(
        function(trip) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "destination-card-item";


            const image =
                trip.coverImage ||
                getDestinationImage(
                    trip.destination
                );


            card.innerHTML = `

                <img
                    src="${image}"
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


            destinationsGrid.appendChild(
                card
            );

        }
    );
}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(dateString) {

    return new Date(
        dateString
    ).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


// ==========================================
// START
// ==========================================

renderTrips();