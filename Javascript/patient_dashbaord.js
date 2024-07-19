// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const storage = firebase.storage();

document.addEventListener('DOMContentLoaded', function() {
    const userId = 'USER_ID'; // Replace with dynamic user ID retrieval

    // Handle Prescription Upload
    const prescriptionForm = document.getElementById('prescription-form');
    prescriptionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const fileInput = document.getElementById('prescription-file');
        const file = fileInput.files[0];

        if (file) {
            const storageRef = storage.ref(`prescriptions/${userId}/${file.name}`);
            const uploadTask = storageRef.put(file);

            uploadTask.on('state_changed',
                function(snapshot) {
                    // Progress
                },
                function(error) {
                    // Error
                    document.getElementById('upload-status').textContent = `Upload failed: ${error.message}`;
                },
                function() {
                    // Success
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        document.getElementById('upload-status').textContent = `File available at ${downloadURL}`;
                    });
                }
            );
        } else {
            document.getElementById('upload-status').textContent = 'No file selected';
        }
    });

    // Handle Appointment Booking
    const appointmentForm = document.getElementById('appointment-form');
    appointmentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;

        if (date && time) {
            const appointmentData = {
                date: date,
                time: time,
                status: 'Scheduled' // Default status
            };

            firestore.collection('patients').doc(userId).collection('appointments').add(appointmentData)
                .then(() => {
                    document.getElementById('appointment-status').textContent = 'Appointment booked successfully';
                })
                .catch((error) => {
                    document.getElementById('appointment-status').textContent = `Error booking appointment: ${error.message}`;
                });
        } else {
            document.getElementById('appointment-status').textContent = 'Please fill in all fields';
        }
    });
});
