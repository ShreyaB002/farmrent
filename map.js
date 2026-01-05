import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeFRlL12lMzSZRFDl4VsSxqCylkPQgE_8",
  authDomain: "norse-sequence-467517-g4.firebaseapp.com",
  projectId: "norse-sequence-467517-g4",
  storageBucket: "norse-sequence-467517-g4.firebasestorage.app",
  messagingSenderId: "299341003402",
  appId: "1:299341003402:web:bdd5124dc49b4f8b808b73",
  measurementId: "G-SV6ZEPPTZH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const map = new google.maps.Map(document.getElementById("map"), {
  center: { lat: 19.0760, lng: 72.8777 },
  zoom: 10
});

const querySnapshot = await getDocs(collection(db, "machines"));
querySnapshot.forEach((doc) => {
  const m = doc.data();
  if (m.status === "available") {
    new google.maps.Marker({
      position: { lat: m.lat, lng: m.lng },
      map,
      title: m.name
    });
  }
});
async function getWeather(lat, lng) {
  const API_KEY = "e330a6d3c321b221e1771fb1b6b1ef8b";

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
}

