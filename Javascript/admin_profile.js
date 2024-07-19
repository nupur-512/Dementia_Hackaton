// Initialize Firebase app (if not already done in firebase_config.js)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get auth, firestore, and storage instances
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

document.getElementById('adminProfileForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert("User is not authenticated!");
        return;
    }

    // Retrieve form values with checks
    const registrationNoElement = document.getElementById('registrationNo');
    const addressLine1Element = document.getElementById('addressLine1');
    const addressLine2Element = document.getElementById('addressLine2');
    const cityElement = document.getElementById('city');
    const postalCodeElement = document.getElementById('postalCode');
    const qualificationElement = document.getElementById('qualification');
    const identificationDoc = document.getElementById('identificationDoc').files[0];

    // Check if elements exist before accessing values
    const registrationNo = registrationNoElement ? registrationNoElement.value : '';
    const addressLine1 = addressLine1Element ? addressLine1Element.value : '';
    const addressLine2 = addressLine2Element ? addressLine2Element.value : '';
    const city = cityElement ? cityElement.value : '';
    const postalCode = postalCodeElement ? postalCodeElement.value : '';
    const qualification = qualificationElement ? qualificationElement.value : '';

    // Ensure all required fields are populated
    if (!registrationNo || !addressLine1 || !city || !postalCode || !qualification || !identificationDoc) {
        alert("Please fill out all required fields.");
        return;
    }

    // Retrieve user data from Firestore
    db.collection('admins').doc(user.uid).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const firstName = userData.firstName || '';
                const lastName = userData.lastName || '';

                // Upload the document to Firebase Storage
                const storageRef = storage.ref(`identification_docs/${user.uid}/${identificationDoc.name}`);
                return storageRef.put(identificationDoc)
                    .then(() => storageRef.getDownloadURL())
                    .then((downloadURL) => {
                        // Save the profile data to Firestore
                        return db.collection('admins').doc(user.uid).set({
                            firstName: firstName,
                            lastName: lastName,
                            email: user.email,
                            registrationNo: registrationNo,
                            addressLine1: addressLine1,
                            addressLine2: addressLine2,
                            city: city,
                            postalCode: postalCode,
                            qualification: qualification,
                            identificationDocURL: downloadURL
                        }, { merge: true }); // Use merge option to update existing fields
                    })
                    .then(() => {
                        console.log("Admin profile updated successfully");
                        alert("Profile updated successfully!");
                        window.location.href = 'admin_dashbaord.html';
                    })
                    .catch((error) => {
                        console.error("Error updating profile:", error.message);
                        alert("Error updating profile: " + error.message);
                    });
            } else {
                throw new Error('User data not found');
            }
        })
        .catch((error) => {
            console.error("Error fetching user data:", error.message);
            alert("Error fetching user data: " + error.message);
        });
});
