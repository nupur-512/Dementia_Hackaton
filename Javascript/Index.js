document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.top-buttons .login-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            const target = button.textContent.trim().toLowerCase();

            switch (target) {
                case 'home':
                    window.location.href = 'index.html';
                    break;
                case 'about':
                    window.location.href = 'about.html';
                    break;
                case 'contact':
                    window.location.href = 'contact.html';
                    break;
                case 'login':
                    window.location.href = 'login.html';
                    break;
                case 'register':
                    window.location.href = 'registration.html';
                    break;
                default:
                    console.error('Unknown target:', target);
            }
        });
    });
});
