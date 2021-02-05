const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Set static path
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json())

const publicVapidKey = 'BIDpbNiy6BY_I4cTr7N_s5j7KJDBeYSMGFR3cTIK_0C8YG7T4BcHMNnLQ0qXl82XE3IHc1KKQgwIIz9NukEY3bc';
const privateVapidKey = 'Gh8hMqQuAEj1AsYFCvWHITlT6vLU0-XSy0g63xDs2aM';

webpush.setVapidDetails('mailto:chat@test.com', publicVapidKey, privateVapidKey);

// Subscribe Route
app.post('/subscribe', (req, res) => {
  // Get Push Subscription Object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({title: 'Push Test'});

  // Pass object into send notification
  webpush.sendNotification(subscription, payload).catch(error => console.error(error));
});

// Notify
app.post('/notify', (req, res) => {
  // Get Push Subscription Object
  const subscription = req.body.subscription;

  // Get notification data
  const data = req.body.data;
  const payload = JSON.stringify(data);

  res.status(201).json(data);

  // Pass object into send notification
  webpush.sendNotification(subscription, payload).catch(error => console.error(error));
});

const port = 5000;

app.listen(port, () => console.log('Server started on port: ' + port));
