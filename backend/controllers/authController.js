const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;

    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Calculate pagination values
    const skip = (pageNum - 1) * limitNum;

    // Filter options
    const where = {};
    if (category) where.category = category;
    if (status) where.status = status;

    // Get paginated events
    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        attendees: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
      skip,
      take: limitNum,
    });

    // Get total count for pagination metadata
    const totalEvents = await prisma.event.count({
      where,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalEvents / limitNum);

    // Format response
    const formattedEvents = events.map((event) => ({
      ...event,
      attendeeCount: event.attendees.length,
      attendees: event.attendees.map((a) => a.userId),
    }));

    // Return with pagination metadata
    res.json({
      events: formattedEvents,
      pagination: {
        total: totalEvents,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is already set from the auth middleware
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe };
