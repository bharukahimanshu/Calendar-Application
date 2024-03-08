const express = require('express');
const router = express.Router();
const Resources = require('../models/resources');
const Service = require('../models/services'); // Require Service model
const Booking = require('../models/bookings'); // Require Booking model

// Route to get all resources with populated service and booking information
router.get('/getResources', async (req, res) => {
  try {
    // Check if a specific resource ID is provided in the query parameters
    const resourceName = req.query.resource;
    console.log(resourceName);

    // If no resource name is provided in the query, fetch all resources
    let resources;
    if (!resourceName) {
      resources = await Resources.find();
    } else {
      const resource = await Resources.findOne({ name: resourceName });
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      resources = [resource]; // Wrap the single resource in an array for consistency
    }

    // Iterate through each resource to populate service and booking information
    const populatedResources = await Promise.all(resources.map(async (resource) => {
      // Fetch all services for this resource
      const serviceIds = resource.serviceId;
      const services = await Promise.all(serviceIds.map(async (serviceId) => {
        const service = await Service.findById(serviceId);
        return service ? { _id: service._id, name: service.name } : null;
      }));

      // Fetch all bookings for this resource
      const bookingIds = resource.bookings;
      const bookings = await Promise.all(bookingIds.map(async (bookingId) => {
        const booking = await Booking.findById(bookingId);
        return booking ? { _id: booking._id, title: booking.title } : null;
      }));

      return {
        _id: resource._id,
        name: resource.name,
        description: resource.description,
        services: services.filter(Boolean), // Filter out null values
        bookings: bookings.filter(Boolean) // Filter out null values
      };
    }));

    // Return the populated resources
    res.json(populatedResources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
