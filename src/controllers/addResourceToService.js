const Service = require('../models/services');
const Resource = require('../models/resources');

async function addResourceToService(req, res){
    try {
      const { serviceId } = req.params;
      const { resources } = req.body;
  
      // Check if the service exists
      const existingService = await Service.findById(serviceId);
      if (!existingService) {
        return res.status(404).json({ error: 'Service not found' });
      }
  
      // Array to store resource IDs
      const resourceIds = [];
  
      // Process each resource
      for (const resourceName of resources) {
        // Check if the resource already exists
        let existingResource = await Resource.findOne({ name: resourceName });
  
        // If the resource doesn't exist, create it
        if (!existingResource) {
          res.send("Resource Doesn't exist")
        }
  
        // Add resource ID to array
        resourceIds.push(existingResource._id);
  
        // Update resource's service ID
        existingResource.serviceId.push(serviceId);
        await existingResource.save();
      }
  
      // Add resource IDs to service's resource array
      existingService.resource.push(...resourceIds);
  
      // Save the updated service
      const updatedService = await existingService.save();
  
      res.json(updatedService);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = addResourceToService;
  