const Service = require('../models/services');

async function editService(req, res) {
    try {
        const { serviceId } = req.params;
        const { name, description} = req.body;
    
        // Check if the service exists
        const existingService = await Service.findById(serviceId);
        if (!existingService) {
          return res.status(404).json({ error: 'Service not found' });
        }
    
        // Update service fields
        if(name)existingService.name = name;
        if(description)existingService.description = description;
    
    
        // Save the updated service
        const updatedService = await existingService.save();
    
        res.json(updatedService);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
    
    module.exports = editService;
