// ================================================
// Firebase Integration Module (CDN ES Modules)
// ml-30day-dashboard / firebase.js
// ================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── Firebase Config ──────────────────────────────────────────
const firebaseConfig = {
    apiKey: "AIzaSyBCnVinQMfm-3AIYtlDB9I-RYlpVlfFbKU",
    authDomain: "daysml-4abb2.firebaseapp.com",
    projectId: "daysml-4abb2",
    storageBucket: "daysml-4abb2.firebasestorage.app",
    messagingSenderId: "217813205993",
    appId: "1:217813205993:web:1f3d343dce346249000178",
    measurementId: "G-SWK6VQ879X"
};

// ── Initialize Firebase ──────────────────────────────────────
const firebaseApp = initializeApp(firebaseConfig);
const analytics  = getAnalytics(firebaseApp);
const db         = getFirestore(firebaseApp);

// ── Anonymous User ID ────────────────────────────────────────
// Generates a stable ID stored in localStorage so progress is
// tied to the same browser session without needing sign-in.
export function getUserId() {
    let uid = localStorage.getItem("ml_tracker_uid");
    if (!uid) {
        const rand = () => Math.random().toString(36).substring(2);
        uid = "user_" + rand() + rand();
        localStorage.setItem("ml_tracker_uid", uid);
    }
    return uid;
}

// ── Firestore Helpers ────────────────────────────────────────

/**
 * Load progress state from Firestore.
 * Returns the saved state object, or null if not found / on error.
 */
export async function loadFromFirestore() {
    try {
        const uid    = getUserId();
        const docRef = doc(db, "ml_progress", uid);
        const snap   = await getDoc(docRef);
        if (snap.exists()) {
            return snap.data().state || null;
        }
        return null;
    } catch (err) {
        console.warn("[Firebase] Load failed — using local data:", err.message);
        return null;
    }
}

/**
 * Save progress state to Firestore.
 * Silently falls back if offline or rules block access.
 */
export async function saveToFirestore(state) {
    try {
        const uid    = getUserId();
        const docRef = doc(db, "ml_progress", uid);
        await setDoc(docRef, {
            state,
            updatedAt: new Date().toISOString(),
            userId: uid
        });
        return true;
    } catch (err) {
        console.warn("[Firebase] Save failed — data kept locally:", err.message);
        return false;
    }
}

/**
 * Log a named analytics event.
 */
export function trackEvent(name, params = {}) {
    try {
        logEvent(analytics, name, params);
    } catch (_) {}
}

export { analytics };
