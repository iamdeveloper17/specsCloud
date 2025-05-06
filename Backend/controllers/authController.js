// controllers/authController.js

// Simulated DB (in-memory)
const users = [];

const signup = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  users.push({ name, email, password });
  res.status(201).json({ message: 'User registered successfully' });
};

const login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.status(200).json({
    message: 'Login successful',
    user: {
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || false,  // Optional if you add isAdmin
    }
  });
};

module.exports = { signup, login };
