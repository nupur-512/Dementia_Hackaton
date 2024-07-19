document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');

    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            editable: false,
            events: function(fetchInfo, successCallback, failureCallback) {
                const user = firebase.auth().currentUser;
                if (user) {
                    const db = firebase.firestore();
                    db.collection('patients').doc(user.uid).collection('appointments').get()
                        .then((querySnapshot) => {
                            const events = [];
                            querySnapshot.forEach((doc) => {
                                const data = doc.data();
                                events.push({
                                    title: 'Appointment',
                                    start: `${data.date}T${data.time}`,
                                    allDay: false
                                });
                            });
                            successCallback(events);
                        })
                        .catch((error) => {
                            console.error('Error fetching appointments:', error);
                            failureCallback(error);
                        });
                } else {
                    console.error('User not authenticated.');
                }
            }
        });

        calendar.render();
    }
});
