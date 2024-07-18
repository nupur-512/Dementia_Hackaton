// Initialize Firebase (make sure this is done in your firebase_config.js or here if not already initialized)
// const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Get elements
const emailInput = document.querySelector('input[name="userid"]');
const passwordInput = document.querySelector('input[name="usrpsw"]');
const loginForm = document.querySelector('.reg-page');

// Login function
function userlogin(event) {
  event.preventDefault();
  
  const email = emailInput.value;
  const password = passwordInput.value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("User logged in:", user);
      
      // Get user role from Firestore
      db.collection('users').doc(user.uid).get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            const role = userData.role;
            
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
                window.location.href = 'index.html';
            }
          } else {
            console.error("No such document!");
            alert("User data not found. Please contact support.");
          }
        })
        .catch((error) => {
          console.error("Error getting user data:", error);
          alert("Error retrieving user data. Please try again.");
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Login error:", errorCode, errorMessage);
      alert("Login failed: " + errorMessage);
    });
}

// Add event listener to the form
loginForm.addEventListener('submit', userlogin);