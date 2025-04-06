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
      showShortcutInstructions();
    });
  }

  function showShortcutInstructions() {
    const appInfo = {
      name: 'Action App',
      url: 'https://action-app.vercel.app/',
      icon: 'https://action-app.vercel.app/images/Action-logo.png'
    };
  
    installNotes.innerHTML = `
      <div style="text-align: left; padding: 10px; background-color: #f5f5f5; color: #333; border-radius: 8px; margin-bottom: 10px;">
        <strong>1.</strong> Tap the Action App icon below and "Save Image"<br>
        <strong>2.</strong> Tap "Use Shortcuts" again to install
      </div>
    `;
  
    shortcutBtn.textContent = "Use Shortcuts";
    shortcutBtn.onclick = function() {
      window.location.href = `shortcuts://create-shortcut?name=${encodeURIComponent(appInfo.name)}&url=${encodeURIComponent(appInfo.url)}&icon=${encodeURIComponent(appInfo.icon)}`;
    };
  }
  
  document.getElementById('app-icon').addEventListener('click', function() {
  });
  

  function adjustInstallUIForPlatform() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isWindows = navigator.platform.indexOf('Win') > -1;
    const shortcutBtn = document.getElementById('shortcut-btn');
    const shortcutInfo = document.querySelector('.shortcut-info');
    const installContainer = document.querySelector('.install');
    
    if (installContainer) {
      installContainer.style.position = 'fixed';
      installContainer.style.bottom = '20px';
      installContainer.style.left = '50%';
      installContainer.style.transform = 'translateX(-50%)';
      installContainer.style.zIndex = '1000';
    }
    
    if (isIOS) {
      if (shortcutBtn) shortcutBtn.style.display = 'block';
      if (shortcutInfo) shortcutInfo.style.display = 'flex';
      if (installContainer) installContainer.style.display = 'flex';
    } else if (isWindows || 'standalone' in navigator || window.matchMedia('(display-mode: standalone)').matches) {
      if (installContainer) installContainer.style.display = 'none';
    }
  }
d
  adjustInstallUIForPlatform();

  const copyUrlBtn = document.getElementById('copy-url-btn');
  if (copyUrlBtn) {
    copyUrlBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('https://action-app.vercel.app/')
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
  
  const closeInstallBtn = document.createElement('button');
  closeInstallBtn.innerHTML = '✕';
  closeInstallBtn.style.position = 'absolute';
  closeInstallBtn.style.top = '5px';
  closeInstallBtn.style.right = '5px';
  closeInstallBtn.style.background = 'none';
  closeInstallBtn.style.border = 'none';
  closeInstallBtn.style.fontSize = '16px';
  closeInstallBtn.style.cursor = 'pointer';
  closeInstallBtn.style.color = '#666';
  
  if (installContainer) {
    installContainer.style.position = 'relative';
    installContainer.appendChild(closeInstallBtn);
    
    closeInstallBtn.addEventListener('click', () => {
      installContainer.style.display = 'none';
    });
  }
});