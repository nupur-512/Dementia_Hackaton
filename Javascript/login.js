document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('.reg-page');

  loginForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the form from submitting the traditional way

      const email = loginForm['userid'].value;
      const password = loginForm['usrpsw'].value;

      firebase.auth().signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
              // Signed in successfully
              const user = userCredential.user;
              const db = firebase.firestore();

              // Function to check the user's role
              const checkUserRole = (collectionName, redirectPage) => {
                  return db.collection(collectionName).doc(user.uid).get()
                      .then((doc) => {
                          if (doc.exists) {
                              window.location.href = redirectPage;
                              return true; // Role found, stop further checks
                          }
                          return false;
                      });
              };

              // Check in each collection
              checkUserRole('doctors', 'Doctor.html')
                  .then((found) => {
                      if (!found) return checkUserRole('admins', 'Admin.html');
                  })
                  .then((found) => {
                      if (!found) return checkUserRole('patients', 'Patient.html');
                  })
                  .catch((error) => {
                      console.error('Error checking user role:', error);
                  });
          })
          .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.error('Error during sign in:', errorCode, errorMessage);
          });
  });
});
