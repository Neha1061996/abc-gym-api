// Filename: server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const moment = require('moment');

app.use(bodyParser.json());

let classes = []; // Stores class instances
let bookings = []; // Stores bookings

// Utility to generate dates between range
function generateDates(startDate, endDate) {
  const dates = [];
  let currentDate = moment(startDate);
  while (currentDate.isSameOrBefore(endDate)) {
    dates.push(currentDate.format('YYYY-MM-DD'));
    currentDate = currentDate.add(1, 'days');
  }
  return dates;
}

// Create Class API
app.post('/api/classes', (req, res) => {
  const { name, startDate, endDate, startTime, duration, capacity } = req.body;

  if (!name || !startDate || !endDate || !startTime || !duration || !capacity) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (capacity < 1) {
    return res.status(400).json({ error: 'Capacity must be at least 1.' });
  }

  if (moment(endDate).isBefore(moment())) {
    return res.status(400).json({ error: 'End date must be in the future.' });
  }

  const dates = generateDates(startDate, endDate);

  dates.forEach(date => {
    classes.push({
      id: `${name}-${date}-${startTime}`,
      name,
      date,
      startTime,
      duration,
      capacity,
      bookings: []
    });
  });

  res.status(201).json({ message: `${dates.length} classes created successfully.` });
});

// Book a Class API
app.post('/api/bookings', (req, res) => {
  const { memberName, className, participationDate } = req.body;

  if (!memberName || !className || !participationDate) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (moment(participationDate).isBefore(moment(), 'day')) {
    return res.status(400).json({ error: 'Participation date must be in the future.' });
  }

  const classInstance = classes.find(
    c => c.name === className && c.date === participationDate
  );

  if (!classInstance) {
    return res.status(404).json({ error: 'Class not found on given date.' });
  }

  if (classInstance.bookings.length >= classInstance.capacity) {
    return res.status(400).json({ error: 'Class capacity full.' });
  }

  const booking = {
    id: `${memberName}-${classInstance.id}`,
    memberName,
    className,
    participationDate,
    startTime: classInstance.startTime,
    bookingDate: moment().format('YYYY-MM-DD')
  };

  classInstance.bookings.push(booking);
  bookings.push(booking);

  res.status(201).json({ message: 'Booking confirmed.', booking });
});

// Search Bookings API
app.get('/api/bookings', (req, res) => {
  const { member, startDate, endDate } = req.query;
  

  let result = bookings;

  if (member) {
    result = result.filter(b => b.memberName === member);
  }

  if (startDate && endDate) {
    result = result.filter(b => {
      return moment(b.participationDate, 'YYYY-MM-DD').isBetween(
    moment(startDate, 'YYYY-MM-DD'),
    moment(endDate, 'YYYY-MM-DD'),
    'day',
    '[]'
  )
;
    });
  }

  res.json(result);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`ABC Ignite Gym API running on port ${PORT}`);
});
