import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCfqYzqCOHstSBknXzG8nwMB7QBL29ZE50",
  authDomain: "auto-ism-c8581.firebaseapp.com",
  projectId: "auto-ism-c8581",
  storageBucket: "auto-ism-c8581.firebasestorage.app",
  messagingSenderId: "582012860743",
  appId: "1:582012860743:web:9f79a2c9c0fe06afda7462",
  measurementId: "G-39NKX5GZRQ"
};

// Analytics is intentionally not initialized here: getAnalytics() performs a
// network call to fetch remote config and can throw/hang when blocked by an
// ad-blocker or privacy extension, which was breaking auth (login/register/
// email verification) since this module failed to finish loading.
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Where Firebase action emails (verification, password reset) should send
// the user back to after they click the link in their email.
export const authActionSettings = {
  url: `${window.location.origin}/login`,
  handleCodeInApp: false,
};
