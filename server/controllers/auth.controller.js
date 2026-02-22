import User from '../models/User.model.js';
import { generateToken } from '../config/jwt.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const {
      name,
      pronouns,
      username,
      email,
      password,
      role,
      location,
      age,
      skills,
      interests,
      neededSkills,
      neededInterests,
      organizationDescription,
      website,
      matchingProfile
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      pronouns,
      username,
      email,
      password,
      role,
      location,
      age: role === 'volunteer' ? age : undefined,
      skills: role === 'volunteer' ? skills : undefined,
      interests: role === 'volunteer' ? interests : undefined,
      neededSkills: role === 'nonprofit' ? neededSkills : undefined,
      neededInterests: role === 'nonprofit' ? neededInterests : undefined,
      organizationDescription: role === 'nonprofit' ? organizationDescription : undefined,
      website: role === 'nonprofit' ? website : undefined,
      matchingProfile
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        token,
        user: user.toPublicJSON()
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
