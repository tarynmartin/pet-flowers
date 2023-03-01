import { } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb_diQmTNrOp9NXD4Dqle9-mi-0GPPFpw",
  authDomain: "pet-flowers-1bc0f.firebaseapp.com",
  projectId: "pet-flowers-1bc0f",
  storageBucket: "pet-flowers-1bc0f.appspot.com",
  messagingSenderId: "780165223451",
  appId: "1:780165223451:web:3c0d21d796e3e759ac94be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of cities from your database
async function getCities(db) {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}

// const data = {
//   name: 'Los Angeles',
//   state: 'CA',
//   country: 'USA'
// };

// Add a new document in collection "cities" with ID 'LA'
// const res = await db.collection('cities').doc('LA').set(data);

export const savePlant = (plant) => await db.collection('plants').doc('scientificName').set(plant);