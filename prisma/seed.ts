import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Sathi database with verified Bangladeshi travelers and trips...");

  // Clear existing
  await prisma.reference.deleteMany();
  await prisma.message.deleteMany();
  await prisma.joinRequest.deleteMany();
  await prisma.tripMember.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("sathi123", 10);

  // 1. Create Users
  const tanvir = await prisma.user.create({
    data: {
      name: "Tanvir Ahmed",
      email: "tanvir@sathi.travel",
      phone: "+8801711000001",
      password: passwordHash,
      isVerified: true,
      verifiedAt: new Date(),
      bio: "Weekend backpacker, photographer, and tea enthusiast. Traveled to 42 districts of Bangladesh.",
    },
  });

  const nusrat = await prisma.user.create({
    data: {
      name: "Nusrat Jahan",
      email: "nusrat@sathi.travel",
      phone: "+8801711000002",
      password: passwordHash,
      isVerified: true,
      verifiedAt: new Date(),
      bio: "Remote UI designer. Loves workations by the sea and quiet resorts with good Wi-Fi.",
    },
  });

  const rakib = await prisma.user.create({
    data: {
      name: "Rakib Hassan",
      email: "rakib@sathi.travel",
      phone: "+8801711000003",
      password: passwordHash,
      isVerified: true,
      verifiedAt: new Date(),
      bio: "Hiking and mountaineering enthusiast. Keokradong, Saka Haphong, and Ham Ham trekker.",
    },
  });

  const sadia = await prisma.user.create({
    data: {
      name: "Sadia Islam",
      email: "sadia@sathi.travel",
      phone: "+8801711000004",
      password: passwordHash,
      isVerified: true,
      verifiedAt: new Date(),
      bio: "Student at DU. Exploring budget-friendly routes across Sylhet and Chittagong.",
    },
  });

  // 2. Create Trips
  const sajekTrip = await prisma.trip.create({
    data: {
      title: "Weekend Cloud Camping at Sajek Valley",
      destination: "Sajek Valley",
      description: "Sharing a 4WD Chander Gari from Khagrachhari and splitting a wooden cottage at Konglak Para.",
      startDate: new Date(Date.now() + 86400000 * 4),
      endDate: new Date(Date.now() + 86400000 * 7),
      budgetPerPerson: 5500,
      maxGroupSize: 4,
      pace: "MODERATE",
      roomSharing: "FLEXIBLE",
      hotelName: "Meghpunji Resort (Konglak Para)",
      hotelAddress: "Ruilui Para, Sajek, Baghaichhari, Rangamati",
      meetingPoint: "Khagrachhari Bus Stand (08:00 AM Friday)",
      creatorId: tanvir.id,
      members: {
        create: [{ userId: tanvir.id }, { userId: rakib.id }],
      },
    },
  });

  const coxsTrip = await prisma.trip.create({
    data: {
      title: "Cox's Bazar Workation & Sunset Strolls",
      destination: "Cox's Bazar",
      description: "Renting a 2-bedroom sea view apartment near Kolatoli. Need someone chill who works remotely.",
      startDate: new Date(Date.now() + 86400000 * 10),
      endDate: new Date(Date.now() + 86400000 * 14),
      budgetPerPerson: 7000,
      maxGroupSize: 3,
      pace: "RELAXED",
      roomSharing: "WILLING",
      hotelName: "Sea Crown Suite",
      hotelAddress: "Marine Drive Road, Kolatoli, Cox's Bazar",
      meetingPoint: "Chittagong Railway Station",
      creatorId: nusrat.id,
      members: {
        create: [{ userId: nusrat.id }],
      },
    },
  });

  const srimangalTrip = await prisma.trip.create({
    data: {
      title: "Srimangal Tea Trails & Lawachara Forest Trek",
      destination: "Srimangal",
      description: "Cycling through tea gardens, tasting 7-layer tea, and early morning bird watching in Lawachara.",
      startDate: new Date(Date.now() + 86400000 * 8),
      endDate: new Date(Date.now() + 86400000 * 11),
      budgetPerPerson: 4200,
      maxGroupSize: 4,
      pace: "ADVENTUROUS",
      roomSharing: "FLEXIBLE",
      hotelName: "Novem Eco Resort",
      hotelAddress: "Bhuban, Radhanagar, Srimangal",
      meetingPoint: "Kamalapur Railway Station (Upabon Express)",
      creatorId: sadia.id,
      members: {
        create: [{ userId: sadia.id }, { userId: tanvir.id }],
      },
    },
  });

  // 3. Create Messages in Sajek group chat
  await prisma.message.createMany({
    data: [
      {
        tripId: sajekTrip.id,
        userId: tanvir.id,
        content: "Welcome everyone! Glad to have you onboard for Sajek.",
      },
      {
        tripId: sajekTrip.id,
        userId: rakib.id,
        content: "Super excited! Should we book the non-AC or AC bus from Dhaka to Khagrachhari?",
      },
      {
        tripId: sajekTrip.id,
        userId: tanvir.id,
        content: "Shanti Paribahan gets us there by 6 AM, which is perfect for catching the first army convoy at 10 AM.",
      },
    ],
  });

  // 4. Create Join Request
  await prisma.joinRequest.create({
    data: {
      tripId: sajekTrip.id,
      userId: nusrat.id,
      message: "Hey Tanvir! I have a Sony camera and would love to join for the sunrise shoot!",
      status: "PENDING",
    },
  });

  // 5. Create References
  await prisma.reference.create({
    data: {
      tripId: srimangalTrip.id,
      giverId: sadia.id,
      receiverId: tanvir.id,
      punctuality: 5,
      communication: 5,
      trustworthiness: 5,
      overallRating: 5,
      comment: "Tanvir was super organized, punctual at Sayedabad counter, and shared the resort bill transparently. 10/10 companion!",
    },
  });

  console.log("Seeding complete! Log in with: tanvir@sathi.travel / sathi123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
