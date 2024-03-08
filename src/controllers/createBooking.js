const bookings = require('../models/bookings');
const users = require('../models/user');
const customers = require('../models/customers');
const services = require('../models/services');
const Resources = require('../models/resources');
const env = require('dotenv');
env.config();

async function createBooking(req, res) {
  try {
    const creatorEmail = req.user.email;
    const creator = await users.findOne({ email: creatorEmail });

    if (!creator) {
      return res.status(404).send('Creator user not found');
    }

    let customer = await customers.findOne({ phone_no: req.body.related_to });

    if (!customer) {
      const newCustomer = {
        phone_no: req.body.related_to
      };
      customer = await customers.create(newCustomer);
    }

    const selectedService = req.body.service;
    const service = await services.findOne({ name: selectedService });

    if (!service) {
      return res.status(404).send('Selected service not found');
    }

    const selectedResource = req.body.resource;
    const resource = await Resources.findOne({ name: selectedResource });

    if (!resource) {
      return res.status(404).send('Selected resource not found');
    }

    // Check if the selected Resource belongs to the selected service
    let resourceExists = false;
    for (const serviceResource of service.resource) {
      if (serviceResource._id.toString() === resource._id.toString()) {
        resourceExists = true;
        break;
      }
    }

    if (!resourceExists) {
      return res.status(400).send('Selected resource does not belong to the selected service');
    }
    console.log(req.body.startDate);
    const date = new Date(req.body.startDate)
    const bookingStartDateUTC = date;
    console.log(bookingStartDateUTC);
    const durationInMinutes = service.duration;
    const bookingEndDateUTC = new Date(date.getTime() + durationInMinutes * 60000)
    console.log(bookingEndDateUTC); 
    // + durationInMinutes * 60000;

    // Check if there are any existing bookings for the selected Resource during the calculated time slot
    const existingBookings = await bookings.find({
      resource: resource._id,
      $or: [
        { $and: [{ startDate: { $lte: bookingStartDateUTC } }, { endDate: { $gte: bookingStartDateUTC } }] },
        { $and: [{ startDate: { $lte: bookingEndDateUTC } }, { endDate: { $gte: bookingEndDateUTC } }] },
        { $and: [{ startDate: { $gte: bookingStartDateUTC } }, { endDate: { $lte: bookingEndDateUTC } }] }
      ]
    });

    if (existingBookings.length === 0) {
      // Create the new booking
      const newBooking = {
        title: req.body.title,
        description: req.body.description,
        startDate: bookingStartDateUTC,
        endDate: bookingEndDateUTC,
        customerId: customer._id,
        related_to: req.body.related_to,
        status: req.body.status || 'Open',
        creator: creator._id,
        service: service._id,
        resource: resource._id
      };

      const booking = await bookings.create(newBooking);
      customer.bookings.push(booking._id);
      await customer.save();

      resource.bookings.push(booking._id);
      await resource.save();

      res.send('Booking created successfully!');
    }
    else{
      return res.status(400).send('Resource is already booked during the selected time slot');
    }

    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = createBooking;
