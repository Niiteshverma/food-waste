import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

async function main() {
  console.log("🌱 Starting FoodSave database seeding...");

  const userCount = await prisma.user.count();
  if (userCount > 0 && process.env.FORCE_SEED !== "true") {
    console.log(`Database already contains ${userCount} users. Skipping seed to preserve data.`);
    return;
  }

  // Clear existing data safely
  await prisma.distribution.deleteMany().catch(() => {});
  await prisma.beneficiary.deleteMany().catch(() => {});
  await prisma.orderItem.deleteMany().catch(() => {});
  await prisma.order.deleteMany().catch(() => {});
  await prisma.favorite.deleteMany().catch(() => {});
  await prisma.foodListing.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Create Consumer
  const consumer = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "consumer@foodsave.org",
      password: hashedPassword,
      role: "consumer",
      phone: "+91 98765 43210",
      city: "New Delhi",
      state: "Delhi",
      address: "Lajpat Nagar IV",
      pincode: "110024",
      latitude: 28.5677,
      longitude: 77.2433,
      bio: "Passionate about zero-waste living and saving surplus food.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    },
  });

  // 2. Create Restaurant 1
  const restaurant1 = await prisma.user.create({
    data: {
      name: "Chef Vikram",
      email: "spicecraft@foodsave.org",
      password: hashedPassword,
      role: "restaurant",
      phone: "+91 98111 22334",
      businessName: "SpiceCraft Bistro",
      cuisineType: "North Indian & Mughlai",
      businessImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
      address: "B-14, Inner Circle, Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
      latitude: 28.6315,
      longitude: 77.2167,
    },
  });

  // 3. Create Restaurant 2
  const restaurant2 = await prisma.user.create({
    data: {
      name: "Pooja Patel",
      email: "artisanbakery@foodsave.org",
      password: hashedPassword,
      role: "restaurant",
      phone: "+91 98222 33445",
      businessName: "The Artisan Bakehouse",
      cuisineType: "Bakery & Desserts",
      businessImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
      address: "12 Hauz Khas Village",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110016",
      latitude: 28.5494,
      longitude: 77.1937,
    },
  });

  // 4. Create NGO
  const ngo = await prisma.user.create({
    data: {
      name: "Robin Hood Rescue",
      email: "ngo@foodsave.org",
      password: hashedPassword,
      role: "ngo",
      phone: "+91 98333 44556",
      contactPerson: "Amit Verma",
      ngoRegNumber: "NGO-DEL-2024-884",
      serviceRadius: 25,
      address: "Sector 14, RK Puram",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110022",
      latitude: 28.5645,
      longitude: 77.1783,
    },
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const now = new Date();
  const laterToday = new Date(now.getTime() + 6 * 3600000);

  // 5. Create Food Listings
  const listing1 = await prisma.foodListing.create({
    data: {
      restaurantId: restaurant1.id,
      name: "Dal Makhani & Butter Naan Meal Combo",
      category: "Prepared Meals",
      subCategory: "North Indian",
      description: "Rich, slow-cooked black lentils with cream and butter, paired with 3 freshly baked tandoori naans.",
      tags: "dal, naan, combo, warm, lunch",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
      ]),
      city: "New Delhi",
      quantity: 8,
      unit: "portions",
      originalPrice: 380,
      discountedPrice: 0,
      minOrder: 1,
      expiryDate: tomorrowStr,
      expiryTime: "22:00",
      availableFrom: now,
      availableUntil: laterToday,
      ingredients: "Black lentils, Kidney beans, Cream, Butter, Spices, Wheat flour",
      allergens: JSON.stringify(["Dairy", "Gluten"]),
      dietary: JSON.stringify(["Veg"]),
      storage: "Keep warm or refrigerate immediately",
      pickup: true,
      delivery: false,
      packaging: "100% Biodegradable sugarcane pulp container",
      instructions: "Pick up at counter B, show confirmation code.",
      status: "active",
    },
  });

  const listing2 = await prisma.foodListing.create({
    data: {
      restaurantId: restaurant2.id,
      name: "Assorted Sourdough & French Croissant Box",
      category: "Bakery",
      subCategory: "Artisan Breads",
      description: "Baked this morning: 1 loaf of 48-hr fermented sourdough bread and 4 flaky butter croissants.",
      tags: "bread, croissant, bakery, breakfast",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
      ]),
      city: "New Delhi",
      quantity: 12,
      unit: "boxes",
      originalPrice: 450,
      discountedPrice: 0,
      minOrder: 1,
      expiryDate: tomorrowStr,
      expiryTime: "20:00",
      availableFrom: now,
      availableUntil: laterToday,
      ingredients: "Organic unbleached flour, Butter, Wild yeast, Water, Sea salt",
      allergens: JSON.stringify(["Gluten", "Dairy"]),
      dietary: JSON.stringify(["Veg"]),
      storage: "Store in cool dry place",
      pickup: true,
      delivery: true,
      deliveryRadius: 5,
      packaging: "Recycled brown paper packaging",
      instructions: "Collect at the front bakery display.",
      status: "active",
    },
  });

  const listing3 = await prisma.foodListing.create({
    data: {
      restaurantId: restaurant1.id,
      name: "Tandoori Paneer Tikka Platter",
      category: "Prepared Meals",
      subCategory: "Appetizers",
      description: "Marinated cottage cheese cubes grilled in clay tandoor with bell peppers, onions, and mint chutney.",
      tags: "paneer, tikka, tandoor, starter",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
      ]),
      city: "New Delhi",
      quantity: 5,
      unit: "platters",
      originalPrice: 320,
      discountedPrice: 0,
      minOrder: 1,
      expiryDate: tomorrowStr,
      expiryTime: "23:00",
      availableFrom: now,
      availableUntil: laterToday,
      ingredients: "Paneer, Yogurt, Mustard oil, Indian spices, Bell peppers",
      allergens: JSON.stringify(["Dairy"]),
      dietary: JSON.stringify(["Veg", "Gluten-Free"]),
      storage: "Consume within 4 hours",
      pickup: true,
      delivery: false,
      packaging: "Compostable clamshell box",
      instructions: "Show your app claim code at reception.",
      status: "active",
    },
  });

  const listing4 = await prisma.foodListing.create({
    data: {
      restaurantId: restaurant2.id,
      name: "Fresh Farm Fruit & Citrus Basket",
      category: "Fresh Produce",
      subCategory: "Fruits",
      description: "Crisp Shimla apples, sweet Nagpur oranges, and bananas from local organic farms.",
      tags: "fruits, organic, healthy, vegan",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&q=80",
      ]),
      city: "New Delhi",
      quantity: 15,
      unit: "kg",
      originalPrice: 280,
      discountedPrice: 0,
      minOrder: 2,
      expiryDate: tomorrowStr,
      expiryTime: "19:00",
      availableFrom: now,
      availableUntil: laterToday,
      ingredients: "Apples, Oranges, Bananas",
      allergens: JSON.stringify([]),
      dietary: JSON.stringify(["Veg", "Vegan", "Gluten-Free"]),
      storage: "Keep in cool ventilated basket",
      pickup: true,
      delivery: false,
      packaging: "Jute carry pouch",
      instructions: "Available at pickup counter.",
      status: "active",
    },
  });

  // 6. Create Initial Completed Order for Metrics Demonstration
  const order = await prisma.order.create({
    data: {
      consumerId: consumer.id,
      status: "completed",
      foodSaved: 4.5,
      co2Saved: 11.25,
      notes: "Pickup verified and completed successfully.",
      items: {
        create: [
          {
            listingId: listing1.id,
            quantity: 2,
            pickupSlot: "6:00 PM - 8:00 PM",
            name: listing1.name,
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
            restaurantName: "SpiceCraft Bistro",
          },
        ],
      },
    },
  });

  // 7. Create Beneficiary for NGO
  await prisma.beneficiary.create({
    data: {
      ngoId: ngo.id,
      name: "Asha Kiran Children Shelter",
      type: "Children Shelter",
      location: "Lajpat Nagar, New Delhi",
      size: 45,
      contactPhone: "+91 98444 55667",
      mealsReceived: 120,
      notes: "Daily meal distribution center",
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("-----------------------------------------");
  console.log("🔑 Demo Credentials:");
  console.log("• Consumer:   consumer@foodsave.org   / password123");
  console.log("• Restaurant: spicecraft@foodsave.org / password123");
  console.log("• NGO:        ngo@foodsave.org        / password123");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
