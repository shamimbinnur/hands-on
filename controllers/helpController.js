// @desc    Get all help requests
// @route   GET /api/help-requests
// @access  Public
const getHelpRequests = async (req, res) => {
  try {
    const { urgencyLevel, status } = req.query;

    // Filter options
    const where = {};
    if (urgencyLevel) where.urgencyLevel = urgencyLevel;
    if (status) where.status = status;

    const helpRequests = await prisma.helpRequest.findMany({
      where,
      include: {
        requestor: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        helpers: {
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format response
    const formattedRequests = helpRequests.map((request) => ({
      ...request,
      helperCount: request.helpers.length,
      helpers: request.helpers.map((h) => h.user),
    }));

    res.json(formattedRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get help request by ID
// @route   GET /api/help-requests/:id
// @access  Public
const getHelpRequest = async (req, res) => {
  try {
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: req.params.id },
      include: {
        requestor: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            email: true,
          },
        },
        helpers: {
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
      },
    });

    if (!helpRequest) {
      return res.status(404).json({ message: "Help request not found" });
    }

    // Format helpers
    const formattedRequest = {
      ...helpRequest,
      helpers: helpRequest.helpers.map((h) => h.user),
    };

    res.json(formattedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new help request
// @route   POST /api/help-requests
// @access  Private
const createHelpRequest = async (req, res) => {
  try {
    const { title, description, urgencyLevel } = req.body;

    const helpRequest = await prisma.helpRequest.create({
      data: {
        title,
        description,
        urgencyLevel: urgencyLevel || "medium",
        requestor: {
          connect: { id: req.user.id },
        },
      },
    });

    res.status(201).json(helpRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update help request
// @route   PUT /api/help-requests/:id
// @access  Private
const updateHelpRequest = async (req, res) => {
  try {
    // Get the help request to check if the user is the requestor
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: req.params.id },
      select: { requestorId: true },
    });

    if (!helpRequest) {
      return res.status(404).json({ message: "Help request not found" });
    }

    // Check if user is the requestor
    if (helpRequest.requestorId !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this request" });
    }

    const { title, description, urgencyLevel, status } = req.body;

    // Prepare update data
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (urgencyLevel) updateData.urgencyLevel = urgencyLevel;
    if (status) updateData.status = status;

    const updatedRequest = await prisma.helpRequest.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete help request
// @route   DELETE /api/help-requests/:id
// @access  Private
const deleteHelpRequest = async (req, res) => {
  try {
    // Get the help request to check if the user is the requestor
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: req.params.id },
      select: { requestorId: true },
    });

    if (!helpRequest) {
      return res.status(404).json({ message: "Help request not found" });
    }

    // Check if user is the requestor
    if (helpRequest.requestorId !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this request" });
    }

    // Delete associated records
    await prisma.helpHelper.deleteMany({
      where: { helpRequestId: req.params.id },
    });

    // Delete the help request
    await prisma.helpRequest.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Help request removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Offer help for a request
// @route   POST /api/help-requests/:id/offer-help
// @access  Private
const offerHelp = async (req, res) => {
  try {
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: req.params.id },
      include: {
        helpers: true,
      },
    });

    if (!helpRequest) {
      return res.status(404).json({ message: "Help request not found" });
    }

    // Check if request is still open
    if (helpRequest.status !== "open") {
      return res
        .status(400)
        .json({ message: `This request is ${helpRequest.status}` });
    }

    // Check if user is already helping
    const isHelping = helpRequest.helpers.some((h) => h.userId === req.user.id);
    if (isHelping) {
      return res
        .status(400)
        .json({ message: "Already offering help for this request" });
    }

    // Offer help
    await prisma.helpHelper.create({
      data: {
        helpRequest: {
          connect: { id: req.params.id },
        },
        user: {
          connect: { id: req.user.id },
        },
      },
    });

    // If this is the first helper, update the status to in-progress
    if (helpRequest.helpers.length === 0) {
      await prisma.helpRequest.update({
        where: { id: req.params.id },
        data: { status: "in-progress" },
      });
    }

    res.json({ message: "Successfully offered help" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Withdraw help for a request
// @route   POST /api/help-requests/:id/withdraw-help
// @access  Private
const withdrawHelp = async (req, res) => {
  try {
    // Check if user is helping
    const helper = await prisma.helpHelper.findFirst({
      where: {
        helpRequestId: req.params.id,
        userId: req.user.id,
      },
    });

    if (!helper) {
      return res
        .status(400)
        .json({ message: "Not offering help for this request" });
    }

    // Withdraw help
    await prisma.helpHelper.delete({
      where: {
        id: helper.id,
      },
    });

    // Check if there are any helpers left
    const helperCount = await prisma.helpHelper.count({
      where: { helpRequestId: req.params.id },
    });

    // If no helpers left and status is in-progress, update back to open
    if (helperCount === 0) {
      const helpRequest = await prisma.helpRequest.findUnique({
        where: { id: req.params.id },
      });

      if (helpRequest && helpRequest.status === "in-progress") {
        await prisma.helpRequest.update({
          where: { id: req.params.id },
          data: { status: "open" },
        });
      }
    }

    res.json({ message: "Successfully withdrew help" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHelpRequests,
  getHelpRequest,
  createHelpRequest,
  updateHelpRequest,
  deleteHelpRequest,
  offerHelp,
  withdrawHelp,
};
