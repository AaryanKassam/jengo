import User from '../models/User.model.js';

// @desc    Get all volunteers (public profile for Network/Reach Out)
// @route   GET /api/users/volunteers
// @access  Private (nonprofit or volunteer)
export const getVolunteers = async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer', emailVerified: true })
      .select('_id name email school skills interests profilePhoto pitchVideoUrl location')
      .lean();

    const list = volunteers.map((v) => ({
      id: v._id.toString(),
      _id: v._id,
      name: v.name,
      email: v.email,
      school: v.school || '',
      skills: v.skills || [],
      interests: v.interests || [],
      profilePhoto: v.profilePhoto || '',
      pitchVideoUrl: v.pitchVideoUrl || '',
      location: v.location || ''
    }));

    res.json({ volunteers: list });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If viewing own profile, return full data
    // Otherwise, return limited public data
    if (req.user._id.toString() === req.params.id) {
      res.json({ user });
    } else {
      res.json({ user: user.toPublicJSON() });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    // Users can only update their own profile
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const updateData = { ...req.body };
    
    // Don't allow role changes through profile update
    delete updateData.role;
    delete updateData.password; // Password updates should be separate

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload pitch video
// @route   POST /api/users/:id/pitch-video
// @access  Private (own profile only)
export const uploadMyPitchVideo = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' });
    }

    const pitchVideoUrl = `/uploads/pitch-videos/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { pitchVideoUrl },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ user, pitchVideoUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload resume
// @route   POST /api/users/:id/resume
// @access  Private (own profile only)
export const uploadMyResume = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No resume uploaded' });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { resume: resumeUrl },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ user, resumeUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload profile photo
// @route   POST /api/users/:id/profile-photo
// @access  Private (own profile only)
export const uploadMyProfilePhoto = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No profile photo uploaded' });
    }

    const profilePhoto = `/uploads/profile-photos/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profilePhoto },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ user, profilePhoto });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
