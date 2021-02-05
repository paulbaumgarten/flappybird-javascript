const SERVICE_WORKER = '/service-worker.js';
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        console.log("Registering service-worker.js");
        navigator.serviceWorker.register(SERVICE_WORKER).then(function(registration) {
            console.log('Registration successful, scope is:', registration.scope);
        })
        .catch(function(error) {
            console.log('Service worker registration failed, error:', error);
        });
    } else {
        console.log("Browser is not compatible with service workers.")
    }
}

window.onload = registerServiceWorker;
