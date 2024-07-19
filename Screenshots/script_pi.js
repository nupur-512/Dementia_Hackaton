// script.js
document.addEventListener('DOMContentLoaded', function() {
    const patientsContainer = document.getElementById('patients');

    // Fetch patient information from backend (replace with your actual API endpoint)
    fetch('https://api.example.com/patients', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Add any authentication headers if required
        },
    })
        .then(response => response.json())
        .then(data => {
            // Process the received data (assuming data is an array of patients)
            data.forEach(patient => {
                const patientHTML = `<div class="patient">
                                    <h3>${patient.name}</h3>
                                    <p><strong>Age:</strong> ${patient.age}</p>
                                    <p><strong>Gender:</strong> ${patient.gender}</p>
                                    <p><strong>Contact:</strong> ${patient.contact}</p>
                                    <p><strong>Email:</strong> ${patient.email}</p>
                                    <p><strong>Address:</strong> ${patient.address}</p>
                                 </div>`;

                patientsContainer.innerHTML += patientHTML;
            });
        })
        .catch(error => console.error('Error fetching patients:', error));
});
