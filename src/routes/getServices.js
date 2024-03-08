const Service = require('../models/services');
const Resource = require('../models/resources');
const express = require('express');
const router = express.Router();

router.get('/getServices', async (req, res) => {
  try {
    // Check if a specific service is requested in the query
    console.log("Getting Services");
    const serviceName = req.query.service;

    // Define the base query
    let query = {};

    // If a service name is provided in the query, filter by that service
    if (serviceName) {
      query.name = serviceName;
    }

    // Fetch services from the database based on the query
    const services = await Service.find(query);

    // Iterate through each service
    const formattedServices = await Promise.all(services.map(async service => {
      // Get the resource IDs from the service
      const resourceIds = service.resource;

      // Fetch the corresponding resource names for each resource ID
      const resourceNames = await Promise.all(resourceIds.map(async resourceId => {
        const resource = await Resource.findById(resourceId);
        return resource ? resource.name : null; // Return null if resource not found
      }));

      // Return the formatted service object
      return {
        _id: service._id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        resources: resourceNames.filter(Boolean) // Filter out null values
      };
    }));

    // Return the formatted services
    res.json(formattedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

module.exports = router;
