// script.js
document.addEventListener('DOMContentLoaded', function() {
    const appointmentsContainer = document.getElementById('appointments');

    // Example appointments for a specific day
    const appointments = [
        { time: '09:00 AM', patient: 'John Doe', reason: 'Check-up' },
        { time: '10:30 AM', patient: 'Jane Smith', reason: 'Consultation' },
        { time: '02:00 PM', patient: 'Michael Johnson', reason: 'Follow-up' }
        // Add more appointments as needed
    ];

    // Generate HTML for each appointment
    appointments.forEach(appointment => {
        const appointmentHTML = `<div class="appointment">
                                    <h3>${appointment.time}</h3>
                                    <p><strong>Patient:</strong> ${appointment.patient}</p>
                                    <p><strong>Reason:</strong> ${appointment.reason}</p>
                                 </div>`;

        appointmentsContainer.innerHTML += appointmentHTML;
    });
});
