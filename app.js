// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => console.log('Service Worker Registered'))
      .catch(err => console.log('Service Worker Registration Failed', err));
  });
}

console.log("App.js is working...");

let deferredPrompt;

// Wait for HTML to fully load
window.addEventListener('DOMContentLoaded', () => {

  const installBtn = document.getElementById('install-btn');

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log("beforeinstallprompt event fired");

    // Stop the browser from auto-showing the banner
    e.preventDefault();

    // Save the event for later
    deferredPrompt = e;

    if (installBtn) {
      installBtn.style.display = 'block';
      console.log("Install Button Shown");
    } else {
      console.log("Install Button Not Found");
    }

    installBtn.addEventListener('click', () => {
      installBtn.style.display = 'none';

      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
      });
    });
  });
});
