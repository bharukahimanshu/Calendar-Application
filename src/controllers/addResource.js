const Resources = require('../models/resources');

async function addResource(req, res){
    try {
      const { name, email, phone_no, description} = req.body;
    
      // Create a new resource instance
      const newResourceData = {
        name: name,
        description: description,
      
      };
      // Add email if provided
      if (email) {
        newResourceData.email = email;
      }
  
      // Add phone number if provided
      if (phone_no) {
        newResourceData.phone_no = phone_no;
      }
  
      const newResource= new Resources(newResourceData);
  
      // Save the new resource member to the database
      const savedResource = await newResource.save();
  
      // Return the saved resource member
      res.status(201).json({ resource: savedResource });
    } catch (error) {
      console.error('Error adding resource:', error);
      res.status(500).json({ error: 'Error adding resource' });
    }
  }

  module.exports = addResource;