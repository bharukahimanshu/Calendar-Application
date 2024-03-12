const Service = require('../models/services');
const Resources = require('../models/resources')

async function editService(req, res) {
    try {
        const { serviceId } = req.params;
        const { name, description, resourceNames} = req.body;
    
        // Check if the service exists
        const existingService = await Service.findById(serviceId);
        if (!existingService) {
          return res.status(404).json({ error: 'Service not found' });
        }

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
    
        // Update service fields
        if(name)existingService.name = name;
        if(description)existingService.description = description;
        existingService.resource = existingService.resource.concat(resourceIds);
        
    
    
        // Save the updated service
        const updatedService = await existingService.save();

        for (const resourceId of resourceIds) {
          const resource = await Resources.findById(resourceId);
          if (resource) {
            resource.serviceId.push(serviceId);
            await resource.save();
            console.log(`resource '${resource.name}' updated with service ID: ${serviceId}`);
          } else {
            console.log(`resource with ID '${resourceId}' not found`);
          }
        }
    
        res.json(updatedService);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
    
    module.exports = editService;
