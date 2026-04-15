import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Product from '../models/Product';
import connectDB from '../config/database';

dotenv.config();

const HONEY_IMAGE = '/sampleproducthoney.png';

const products = [
  {
    name: "Premium Raw Forest Honey — 250g",
    slug: "premium-raw-forest-honey-250g",
    description:
      "Jugraj Son's Hive Premium Raw Forest Honey is sourced directly from beekeepers in forest belts. 100% pure, natural and unfiltered — no added sugar, no over-processing. Limited batch with rich amber depth and a clean finish. Ideal for daily spoons, warm water, or milk.",
    shortDescription: "Pure forest honey, 250g — direct from beekeepers",
    price: 449,
    originalPrice: 549,
    discount: 18,
    rating: 4.9,
    reviewCount: 128,
    images: [HONEY_IMAGE],
    category: "raw-honey",
    concern: ["immunity", "digestion"],
    productType: "Honey",
    tags: ["bestseller", "raw", "forest"],
    inStock: true,
    stockCount: 120,
    weight: 0.25,
    ingredients: ["100% Raw forest honey"],
    benefits: ["Natural sweetener", "No chemicals", "Unfiltered nutrition", "Rich aroma"],
    usage: "1 tsp daily as-is, with warm water, or in milk. Do not feed infants under 12 months.",
    whoShouldUse: ["Adults & children (as directed)", "Wellness-focused households"],
    isBestseller: true,
    isNew: false,
    sku: "JSH-RFH-250",
  },
  {
    name: "Premium Raw Forest Honey — 500g",
    slug: "premium-raw-forest-honey-500g",
    description:
      "Same premium raw forest profile in a family pack. Natural & unfiltered, bottled in small runs for consistency. Pairs well with breakfast bowls and herbal teas.",
    shortDescription: "Family pack raw forest honey, 500g",
    price: 799,
    originalPrice: 999,
    discount: 20,
    rating: 4.8,
    reviewCount: 94,
    images: [HONEY_IMAGE],
    category: "raw-honey",
    concern: ["immunity", "weight-management"],
    productType: "Honey",
    tags: ["family-pack", "raw", "forest"],
    inStock: true,
    stockCount: 80,
    weight: 0.5,
    ingredients: ["100% Raw forest honey"],
    benefits: ["Value pack", "Pure source", "Versatile kitchen use"],
    usage: "Replace refined sugar in beverages and baking where suitable.",
    whoShouldUse: ["Families", "Regular honey users"],
    isBestseller: true,
    isNew: false,
    sku: "JSH-RFH-500",
  },
  {
    name: "Artisanal Unfiltered Honey — 250g",
    slug: "artisanal-unfiltered-honey-250g",
    description:
      "Coarse-filtered only for wax; retains pollen character and depth. Handled in limited batches for a true artisanal profile — bold forest notes with a smooth mouthfeel.",
    shortDescription: "Artisanal unfiltered honey, 250g",
    price: 479,
    originalPrice: 579,
    discount: 17,
    rating: 4.7,
    reviewCount: 61,
    images: [HONEY_IMAGE],
    category: "raw-honey",
    concern: ["digestion", "skin-hair"],
    productType: "Honey",
    tags: ["artisanal", "unfiltered", "limited"],
    inStock: true,
    stockCount: 90,
    weight: 0.25,
    ingredients: ["Unfiltered raw honey"],
    benefits: ["Retains natural character", "No over-processing", "Craft batch"],
    usage: "Best enjoyed raw on toast or with lemon water.",
    whoShouldUse: ["Food enthusiasts", "Gift buyers"],
    isBestseller: false,
    isNew: true,
    sku: "JSH-AUH-250",
  },
  {
    name: "Pure Wildflower Nectar — 350g",
    slug: "pure-wildflower-nectar-350g",
    description:
      "Multi-flora nectar from open meadows and forest edges. Balanced sweetness with floral highs — a versatile everyday honey from Jugraj Son's Hive.",
    shortDescription: "Balanced wildflower nectar, 350g",
    price: 549,
    originalPrice: 649,
    discount: 15,
    rating: 4.8,
    reviewCount: 77,
    images: [HONEY_IMAGE],
    category: "raw-honey",
    concern: ["immunity", "sleep-stress"],
    productType: "Honey",
    tags: ["wildflower", "multi-flora"],
    inStock: true,
    stockCount: 100,
    weight: 0.35,
    ingredients: ["Raw wildflower honey"],
    benefits: ["Balanced taste", "Everyday use", "Natural energy"],
    usage: "Stir into herbal teas or drizzle over yogurt.",
    whoShouldUse: ["Daily wellness routines", "Office pantries"],
    isBestseller: false,
    isNew: false,
    sku: "JSH-PWN-350",
  },
  {
    name: "Jungle Harvest Raw Honey — 500g",
    slug: "jungle-harvest-raw-honey-500g",
    description:
      "Harvest windows aligned with peak blossom in jungle-adjacent apiaries. Deep colour, slow crystallisation tendency — signature of high pollen load and minimal heat.",
    shortDescription: "Deep jungle-harvest raw honey, 500g",
    price: 849,
    originalPrice: 1049,
    discount: 19,
    rating: 4.9,
    reviewCount: 52,
    images: [HONEY_IMAGE],
    category: "raw-honey",
    concern: ["men-health", "immunity"],
    productType: "Honey",
    tags: ["jungle", "limited-batch", "dark"],
    inStock: true,
    stockCount: 55,
    weight: 0.5,
    ingredients: ["Raw jungle-region honey"],
    benefits: ["Bold flavour", "High natural character", "Beekeeper-direct ethos"],
    usage: "1–2 tsp post-workout in water or with dry fruits.",
    whoShouldUse: ["Active lifestyles", "Connoisseurs"],
    isBestseller: true,
    isNew: false,
    sku: "JSH-JHR-500",
  },
  {
    name: "Beekeeper's Special Forest Honey — 400g",
    slug: "beekeepers-special-forest-honey-400g",
    description:
      "Curated lot from our partner beekeepers — extra QC on moisture and HMF indicators. Forest-forward taste with a clean label promise: pure, natural, unfiltered.",
    shortDescription: "Curated beekeeper special, 400g",
    price: 629,
    originalPrice: 749,
    discount: 16,
    rating: 4.6,
    reviewCount: 43,
    images: [HONEY_IMAGE],
    category: "raw-honey",
    concern: ["heart-health", "immunity"],
    productType: "Honey",
    tags: ["curated", "qc", "forest"],
    inStock: true,
    stockCount: 70,
    weight: 0.4,
    ingredients: ["Raw forest honey"],
    benefits: ["Trusted sourcing", "Consistent quality", "Gift-ready"],
    usage: "Drizzle on desserts or use in marinades.",
    whoShouldUse: ["Gifting", "Quality-first buyers"],
    isBestseller: false,
    isNew: false,
    sku: "JSH-BSF-400",
  },
  {
    name: "Limited Batch Forest Gold — 250g",
    slug: "limited-batch-forest-gold-250g",
    description:
      "Small-run Forest Gold label — same raw promise, numbered feel for collectors and repeat buyers. No added sugar; crystallisation may occur naturally (gentle warmth restores).",
    shortDescription: "Limited batch forest gold, 250g",
    price: 499,
    originalPrice: 599,
    discount: 17,
    rating: 5.0,
    reviewCount: 36,
    images: [HONEY_IMAGE],
    category: "raw-honey",
    concern: ["immunity", "skin-hair"],
    productType: "Honey",
    tags: ["limited", "gold-label", "collectible"],
    inStock: true,
    stockCount: 40,
    weight: 0.25,
    ingredients: ["100% Raw forest honey"],
    benefits: ["Exclusive batch", "Pure label", "Premium presentation"],
    usage: "Enjoy raw to appreciate full aroma.",
    whoShouldUse: ["Collectors", "Premium gifting"],
    isBestseller: false,
    isNew: true,
    sku: "JSH-LBG-250",
  },
  {
    name: "Natural Comb Honey Chunk — 300g",
    slug: "natural-comb-honey-chunk-300g",
    description:
      "Chunk-style cut comb in honey — textural experience with authentic wax chew (optional). Sourced with hive hygiene in mind; same Jugraj Son's Hive purity standards.",
    shortDescription: "Comb-in-honey experience, 300g",
    price: 699,
    originalPrice: 849,
    discount: 18,
    rating: 4.7,
    reviewCount: 29,
    images: [HONEY_IMAGE],
    category: "raw-honey",
    concern: ["digestion", "immunity"],
    productType: "Honey",
    tags: ["comb", "texture", "natural"],
    inStock: true,
    stockCount: 35,
    weight: 0.3,
    ingredients: ["Raw honey with natural beeswax comb"],
    benefits: ["Unique texture", "Whole-hive experience", "Pure"],
    usage: "Spread on warm bread; chew wax lightly or remove as preferred.",
    whoShouldUse: ["Adventure eaters", "Honey lovers"],
    isBestseller: false,
    isNew: true,
    sku: "JSH-NCC-300",
  },
  {
    name: "Organic Pantry Raw Honey — 1kg",
    slug: "organic-pantry-raw-honey-1kg",
    description:
      "Stock-up jar for pantries that run on honey. Same raw forest ethos in a 1kg pack — ideal for families, baking, and daily lemon-honey routines. No added sugar; store cool and dry.",
    shortDescription: "Pantry stock raw honey, 1kg",
    price: 1449,
    originalPrice: 1749,
    discount: 17,
    rating: 4.8,
    reviewCount: 88,
    images: [HONEY_IMAGE],
    category: "raw-honey",
    concern: ["immunity", "digestion"],
    productType: "Honey",
    tags: ["bulk", "pantry", "family"],
    inStock: true,
    stockCount: 45,
    weight: 1,
    ingredients: ["100% Raw honey"],
    benefits: ["Best per-gram value", "Versatile", "Long-lasting supply"],
    usage: "Use as a natural sweetener across recipes and drinks.",
    whoShouldUse: ["Large households", "Frequent users"],
    isBestseller: true,
    isNew: false,
    sku: "JSH-OPR-1000",
  },
  {
    name: "Royal Reserve Dark Forest Honey — 500g",
    slug: "royal-reserve-dark-forest-honey-500g",
    description:
      "Royal Reserve line highlights our darkest, slowest-flowing lots — intense forest character and lingering finish. Small batches; bottled as nature presents it — unfiltered and honest.",
    shortDescription: "Reserve dark forest honey, 500g",
    price: 949,
    originalPrice: 1199,
    discount: 21,
    rating: 4.9,
    reviewCount: 41,
    images: [HONEY_IMAGE],
    category: "raw-honey",
    concern: ["immunity", "sleep-stress"],
    productType: "Honey",
    tags: ["reserve", "dark", "premium"],
    inStock: true,
    stockCount: 30,
    weight: 0.5,
    ingredients: ["100% Raw dark forest honey"],
    benefits: ["Intense profile", "Premium tier", "Memorable taste"],
    usage: "Savour plain or with aged cheese pairings.",
    whoShouldUse: ["Gifting", "Flavor seekers"],
    isBestseller: false,
    isNew: true,
    sku: "JSH-RRD-500",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: 'admin.new@jugrajsonshive.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await User.create({
        name: 'Admin User',
        email: 'admin.new@jugrajsonshive.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Admin user created');
    } else {
      await User.updateOne(
        { email: 'admin.new@jugrajsonshive.com' },
        { $set: { role: 'admin' } },
      );
      console.log('✅ Admin user updated');
    }

    for (const p of products) {
      await Product.findOneAndUpdate({ slug: p.slug }, { $set: p }, { upsert: true, new: true, runValidators: true });
    }
    console.log(`✅ ${products.length} products seeded (upserted by slug)`);

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error: unknown) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
