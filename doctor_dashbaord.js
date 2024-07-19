

document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const healthIdentifierInput = document.getElementById('healthIdentifier');
    const patientInfoContainer = document.getElementById('patientInfo');
    const homeBtn = document.getElementById('homeBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Search button click event
    searchBtn.addEventListener('click', () => {
        const healthIdentifier = healthIdentifierInput.value;
        if (healthIdentifier) {
            fetchPatientInfo(healthIdentifier);
        } else {
            alert('Please enter a health identifier.');
        }
    });

    // Home button click event
    homeBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Logout button click event
    logoutBtn.addEventListener('click', () => {
        firebase.auth().signOut().then(() => {
            window.location.href = 'index.html';
        }).catch(error => {
            console.error('Error during logout:', error);
        });
    });

    function fetchPatientInfo(healthIdentifier) {
        const patientsRef = firebase.db.collection('patients');
        
        // Query to find patient document where healthIdentifier matches
        patientsRef.where('healthIdentifier', '==', healthIdentifier).get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    patientInfoContainer.innerHTML = '<p>No patient found with this identifier.</p>';
                    return;
                }

                // Assuming healthIdentifier is unique, we should get only one document
                const patientDoc = querySnapshot.docs[0];
                const patientData = patientDoc.data();
                const patientInfoHTML = `
                    <h2>${patientData.firstName} ${patientData.lastName}</h2>
                    <p><strong>Health Identifier:</strong> ${patientData.healthIdentifier}</p>
                    <p><strong>Email:</strong> ${patientData.email}</p>
                    <p><strong>Age:</strong> ${patientData.age}</p>
                    <p><strong>Address:</strong> ${patientData.addressLine1}, ${patientData.addressLine2}, ${patientData.city}, ${patientData.postalCode}</p>
                    <p><strong>Dementia Type:</strong> ${patientData.dementiaType}</p>
                    <p><strong>Sexual Orientation:</strong> ${patientData.sexualOrientation}</p>
                    <p><strong>Identification Document:</strong> <a href="${patientData.identificationDocURL}" target="_blank">View Document</a></p>
                `;

                patientInfoContainer.innerHTML = patientInfoHTML;
            })
            .catch(error => {
                console.error('Error fetching patient information:', error);
            });
    }
});
