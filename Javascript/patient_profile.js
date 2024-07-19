// Initialize Firebase app (if not already done in firebase_config.js)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get auth, firestore, and storage instances
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

document.getElementById('patientProfileForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert("User is not authenticated!");
        return;
    }

    // Retrieve form values with checks
    const healthIdentifier = document.getElementById('healthIdentifier').value;
    const age = document.getElementById('age').value;
    const dementiaType = document.getElementById('dementiaType').value;
    const sexualOrientation = document.getElementById('sexualOrientation').value;
    const addressLine1 = document.getElementById('addressLine1').value;
    const addressLine2 = document.getElementById('addressLine2').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postalCode').value;
    const identificationDoc = document.getElementById('identificationDoc').files[0];

    // Ensure all required fields are populated
    if (!healthIdentifier || !age || !dementiaType || !sexualOrientation || !addressLine1 || !city || !postalCode || !identificationDoc) {
        alert("Please fill out all required fields.");
        return;
    }

    // Upload the document to Firebase Storage
    const storageRef = storage.ref(`identification_docs/${user.uid}/${identificationDoc.name}`);
    storageRef.put(identificationDoc)
        .then(() => storageRef.getDownloadURL())
        .then((downloadURL) => {
            // Save the profile data to Firestore
            return db.collection('patients').doc(user.uid).set({
                healthIdentifier: healthIdentifier,
                age: age,
                dementiaType: dementiaType,
                sexualOrientation: sexualOrientation,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                city: city,
                postalCode: postalCode,
                identificationDocURL: downloadURL
            }, { merge: true }); // Use merge option to update existing fields
        })
        .then(() => {
            console.log("Patient profile updated successfully");
            alert("Profile updated successfully!");
            window.location.href = 'patient_dashbaord.html';
        })
        .catch((error) => {
            console.error("Error updating profile:", error.message);
            alert("Error updating profile: " + error.message);
        });
});
