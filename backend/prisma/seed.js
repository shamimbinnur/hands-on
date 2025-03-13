const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // Create users with hashed passwords
  const users = await Promise.all(
    [
      {
        email: "alex@example.com",
        password: "password123",
        name: "Alex Johnson",
        bio: "Passionate about community service",
        skills: ["teaching", "organizing", "mentoring"],
        causes: ["education", "environment"],
      },
      {
        email: "sam@example.com",
        password: "password123",
        name: "Sam Williams",
        bio: "Tech professional looking to give back",
        skills: ["programming", "design", "project management"],
        causes: ["technology", "community development"],
      },
      {
        email: "morgan@example.com",
        password: "password123",
        name: "Morgan Lee",
        bio: "Environmental advocate and volunteer coordinator",
        skills: ["leadership", "fundraising", "public speaking"],
        causes: ["environment", "animal welfare"],
      },
      {
        email: "taylor@example.com",
        password: "password123",
        name: "Taylor Smith",
        bio: "Social worker interested in community programs",
        skills: ["counseling", "coordination", "outreach"],
        causes: ["health", "homelessness"],
      },
      {
        email: "jordan@example.com",
        password: "password123",
        name: "Jordan Garcia",
        bio: "Student looking for volunteer opportunities",
        skills: ["research", "social media", "tutoring"],
        causes: ["education", "youth development"],
      },
    ].map(async (user) => {
      const hashedPassword = await hash(user.password, 10);
      return prisma.user.create({
        data: {
          email: user.email,
          password: hashedPassword,
          name: user.name,
          bio: user.bio,
          skills: user.skills,
          causes: user.causes,
        },
      });
    })
  );

  console.log(`Created ${users.length} users`);

  // Create events
  const alexId = users[0].id;
  const samId = users[1].id;
  const morganId = users[2].id;

  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: "Beach Cleanup Day",
        description:
          "Join us for a day of cleaning up the local beach. All supplies provided!",
        category: "environment",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        time: "9:00 AM - 12:00 PM",
        address: "123 Beach Blvd, Seaside, CA",
        latitude: 36.6177,
        longitude: -121.851,
        maxAttendees: 50,
        imageUrl: "beach-cleanup.jpg",
        organizerId: morganId,
      },
    }),
    prisma.event.create({
      data: {
        title: "Community Garden Planting",
        description:
          "Help us plant vegetables and flowers in our community garden.",
        category: "environment",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        time: "10:00 AM - 2:00 PM",
        address: "456 Garden St, Greenville, CA",
        latitude: 37.7749,
        longitude: -122.4194,
        maxAttendees: 30,
        imageUrl: "garden-planting.jpg",
        organizerId: alexId,
      },
    }),
    prisma.event.create({
      data: {
        title: "Coding Workshop for Kids",
        description:
          "Teach basic coding skills to children ages 8-12. No experience necessary!",
        category: "education",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        time: "1:00 PM - 3:00 PM",
        address: "789 Tech Ave, Innovation City, CA",
        latitude: 37.3382,
        longitude: -121.8863,
        maxAttendees: 20,
        imageUrl: "coding-workshop.jpg",
        organizerId: samId,
      },
    }),
    // Additional 6 events
    prisma.event.create({
      data: {
        title: "Homeless Shelter Meal Service",
        description:
          "Help prepare and serve meals at the downtown homeless shelter.",
        category: "community",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        time: "4:00 PM - 7:00 PM",
        address: "567 Hope St, Downtown, CA",
        latitude: 37.7831,
        longitude: -122.4039,
        maxAttendees: 15,
        imageUrl: "meal-service.jpg",
        organizerId: users[3].id, // Taylor
      },
    }),
    prisma.event.create({
      data: {
        title: "Senior Center Tech Help",
        description:
          "Assist seniors with their smartphones, tablets, and computers.",
        category: "education",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        time: "2:00 PM - 4:00 PM",
        address: "789 Elder Ave, Sunshine, CA",
        latitude: 37.3541,
        longitude: -121.9552,
        maxAttendees: 10,
        imageUrl: "senior-tech.jpg",
        organizerId: samId,
      },
    }),
    prisma.event.create({
      data: {
        title: "City Park Restoration",
        description:
          "Help restore our city park with new plants and cleanup efforts.",
        category: "environment",
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        time: "9:00 AM - 1:00 PM",
        address: "123 Park Lane, Greenville, CA",
        latitude: 37.4419,
        longitude: -122.143,
        maxAttendees: 40,
        imageUrl: "park-restoration.jpg",
        organizerId: morganId,
      },
    }),
    prisma.event.create({
      data: {
        title: "Animal Shelter Dog Walking",
        description:
          "Volunteer to walk and socialize dogs at the local animal shelter.",
        category: "animal welfare",
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        time: "10:00 AM - 12:00 PM",
        address: "456 Paws Lane, Barking, CA",
        latitude: 37.8044,
        longitude: -122.2711,
        maxAttendees: 25,
        imageUrl: "dog-walking.jpg",
        organizerId: morganId,
      },
    }),
    prisma.event.create({
      data: {
        title: "Youth Mentorship Program",
        description: "Be a mentor for at-risk youth in our community.",
        category: "education",
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
        time: "3:30 PM - 5:30 PM",
        address: "789 Youth Center Rd, Hope City, CA",
        latitude: 37.6819,
        longitude: -122.4269,
        maxAttendees: 15,
        imageUrl: "youth-mentorship.jpg",
        organizerId: alexId,
      },
    }),
    prisma.event.create({
      data: {
        title: "Community Blood Drive",
        description: "Donate blood and help save lives in our community.",
        category: "health",
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        time: "9:00 AM - 4:00 PM",
        address: "123 Medical Center Dr, Wellness, CA",
        latitude: 37.5629,
        longitude: -122.3255,
        maxAttendees: 100,
        imageUrl: "blood-drive.jpg",
        organizerId: users[4].id, // Jordan
      },
    }),
  ]);

  console.log(`Created ${events.length} events`);

  // Create event attendees
  const beachCleanupId = events[0].id;
  const gardenPlantingId = events[1].id;
  const codingWorkshopId = events[2].id;

  const eventAttendees = await Promise.all([
    // Beach Cleanup attendees
    prisma.eventAttendee.create({
      data: {
        eventId: beachCleanupId,
        userId: samId,
      },
    }),
    prisma.eventAttendee.create({
      data: {
        eventId: beachCleanupId,
        userId: users[3].id, // Taylor
      },
    }),
    // Garden Planting attendees
    prisma.eventAttendee.create({
      data: {
        eventId: gardenPlantingId,
        userId: morganId,
      },
    }),
    prisma.eventAttendee.create({
      data: {
        eventId: gardenPlantingId,
        userId: users[4].id, // Jordan
      },
    }),
    // Coding Workshop attendees
    prisma.eventAttendee.create({
      data: {
        eventId: codingWorkshopId,
        userId: alexId,
      },
    }),
    prisma.eventAttendee.create({
      data: {
        eventId: codingWorkshopId,
        userId: users[4].id, // Jordan
      },
    }),
  ]);

  console.log(`Created ${eventAttendees.length} event attendees`);

  // Create help requests
  const helpRequests = await Promise.all([
    prisma.helpRequest.create({
      data: {
        title: "Need assistance with elderly neighbor",
        description:
          "Looking for someone to help my elderly neighbor with grocery shopping once a week.",
        urgencyLevel: "medium",
        requestorId: users[3].id, // Taylor
      },
    }),
    prisma.helpRequest.create({
      data: {
        title: "Tutoring for high school math",
        description:
          "Seeking a volunteer to help tutor high school students struggling with algebra and calculus.",
        urgencyLevel: "low",
        requestorId: users[4].id, // Jordan
      },
    }),
    prisma.helpRequest.create({
      data: {
        title: "Emergency shelter volunteers needed",
        description:
          "Our local shelter needs volunteers for the upcoming cold weather season.",
        urgencyLevel: "high",
        requestorId: alexId,
      },
    }),
  ]);

  console.log(`Created ${helpRequests.length} help requests`);

  // Create help helpers
  const helpHelpers = await Promise.all([
    prisma.helpHelper.create({
      data: {
        helpRequestId: helpRequests[0].id,
        userId: morganId,
      },
    }),
    prisma.helpHelper.create({
      data: {
        helpRequestId: helpRequests[1].id,
        userId: samId,
      },
    }),
  ]);

  console.log(`Created ${helpHelpers.length} help helpers`);

  // Create teams
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: "Eco Warriors",
        description:
          "A team dedicated to environmental conservation and sustainability projects.",
        isPublic: true,
        teamImage: "eco-warriors.jpg",
        creatorId: morganId,
      },
    }),
    prisma.team.create({
      data: {
        name: "Tech Volunteers",
        description:
          "Volunteers using technology to help nonprofit organizations and community projects.",
        isPublic: true,
        teamImage: "tech-volunteers.jpg",
        creatorId: samId,
      },
    }),
    prisma.team.create({
      data: {
        name: "Community Helpers",
        description:
          "General volunteers helping with various community initiatives and events.",
        isPublic: true,
        teamImage: "community-helpers.jpg",
        creatorId: alexId,
      },
    }),
  ]);

  console.log(`Created ${teams.length} teams`);

  // Create team members
  const ecoWarriorsId = teams[0].id;
  const techVolunteersId = teams[1].id;
  const communityHelpersId = teams[2].id;

  const teamMembers = await Promise.all([
    // Eco Warriors members
    prisma.teamMember.create({
      data: {
        teamId: ecoWarriorsId,
        userId: morganId, // Creator is automatically a member
      },
    }),
    prisma.teamMember.create({
      data: {
        teamId: ecoWarriorsId,
        userId: alexId,
      },
    }),
    prisma.teamMember.create({
      data: {
        teamId: ecoWarriorsId,
        userId: users[4].id, // Jordan
      },
    }),
    // Tech Volunteers members
    prisma.teamMember.create({
      data: {
        teamId: techVolunteersId,
        userId: samId, // Creator is automatically a member
      },
    }),
    prisma.teamMember.create({
      data: {
        teamId: techVolunteersId,
        userId: users[3].id, // Taylor
      },
    }),
    // Community Helpers members
    prisma.teamMember.create({
      data: {
        teamId: communityHelpersId,
        userId: alexId, // Creator is automatically a member
      },
    }),
    prisma.teamMember.create({
      data: {
        teamId: communityHelpersId,
        userId: users[3].id, // Taylor
      },
    }),
    prisma.teamMember.create({
      data: {
        teamId: communityHelpersId,
        userId: users[4].id, // Jordan
      },
    }),
  ]);

  console.log(`Created ${teamMembers.length} team members`);

  // Create team events
  const teamEvents = await Promise.all([
    prisma.teamEvent.create({
      data: {
        teamId: ecoWarriorsId,
        eventId: beachCleanupId,
      },
    }),
    prisma.teamEvent.create({
      data: {
        teamId: ecoWarriorsId,
        eventId: gardenPlantingId,
      },
    }),
    prisma.teamEvent.create({
      data: {
        teamId: techVolunteersId,
        eventId: codingWorkshopId,
      },
    }),
    prisma.teamEvent.create({
      data: {
        teamId: communityHelpersId,
        eventId: beachCleanupId,
      },
    }),
  ]);

  console.log(`Created ${teamEvents.length} team events`);

  // Create volunteer logs for past events
  const pastEvent = await prisma.event.create({
    data: {
      title: "Past Food Drive",
      description: "Food collection event for local food banks.",
      category: "community",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      time: "10:00 AM - 3:00 PM",
      address: "123 Main St, Downtown, CA",
      latitude: 37.7749,
      longitude: -122.4194,
      maxAttendees: 40,
      imageUrl: "food-drive.jpg",
      organizerId: alexId,
    },
  });

  console.log("Created past event for volunteer logs");

  // Create volunteer logs
  const volunteerLogs = await Promise.all([
    prisma.volunteerLog.create({
      data: {
        userId: samId,
        eventId: pastEvent.id,
        hours: 4.5,
        points: 45,
        notes: "Helped organize donations and pack food boxes.",
      },
    }),
    prisma.volunteerLog.create({
      data: {
        userId: morganId,
        eventId: pastEvent.id,
        hours: 5.0,
        points: 50,
        notes: "Coordinated delivery logistics and managed volunteers.",
      },
    }),
    prisma.volunteerLog.create({
      data: {
        userId: users[3].id, // Taylor
        eventId: pastEvent.id,
        hours: 3.0,
        points: 30,
        notes: "Assisted with sorting and organizing donations.",
      },
    }),
  ]);

  console.log(`Created ${volunteerLogs.length} volunteer logs`);

  // Create volunteer log verifiers
  const volunteerLogVerifiers = await Promise.all([
    prisma.volunteerLogVerifier.create({
      data: {
        logId: volunteerLogs[0].id,
        verifierId: alexId, // Event organizer verifies
      },
    }),
    prisma.volunteerLogVerifier.create({
      data: {
        logId: volunteerLogs[1].id,
        verifierId: alexId, // Event organizer verifies
      },
    }),
  ]);

  console.log(
    `Created ${volunteerLogVerifiers.length} volunteer log verifiers`
  );

  console.log("Seeding finished successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
