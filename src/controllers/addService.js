const Service = require('../models/services');
const Resources = require('../models/resources');

// Route to add a new service
async function addServices(req, res){
  try {
    const { name, description,duration, resourceNames } = req.body; // Corrected to resourceNames

    // Create an array to store resource IDs
    const resourceIds = [];

    // Find resource members by names and collect their IDs
    if (resourceNames && resourceNames.length > 0) {
        console.log("Searching resource name");
      for (const resourceName of resourceNames) { // Corrected to resourceNames
        const resource = await Resources.findOne({ name: resourceName });
        if (!resource) {
          return res.status(404).json({ error: `resource '${resourceName}' not found` });
        }
        resourceIds.push(resource._id);
      }
    }

    // Create a new service instance
    const newService = new Service({
      name: name,
      description: description,
      duration:duration,
      resource: resourceIds // Assign the array of resource IDs to the service
    });

    // Save the new service to the database
    const savedService = await newService.save();

    // Update each resource member to include the service ID
    for (const resourceId of resourceIds) {
      const resource = await Resources.findById(resourceId);
      if (resource) {
        resource.serviceId.push(savedService._id);
        await resource.save();
        console.log(`resource '${resource.name}' updated with service ID: ${savedService._id}`);
      } else {
        console.log(`resource with ID '${resourceId}' not found`);
      }
    }

    // Return the saved service and list of resource members
    res.status(201).json({ service: savedService, resource: resourceIds });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ error: 'Error adding service' });
  }
}

module.exports = addServices;
