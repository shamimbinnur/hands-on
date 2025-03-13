// @desc    Get all events
// @route   GET /api/events
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

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
        },
        teams: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                teamImage: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Format attendees
    const formattedEvent = {
      ...event,
      attendees: event.attendees.map((a) => a.user),
      teams: event.teams.map((t) => t.team),
    };

    res.json(formattedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      address,
      latitude,
      longitude,
      maxAttendees,
      imageUrl,
    } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        category,
        date: new Date(date),
        time,
        address,
        latitude: latitude || null,
        longitude: longitude || null,
        maxAttendees: maxAttendees || 0,
        imageUrl: imageUrl || "default-event.jpg",
        organizer: {
          connect: { id: req.user.id },
        },
      },
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    // Get the event to check if the user is the organizer
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      select: { organizerId: true },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the organizer
    if (event.organizerId !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this event" });
    }

    const {
      title,
      description,
      category,
      date,
      time,
      address,
      latitude,
      longitude,
      maxAttendees,
      imageUrl,
      status,
    } = req.body;

    // Prepare update data
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (date) updateData.date = new Date(date);
    if (time) updateData.time = time;
    if (address) updateData.address = address;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (maxAttendees !== undefined) updateData.maxAttendees = maxAttendees;
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (status) updateData.status = status;

    const updatedEvent = await prisma.event.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    // Get the event to check if the user is the organizer
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      select: { organizerId: true },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the organizer
    if (event.organizerId !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this event" });
    }

    // Delete associated records (will depend on your exact DB cascade settings)
    // For this example, we'll manually delete related records

    // Delete event attendees
    await prisma.eventAttendee.deleteMany({
      where: { eventId: req.params.id },
    });

    // Delete volunteer logs associated with the event
    await prisma.volunteerLog.deleteMany({
      where: { eventId: req.params.id },
    });

    // Delete team-event associations
    await prisma.teamEvent.deleteMany({
      where: { eventId: req.params.id },
    });

    // Finally delete the event
    await prisma.event.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Event removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join an event
// @route   POST /api/events/:id/join
// @access  Private
const joinEvent = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        attendees: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event is full
    if (
      event.maxAttendees > 0 &&
      event.attendees.length >= event.maxAttendees
    ) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Check if user is already attending
    const isAttending = event.attendees.some((a) => a.userId === req.user.id);
    if (isAttending) {
      return res.status(400).json({ message: "Already joined this event" });
    }

    // Join event
    await prisma.eventAttendee.create({
      data: {
        event: {
          connect: { id: req.params.id },
        },
        user: {
          connect: { id: req.user.id },
        },
      },
    });

    res.json({ message: "Successfully joined event" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Leave an event
// @route   POST /api/events/:id/leave
// @access  Private
const leaveEvent = async (req, res) => {
  try {
    // Check if user is attending
    const attendee = await prisma.eventAttendee.findFirst({
      where: {
        eventId: req.params.id,
        userId: req.user.id,
      },
    });

    if (!attendee) {
      return res.status(400).json({ message: "Not attending this event" });
    }

    // Leave event
    await prisma.eventAttendee.delete({
      where: {
        id: attendee.id,
      },
    });

    res.json({ message: "Successfully left event" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if a user has joined an event
// @route   GET /api/events/:id/joined
// @access  Private
const checkJoinStatus = async (req, res) => {
  try {
    // Find the event attendance record
    const attendance = await prisma.eventAttendee.findFirst({
      where: {
        eventId: req.params.id,
        userId: req.user.id,
      },
    });

    // Return true if the user has joined, false otherwise
    res.json({
      joined: !!attendance,
      // Include attendance details if found
      attendance: attendance || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  checkJoinStatus,
};
