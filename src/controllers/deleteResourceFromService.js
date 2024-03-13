const Resource = require('../models/resources');
const Service = require('../models/services');

// PUT route to edit a resource
async function deleteResourceFromService(req, res){
  try {
    
    const serviceId = req.params.serviceId;
    const resourceId = req.params.resourceId;

    const service = await Service.findById(serviceId)

    // Check if the resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    //remove resource from the service Array
    const index = service.resource.indexOf(resourceId);
        // If the resourceId exists in the resources array (index is not -1), remove it
    if (index !== -1) {
    // Remove the element at the found index from the resources array using splice
    service.resource.splice(index, 1);
    // Save the updated service
    await service.save();
    console.log(`Resource ${resourceId} removed from service ${service._id}`);
    }

   
    const serviceIndex = resource.serviceId.indexOf(serviceId);
    console.log("ServiceIndex", serviceIndex);
    console.log("ResourceIndex",index);
    if (serviceIndex !== -1) {
    // Remove the element at the found index from the resources array using splice
    resource.serviceId.splice(serviceIndex, 1);
    // Save the updated service
    await resource.save();
    console.log(`Resource ${serviceId} removed from service ${resource._id}`);
    }

    res.json({ message: 'Action successful'});
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = deleteResourceFromService;
