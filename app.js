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

window.addEventListener('DOMContentLoaded', () => {
  const installBtn = document.getElementById('install-btn');
  const installContainer = document.querySelector('.install');
  const installNotes = document.querySelector('.install-notes');
  
  if (installContainer) {
    installContainer.style.display = 'none';
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log("beforeinstallprompt event fired");

    e.preventDefault();

    deferredPrompt = e;

    if (installContainer) {
      installContainer.style.display = 'flex';
      installNotes.textContent = 'Install Action App to your device';
      console.log("Install Button Shown");
    } else {
      console.log("Install Container Not Found");
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
        });
       
        installContainer.style.display = 'none';
      } else {
        installNotes.innerHTML = 'To install: tap <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48cGF0aCBkPSJNMTUgOGE1IDUgMCAwIDEtNSA1SDV2MkgyYTIgMiAwIDAgMS0yLTJWMmEyIDIgMCAwIDEgMi0yaDhhNSA1IDAgMCAxIDUgNXYxem0tOCAwVjNINnY1aDFtMyAwaDBWM2gtMXY1aDFtMyAwaDBWM2gtMXY1aDEiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjwvc3ZnPg==" style="width: 16px; vertical-align: middle;"> then "Add to Home Screen"';
      }
    });
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  if (isIOS && installContainer) {
    installContainer.style.display = 'flex';
    installBtn.textContent = 'Install App';
    installNotes.textContent = 'Tap "Install App" for instructions';
  }

  window.addEventListener('appinstalled', () => {
    console.log('App was installed');
    if (installContainer) {
      installContainer.style.display = 'none';
    }
  });
});