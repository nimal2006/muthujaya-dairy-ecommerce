const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

// Import models
const User = require("./models/User");
const Product = require("./models/Product");

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/muthujaya_dairy"
    );
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create users - 1 Admin and 2 Delivery Staff only
    const users = await User.insertMany([
      {
        name: "Muthujaya Admin",
        username: "muthujaya_admin",
        email: "admin@dairy.com",
        password: hashedPassword,
        phone: "9876543210",
        role: "admin",
        address: {
          street: "123 Admin Street",
          city: "Chennai",
          state: "Tamil Nadu",
          pincode: "600001",
        },
        isActive: true,
      },
      {
        name: "Rajesh Kumar",
        username: "delivery_rajesh",
        email: "rajesh@dairy.com",
        password: hashedPassword,
        phone: "9876543211",
        role: "labour",
        address: {
          street: "456 Labour Lane",
          city: "Chennai",
          state: "Tamil Nadu",
          pincode: "600002",
        },
        isActive: true,
      },
      {
        name: "Suresh Babu",
        username: "delivery_suresh",
        email: "suresh@dairy.com",
        password: hashedPassword,
        phone: "9876543213",
        role: "labour",
        address: {
          street: "789 Delivery Street",
          city: "Chennai",
          state: "Tamil Nadu",
          pincode: "600004",
        },
        isActive: true,
      },
    ]);
    console.log("👥 Created test users: 1 Admin + 2 Delivery Staff");

    // Create products
    const products = await Product.insertMany([
      {
        name: "Fresh Cow Milk",
        description: "Pure, fresh cow milk delivered daily from our farm",
        category: "milk",
        pricePerUnit: 60,
        unit: "litre",
        stock: { available: 500, unit: "litre" },
        image:
          "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
        isAvailable: true,
      },
      {
        name: "Buffalo Milk",
        description: "Rich and creamy buffalo milk, high in fat content",
        category: "milk",
        pricePerUnit: 70,
        unit: "litre",
        stock: { available: 300, unit: "litre" },
        image:
          "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
        isAvailable: true,
      },
      {
        name: "Fresh Curd",
        description: "Homemade thick curd, perfect for daily consumption",
        category: "curd",
        pricePerUnit: 50,
        unit: "kg",
        stock: { available: 200, unit: "kg" },
        image:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
        isAvailable: true,
      },
      {
        name: "Paneer",
        description: "Fresh cottage cheese made from pure milk",
        category: "paneer",
        pricePerUnit: 320,
        unit: "kg",
        stock: { available: 100, unit: "kg" },
        image:
          "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
        isAvailable: true,
      },
      {
        name: "Fresh Buttermilk",
        description: "Refreshing buttermilk, perfect for summer",
        category: "buttermilk",
        pricePerUnit: 30,
        unit: "litre",
        stock: { available: 150, unit: "litre" },
        image:
          "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400",
        isAvailable: true,
      },
      {
        name: "Ghee",
        description: "Pure desi ghee made from cow milk",
        category: "ghee",
        pricePerUnit: 600,
        unit: "litre",
        stock: { available: 80, unit: "litre" },
        image:
          "https://images.unsplash.com/photo-1631635589499-afd87d52bf64?w=400",
        isAvailable: true,
      },
    ]);
    console.log("🥛 Created products");

    console.log("\n========================================");
    console.log("✅ Database seeded successfully!");
    console.log("========================================\n");
    console.log("📧 Test Credentials (password: password123):");
    console.log("   Admin:          muthujaya_admin  | admin@dairy.com");
    console.log("   Delivery Boy 1: delivery_rajesh  | rajesh@dairy.com");
    console.log("   Delivery Boy 2: delivery_suresh  | suresh@dairy.com");
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
