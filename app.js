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
  const shortcutBtn = document.getElementById('shortcut-btn');
  
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
      
      if (shortcutBtn) {
        shortcutBtn.style.display = 'none';
      }
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
    installBtn.textContent = 'Install (Standard)';
    installNotes.textContent = 'Choose your installation method';
  
    if (shortcutBtn) {
      shortcutBtn.style.display = 'block';
    }
  }

  if (shortcutBtn) {
    shortcutBtn.addEventListener('click', () => {
      window.location.href = 'https://www.icloud.com/shortcuts/16006642c5194a6ab9b08bb332f905cd';
    });
  }

function adjustInstallUIForPlatform() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const shortcutBtn = document.getElementById('shortcut-btn');
  const shortcutInfo = document.querySelector('.shortcut-info');
  
  if (isIOS) {
 
    if (shortcutBtn) shortcutBtn.style.display = 'block';
    if (shortcutInfo) shortcutInfo.style.display = 'flex';
  } else {
  
    if (shortcutBtn) shortcutBtn.style.display = 'none';
    if (shortcutInfo) shortcutInfo.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', adjustInstallUIForPlatform);

  const copyUrlBtn = document.getElementById('copy-url-btn');
  if (copyUrlBtn) {
    copyUrlBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          copyUrlBtn.textContent = 'URL Copied!';
          setTimeout(() => {
            copyUrlBtn.textContent = 'Copy URL';
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy URL: ', err);
        });
    });
  }

  window.addEventListener('appinstalled', () => {
    console.log('App was installed');
    if (installContainer) {
      installContainer.style.display = 'none';
    }
  });
});