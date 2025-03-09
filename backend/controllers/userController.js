const bcrypt = require("bcryptjs");

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        bio: true,
        skills: true,
        causes: true,
        totalHours: true,
        totalPoints: true,
        joinedDate: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        bio: true,
        skills: true,
        causes: true,
        totalHours: true,
        totalPoints: true,
        joinedDate: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    // Ensure user can only update their own profile
    if (req.user.id !== req.params.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this profile" });
    }

    const { name, bio, skills, causes, profileImage, password } = req.body;

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (skills) updateData.skills = skills;
    if (causes) updateData.causes = causes;
    if (profileImage) updateData.profileImage = profileImage;

    // Hash password if it's being updated
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        bio: true,
        skills: true,
        causes: true,
        totalHours: true,
        totalPoints: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user volunteer history
// @route   GET /api/users/:id/history
// @access  Public
const getUserVolunteerHistory = async (req, res) => {
  try {
    const logs = await prisma.volunteerLog.findMany({
      where: { userId: req.params.id },
      include: {
        event: {
          select: {
            title: true,
            date: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUser, updateUser, getUserVolunteerHistory };
