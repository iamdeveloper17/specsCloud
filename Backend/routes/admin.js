const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Catalogue = require('../models/Catalogue'); // If your file upload saves into Catalogue model

// Get all users + file count
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();

    // Count uploaded files for each user
    const usersWithFiles = await Promise.all(
        users.map(async (user) => {
          const totalFiles = await Catalogue.countDocuments({ uploadedById: user._id });
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            totalFiles,
          };
        })
      );
      
      res.status(200).json(usersWithFiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Delete user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
