// Initialize Firebase App (Ensure this matches your firebaseConfig setup)
// Get references to Firebase services
const auth = firebase.auth();
const db = firebase.firestore(); // Add this line to use Firestore

// Function to show messages (replace with your implementation)
function showMsg(message) {
    alert(message);
}

// Handle form submission for user registration
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const role = document.getElementById('userRole').value;
    
    // Register user with Firebase Auth
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User registered successfully
            const user = userCredential.user;
            console.log("User registered:", user);
            
            // Add user data to Firestore
            return db.collection('users').doc(user.uid).set({
                firstName: firstName,
                lastName: lastName,
                email: email,
                role: role
            });
        })
        .then(() => {
            showMsg("Registration successful!");
            document.getElementById('registrationForm').reset(); // Reset form fields
            
            // Redirect based on role
            switch(role) {
                case 'admin':
                    window.location.href = 'Admin.html';
                    break;
                case 'doctor':
                    window.location.href = 'doctors.html';
                    break;
                case 'patient':
                    window.location.href = 'Patient.html';
                    break;
                default:
                    console.error("Unknown role");
            }
        })
        .catch((error) => {
            // Handle errors
            console.error("Registration failed:", error.message);
            showMsg("Registration failed: " + error.message);
        });
});