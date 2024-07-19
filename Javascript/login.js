document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.reg-page');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const email = loginForm['userid'].value;
        const password = loginForm['usrpsw'].value;

        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            const db = firebase.firestore();

            // Function to check the user's role
            const checkUserRole = async (collectionName, redirectPage) => {
                const doc = await db.collection(collectionName).doc(user.uid).get();
                if (doc.exists) {
                    window.location.href = redirectPage;
                    return true; // Role found, stop further checks
                }
                return false;
            };

            // Check in each collection
            if (await checkUserRole('doctors', 'doctor_dashbaord.html')) return;
            if (await checkUserRole('admins', 'admin_dashbaord.html')) return;
            if (await checkUserRole('patients', 'patient_dashbaord.html')) return;

            console.error('User role not found.');
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error during sign in:', errorCode, errorMessage);
        }
    });
});
