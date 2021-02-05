console.log('Service Worker Loaded');

const channel = new BroadcastChannel('sw-messages');

self.addEventListener('push', e => {
  const data = e.data.json();
  
  console.log('Push Received');
  console.log(data);

  channel.postMessage(data);
});
