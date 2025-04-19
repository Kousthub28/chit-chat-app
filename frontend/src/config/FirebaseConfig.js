import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJamjfCS9ofXEusiU4FnjbBkCQuvBaWss",
  authDomain: "chat-app-341fc.firebaseapp.com",
  projectId: "chat-app-341fc",
  storageBucket: "chat-app-341fc.appspot.com",
  messagingSenderId: "998141759675",
  appId: "1:998141759675:web:f1059ec3c53f8b96a6999e",
  measurementId: "G-RFL4GM6RZB",
};
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
