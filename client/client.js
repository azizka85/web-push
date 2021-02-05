const publicVapidKey = 'BIDpbNiy6BY_I4cTr7N_s5j7KJDBeYSMGFR3cTIK_0C8YG7T4BcHMNnLQ0qXl82XE3IHc1KKQgwIIz9NukEY3bc';

// Check for service worker
if('serviceWorker' in navigator) {
  send().catch(error => console.error(error));  
}

// Register Service Worker, Register Push, Send Push
async function send() {
  // Register Service Worker
  console.log('Registering service worker...');
  
  const register = await navigator.serviceWorker.register('./worker.js', {
    scope: '/'
  });  

  const channel = new BroadcastChannel('sw-messages');
  channel.addEventListener('message', event => {
    document.getElementById('content').innerHTML += `<p>${event.data.title}</p>`;
  });  

  console.log('Service Worker Registered...');

  // Register Push
  console.log('Registering Push...');

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });

  const titleElem = document.getElementById('title');

  document.getElementById('notify').onclick = () => {
    fetch('/notify', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        subscription: subscription,
        data: {
          title: titleElem.value
        }
      })
    })
    .catch(error => console.error(error));
  };

  console.log('Push Registered...');

  // Send Push Notification
  console.log('Sending Push...');

  await fetch('/subscribe', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(subscription)
  });

  console.log('Push Sent...');    
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
