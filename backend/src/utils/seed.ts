import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Product from '../models/Product';
import connectDB from '../config/database';

dotenv.config();

const products = [
  {
    name: "Balbuddhi Swarn Prashan",
    slug: "balbuddhi-swarn-prashan",
    description: "Premium Swarna Prashan formulation for children's immunity and cognitive development. This ancient Ayurvedic practice uses purified gold with herbs to boost overall health and intelligence in growing children.",
    shortDescription: "Children's immunity & brain development drops",
    price: 1650,
    originalPrice: 2199,
    discount: 25,
    rating: 4.9,
    reviewCount: 856,
    images: ["https://vaidyadeepayurveda.com/cdn/shop/files/Balbuddhi_swarna_parashan.png?v=1759986352&width=533"],
    category: "syrups",
    concern: ["immunity", "stress-sleep"],
    productType: "Drops",
    tags: ["bestseller", "children", "immunity"],
    inStock: true,
    stockCount: 150,
    ingredients: ["Swarna Bhasma", "Brahmi", "Vacha", "Honey", "Ghee"],
    benefits: ["Boosts immunity in children", "Enhances memory & concentration", "Improves digestion", "Supports physical growth", "Develops cognitive abilities"],
    usage: "Give 2-4 drops to children on empty stomach in morning. Best given during Pushya Nakshatra.",
    whoShouldUse: ["Children aged 0-16 years", "Kids with weak immunity", "Students needing focus"],
    isBestseller: true,
    isNew: false,
    sku: "VD-BSP-001"
  },
  {
    name: "Deep Slim Fit Plus Capsule",
    slug: "deep-slim-fit-plus-capsule",
    description: "Advanced weight management formula with powerful Ayurvedic herbs. Helps in natural fat metabolism, reduces appetite, and supports healthy weight loss without side effects.",
    shortDescription: "Natural weight management & metabolism booster",
    price: 1520,
    originalPrice: 1599,
    discount: 5,
    rating: 4.7,
    reviewCount: 1243,
    images: ["https://vaidyadeepayurveda.com/cdn/shop/files/Vaidyadeep_Deep_Slim_Fit_Plus.jpg?v=1758536021&width=533"],
    category: "capsules",
    concern: ["weight-management", "digestion"],
    productType: "Capsules",
    tags: ["weight-loss", "metabolism", "ayurvedic"],
    inStock: true,
    stockCount: 200,
    ingredients: ["Garcinia Cambogia", "Triphala", "Guggul", "Medohar Guggul", "Green Tea Extract"],
    benefits: ["Promotes natural fat burning", "Reduces appetite", "Boosts metabolism", "Detoxifies body", "Improves digestion"],
    usage: "Take 1-2 capsules twice daily with lukewarm water before meals.",
    whoShouldUse: ["Adults with weight concerns", "Those with slow metabolism", "Health conscious individuals"],
    isBestseller: true,
    isNew: false,
    sku: "VD-DSF-001"
  },
  {
    name: "Diaba Tune D.S. Capsule",
    slug: "diaba-tune-ds-capsule",
    description: "Double strength Ayurvedic formulation for effective blood sugar management. Contains potent herbs that support pancreatic function and improve insulin sensitivity naturally.",
    shortDescription: "Double strength diabetes care formula",
    price: 1520,
    originalPrice: 1599,
    discount: 5,
    rating: 4.8,
    reviewCount: 1876,
    images: ["https://vaidyadeepayurveda.com/cdn/shop/files/Vaidyadeep_Diaba_Tune_DS_capsules.png?v=1760083680&width=533"],
    category: "capsules",
    concern: ["diabetes-care"],
    productType: "Capsules",
    tags: ["diabetes", "blood-sugar", "ayurvedic"],
    inStock: true,
    stockCount: 180,
    ingredients: ["Karela", "Jamun", "Gudmar", "Vijaysar", "Methi", "Neem"],
    benefits: ["Maintains healthy blood sugar", "Supports insulin function", "Reduces sugar cravings", "Protects vital organs", "Improves energy levels"],
    usage: "Take 1-2 capsules twice daily with water after meals or as directed by physician.",
    whoShouldUse: ["Type 2 diabetics", "Pre-diabetics", "Those with family history of diabetes"],
    isBestseller: true,
    isNew: false,
    sku: "VD-DTD-001"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@atharva.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Admin User',
        email: 'admin@atharva.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created');
    } else {
      // Update existing user to admin
      await User.updateOne(
        { email: 'admin@atharva.com' },
        { $set: { role: 'admin' } }
      );
      console.log('✅ Admin user updated');
    }

    // Add products
    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      await Product.insertMany(products);
      console.log(`✅ ${products.length} products added`);
    } else {
      console.log(`ℹ️  ${existingProducts} products already exist`);
    }

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

