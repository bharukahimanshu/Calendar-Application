const Services = require('../models/services');
const Resources = require('../models/resources');

// Route to fetch resources by service
async function fetchResources(req, res){
  try {
    const serviceName = req.params.serviceName;

    // Find the service by its name
    const service = await Services.findOne({ name: serviceName });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Extract resource IDs from the resources array in the service document
    const resourceIds = service.resource.map(resource => resource._id);

    // Fetch resources with the extracted IDs
    const resources = await Resources.find({ _id: { $in: resourceIds } }, '_id name');

    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources by service:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = fetchResources;
