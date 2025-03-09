// @desc    Get all teams
// @route   GET /api/teams
// @access  Public
const getTeams = async (req, res) => {
  try {
    const { isPublic } = req.query;

    // Filter options
    const where = {};
    if (isPublic !== undefined) {
      where.isPublic = isPublic === "true";
    }

    const teams = await prisma.team.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        members: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format response
    const formattedTeams = teams.map((team) => ({
      ...team,
      memberCount: team.members.length,
      members: team.members.map((m) => m.userId),
    }));

    res.json(formattedTeams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get team by ID
// @route   GET /api/teams/:id
// @access  Public
const getTeam = async (req, res) => {
  try {
    const team = await prisma.team.findUnique({
      where: { id: req.params.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        members: {
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
        events: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // If team is private, check if user is a member
    if (!team.isPublic && req.user) {
      const isMember =
        team.members.some((m) => m.user.id === req.user.id) ||
        team.creator.id === req.user.id;
      if (!isMember) {
        return res.status(403).json({ message: "This team is private" });
      }
    } else if (!team.isPublic && !req.user) {
      return res.status(403).json({ message: "This team is private" });
    }

    // Format members and events
    const formattedTeam = {
      ...team,
      members: team.members.map((m) => m.user),
      events: team.events.map((e) => e.event),
    };

    res.json(formattedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
const createTeam = async (req, res) => {
  try {
    const { name, description, isPublic, teamImage } = req.body;

    // Check if name is already taken
    const existingTeam = await prisma.team.findUnique({
      where: { name },
    });

    if (existingTeam) {
      return res.status(400).json({ message: "Team name already exists" });
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
        isPublic: isPublic !== undefined ? isPublic : true,
        teamImage: teamImage || "default-team.jpg",
        creator: {
          connect: { id: req.user.id },
        },
        // Add creator as a member
        members: {
          create: {
            user: {
              connect: { id: req.user.id },
            },
          },
        },
      },
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
const updateTeam = async (req, res) => {
  try {
    // Get the team to check if the user is the creator
    const team = await prisma.team.findUnique({
      where: { id: req.params.id },
      select: { creatorId: true },
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user is the creator
    if (team.creatorId !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this team" });
    }

    const { name, description, isPublic, teamImage } = req.body;

    // Prepare update data
    const updateData = {};
    if (name) {
      // Check if new name is already taken by another team
      if (name !== team.name) {
        const existingTeam = await prisma.team.findUnique({
          where: { name },
        });

        if (existingTeam) {
          return res.status(400).json({ message: "Team name already exists" });
        }
      }
      updateData.name = name;
    }
    if (description) updateData.description = description;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (teamImage) updateData.teamImage = teamImage;

    const updatedTeam = await prisma.team.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private
const deleteTeam = async (req, res) => {
  try {
    // Get the team to check if the user is the creator
    const team = await prisma.team.findUnique({
      where: { id: req.params.id },
      select: { creatorId: true },
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if user is the creator
    if (team.creatorId !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this team" });
    }

    // Delete associated records
    await prisma.teamMember.deleteMany({
      where: { teamId: req.params.id },
    });

    await prisma.teamEvent.deleteMany({
      where: { teamId: req.params.id },
    });

    // Delete the team
    await prisma.team.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Team removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a team
// @route   POST /api/teams/:id/join
// @access  Private
const joinTeam = async (req, res) => {
  try {
    const team = await prisma.team.findUnique({
      where: { id: req.params.id },
      include: {
        members: true,
      },
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check if team is public
    if (!team.isPublic) {
      return res
        .status(403)
        .json({ message: "Cannot join a private team without invitation" });
    }

    // Check if user is already a member
    const isMember = team.members.some((m) => m.userId === req.user.id);
    if (isMember) {
      return res.status(400).json({ message: "Already a member of this team" });
    }

    // Join team
    await prisma.teamMember.create({
      data: {
        team: {
          connect: { id: req.params.id },
        },
        user: {
          connect: { id: req.user.id },
        },
      },
    });

    res.json({ message: "Successfully joined team" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Leave a team
// @route   POST /api/teams/:id/leave
// @access  Private
const leaveTeam = async (req, res) => {
  try {
    // Check if user is a member
    const member = await prisma.teamMember.findFirst({
      where: {
        teamId: req.params.id,
        userId: req.user.id,
      },
    });

    if (!member) {
      return res.status(400).json({ message: "Not a member of this team" });
    }

    // Check if user is the creator
    const team = await prisma.team.findUnique({
      where: { id: req.params.id },
      select: { creatorId: true },
    });

    if (team.creatorId === req.user.id) {
      return res.status(400).json({
        message:
          "Team creator cannot leave the team. Transfer ownership or delete the team instead.",
      });
    }

    // Leave team
    await prisma.teamMember.delete({
      where: {
        id: member.id,
      },
    });

    res.json({ message: "Successfully left team" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  joinTeam,
  leaveTeam,
};
