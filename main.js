// ---------------------- GOOGLE MAPS ----------------------
let map, marker;

// Make initMap global so Google Maps callback can find it
window.initMap = function () {
  const defaultLocation = { lat: 19.0760, lng: 72.8777 }; // Mumbai center

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 12,
  });

  marker = new google.maps.Marker({
    position: defaultLocation,
    map: map,
    draggable: true,
  });

  // Update hidden fields when marker is dragged
  google.maps.event.addListener(marker, "dragend", function () {
    document.getElementById("latitude").value = marker.getPosition().lat();
    document.getElementById("longitude").value = marker.getPosition().lng();
  });

  // Set hidden fields initially
  document.getElementById("latitude").value = defaultLocation.lat;
  document.getElementById("longitude").value = defaultLocation.lng;

  // Update marker on map click
  map.addListener("click", (e) => {
    marker.setPosition(e.latLng);
    document.getElementById("latitude").value = e.latLng.lat();
    document.getElementById("longitude").value = e.latLng.lng();
  });
};
// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config (do NOT change values)
const firebaseConfig = {
  apiKey: "AIzaSyCeFRlL12lMzSZRFDl4VsSxqCylkPQgE_8",
  authDomain: "norse-sequence-467517-g4.firebaseapp.com",
  projectId: "norse-sequence-467517-g4",
  storageBucket: "norse-sequence-467517-g4.firebasestorage.app",
  messagingSenderId: "299341003402",
  appId: "1:299341003402:web:bdd5124dc49b4f8b808b73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Select form fields
const machineName = document.getElementById("machineName");
const address = document.getElementById("address");
const insurancePolicyNo = document.getElementById("insurancePolicyNo");
const fitnessValidity = document.getElementById("fitnessValidity");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");

// ---------------------- GOOGLE MAPS ----------------------
let map, marker;

window.initMap = function () {
  const defaultLocation = { lat: 19.0760, lng: 72.8777 }; // Mumbai center

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 12,
  });

  marker = new google.maps.Marker({
    position: defaultLocation,
    map: map,
    draggable: true,
  });

  // Update hidden fields when marker is dragged
  google.maps.event.addListener(marker, "dragend", function () {
    latitudeInput.value = marker.getPosition().lat();
    longitudeInput.value = marker.getPosition().lng();
  });

  // Set hidden fields initially
  latitudeInput.value = defaultLocation.lat;
  longitudeInput.value = defaultLocation.lng;

  // Update marker on map click
  map.addListener("click", (e) => {
    marker.setPosition(e.latLng);
    latitudeInput.value = e.latLng.lat();
    longitudeInput.value = e.latLng.lng();
  });
};

// ---------------------- LOAD MACHINES ----------------------
function loadMachinesLive() {
  const grid = document.querySelector(".machines-grid");
  if (!grid) return;

  const machinesQuery = query(
    collection(db, "machines"),
    orderBy("createdAt", "desc") // newest first
  );

  onSnapshot(machinesQuery, (snapshot) => {
    let html = "";

    snapshot.forEach(doc => {
      const m = doc.data();

      const dateString = m.createdAt
        ? new Date(m.createdAt.seconds * 1000).toLocaleString()
        : "";

      html += `
        <div class="machine-card">
          <div class="machine-img">🚜</div>
          <div class="machine-info">
            <div class="machine-title">${m.machineName || "Machine"}</div>
            <div class="machine-meta">
              <span>${m.address || "Address not available"}</span><br>
              <small>Added on: ${dateString}</small>
            </div>
            <p>
              Insurance No: ${m.insurancePolicyNo || "N/A"}<br>
              Fitness Validity: ${m.fitnessValidity || "N/A"}<br>
              Location: ${m.latitude || ""}, ${m.longitude || ""}
            </p>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html || "No machines available";
  });
}
loadMachinesLive();

// ---------------------- ADD MACHINE ----------------------
document.getElementById("machineForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!machineName.value || !address.value) {
    alert("Please fill in at least machine name and address.");
    return;
  }

  await addDoc(collection(db, "machines"), {
    machineName: machineName.value,
    address: address.value,
    insurancePolicyNo: insurancePolicyNo.value,
    fitnessValidity: fitnessValidity.value,
    latitude: parseFloat(latitudeInput.value),
    longitude: parseFloat(longitudeInput.value),
    createdAt: new Date() // timestamp
  });

  e.target.reset();

  // Reset map marker to default after submission
  if (marker && map) {
    const defaultLocation = { lat: 19.0760, lng: 72.8777 };
    marker.setPosition(defaultLocation);
    map.setCenter(defaultLocation);
    latitudeInput.value = defaultLocation.lat;
    longitudeInput.value = defaultLocation.lng;
  }
});
