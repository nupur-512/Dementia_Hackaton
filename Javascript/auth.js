// Initialize Firebase app (if not already done in firebase_config.js)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get auth and firestore instances
const auth = firebase.auth();
const db = firebase.firestore();

document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const role = document.getElementById('userRole').value;

    // Validate password match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Register user with Firebase Auth
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User registered successfully, now add to Firestore
            const user = userCredential.user;
            
            // Determine the collection based on the role
            let collectionName;
            switch (role.toLowerCase()) {
                case 'patient':
                    collectionName = 'patients';
                    break;
                case 'doctor':
                    collectionName = 'doctors';
                    break;
                case 'admin':
                    collectionName = 'admins';
                    break;
                default:
                    throw new Error('Invalid role');
            }

            return db.collection(collectionName).doc(user.uid).set({
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: role
            });
        })
        .then(() => {
            console.log("User registered and data saved to Firestore");
            alert("Registration successful!");
            document.getElementById('registrationForm').reset();
            
            // Redirect based on role
            switch (role.toLowerCase()) {
                case 'patient':
                    window.location.href = 'user_profile_patient.html';
                    break;
                case 'doctor':
                    window.location.href = 'user_profile_doctor.html';
                    break;
                case 'admin':
                    window.location.href = 'user_profile_admin.html';
                    break;
                default:
                    throw new Error('Invalid role');
            }
        })
        .catch((error) => {
            console.error("Registration failed:", error.message);
            alert("Registration failed: " + error.message);
        });
});
