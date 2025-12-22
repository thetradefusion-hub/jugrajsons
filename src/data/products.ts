export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  concern: string[];
  productType: string;
  tags: string[];
  inStock: boolean;
  stockCount: number;
  ingredients: string[];
  benefits: string[];
  usage: string;
  whoShouldUse: string[];
  isBestseller: boolean;
  isNew: boolean;
  sku: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Concern {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export const concerns: Concern[] = [
  { id: "1", name: "Immunity", slug: "immunity", icon: "🛡️", description: "Boost your natural immunity" },
  { id: "2", name: "Digestion", slug: "digestion", icon: "🌿", description: "Improve digestive health" },
  { id: "3", name: "Weight Management", slug: "weight-management", icon: "⚖️", description: "Healthy weight solutions" },
  { id: "4", name: "Skin & Hair", slug: "skin-hair", icon: "✨", description: "Natural beauty care" },
  { id: "5", name: "Women's Health", slug: "womens-health", icon: "🌸", description: "Complete women wellness" },
  { id: "6", name: "Men's Health", slug: "mens-health", icon: "💪", description: "Vitality for men" },
  { id: "7", name: "Joint & Bone", slug: "joint-bone", icon: "🦴", description: "Mobility & strength" },
  { id: "8", name: "Stress & Sleep", slug: "stress-sleep", icon: "😴", description: "Calm mind, better sleep" },
  { id: "9", name: "Heart Health", slug: "heart-health", icon: "❤️", description: "Cardiovascular wellness" },
  { id: "10", name: "Diabetes Care", slug: "diabetes-care", icon: "🩸", description: "Blood sugar support" },
];

export const productTypes: Category[] = [
  { id: "1", name: "Capsules & Tablets", slug: "capsules", description: "Easy to consume herbal capsules", image: "/placeholder.svg", productCount: 45 },
  { id: "2", name: "Oils", slug: "oils", description: "Therapeutic herbal oils", image: "/placeholder.svg", productCount: 23 },
  { id: "3", name: "Syrups & Juices", slug: "syrups", description: "Liquid herbal formulations", image: "/placeholder.svg", productCount: 18 },
  { id: "4", name: "Powders", slug: "powders", description: "Traditional churnas & powders", image: "/placeholder.svg", productCount: 32 },
  { id: "5", name: "Balms & Ointments", slug: "balms", description: "Topical herbal applications", image: "/placeholder.svg", productCount: 15 },
  { id: "6", name: "Combo Packs", slug: "combos", description: "Value bundles for complete care", image: "/placeholder.svg", productCount: 12 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Ashwagandha Gold Capsules",
    slug: "ashwagandha-gold-capsules",
    description: "Premium Ashwagandha extract enriched with gold bhasma for enhanced stress relief and vitality. Our flagship formulation uses KSM-66 Ashwagandha root extract, known for its superior bioavailability and clinically proven benefits.",
    shortDescription: "Stress relief & energy booster with gold bhasma",
    price: 599,
    originalPrice: 799,
    discount: 25,
    rating: 4.8,
    reviewCount: 2456,
    images: ["/placeholder.svg"],
    category: "capsules",
    concern: ["stress-sleep", "immunity", "mens-health"],
    productType: "Capsules",
    tags: ["bestseller", "ayurvedic", "stress-relief"],
    inStock: true,
    stockCount: 150,
    ingredients: ["KSM-66 Ashwagandha", "Gold Bhasma", "Black Pepper Extract", "Shilajit"],
    benefits: ["Reduces stress & anxiety", "Boosts energy levels", "Improves sleep quality", "Enhances cognitive function", "Supports muscle strength"],
    usage: "Take 1-2 capsules twice daily with warm milk or water after meals.",
    whoShouldUse: ["Adults experiencing stress", "Those with low energy", "People with sleep issues", "Fitness enthusiasts"],
    isBestseller: true,
    isNew: false,
    sku: "ATH-ASH-001"
  },
  {
    id: "2",
    name: "Triphala Churna Premium",
    slug: "triphala-churna-premium",
    description: "Authentic Triphala powder made from three powerful fruits - Amla, Haritaki, and Bibhitaki. This ancient Ayurvedic formulation supports digestive health and natural detoxification.",
    shortDescription: "Natural digestive care & detox formula",
    price: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.7,
    reviewCount: 1823,
    images: ["/placeholder.svg"],
    category: "powders",
    concern: ["digestion", "immunity"],
    productType: "Powder",
    tags: ["organic", "ayurvedic", "digestive"],
    inStock: true,
    stockCount: 200,
    ingredients: ["Amla", "Haritaki", "Bibhitaki"],
    benefits: ["Improves digestion", "Natural detoxification", "Supports eye health", "Boosts immunity", "Promotes healthy bowel movements"],
    usage: "Mix 1 teaspoon with warm water and consume before bedtime.",
    whoShouldUse: ["Those with digestive issues", "Anyone seeking natural detox", "Health conscious individuals"],
    isBestseller: true,
    isNew: false,
    sku: "ATH-TRI-001"
  },
  {
    id: "3",
    name: "Chyawanprash Special",
    slug: "chyawanprash-special",
    description: "A powerful immunity booster made with 40+ natural herbs and enriched with pure honey and amla. Our Chyawanprash follows the traditional recipe passed down through generations.",
    shortDescription: "40+ herbs immunity booster with pure honey",
    price: 449,
    originalPrice: 549,
    discount: 18,
    rating: 4.9,
    reviewCount: 3102,
    images: ["/placeholder.svg"],
    category: "syrups",
    concern: ["immunity", "digestion"],
    productType: "Paste",
    tags: ["immunity", "winter-care", "family"],
    inStock: true,
    stockCount: 180,
    ingredients: ["Amla", "Ghee", "Honey", "Pippali", "Cardamom", "Cinnamon", "40+ herbs"],
    benefits: ["Boosts immunity naturally", "Rich in Vitamin C", "Improves respiratory health", "Enhances digestion", "Provides daily nutrition"],
    usage: "Take 1-2 teaspoons daily with warm milk in morning.",
    whoShouldUse: ["All age groups above 3 years", "Those prone to seasonal illness", "Growing children"],
    isBestseller: true,
    isNew: false,
    sku: "ATH-CHY-001"
  },
  {
    id: "4",
    name: "Kesini Hair Oil",
    slug: "kesini-hair-oil",
    description: "A nourishing blend of 18 Ayurvedic herbs infused in coconut and sesame oil base. Promotes healthy hair growth, reduces hair fall, and adds natural shine.",
    shortDescription: "18 herbs hair nourishment formula",
    price: 349,
    originalPrice: 449,
    discount: 22,
    rating: 4.6,
    reviewCount: 987,
    images: ["/placeholder.svg"],
    category: "oils",
    concern: ["skin-hair"],
    productType: "Oil",
    tags: ["hair-care", "natural", "ayurvedic"],
    inStock: true,
    stockCount: 120,
    ingredients: ["Bhringraj", "Amla", "Brahmi", "Coconut Oil", "Sesame Oil", "Hibiscus", "Neem"],
    benefits: ["Reduces hair fall", "Promotes new hair growth", "Prevents premature greying", "Nourishes scalp", "Adds natural shine"],
    usage: "Warm the oil slightly and massage into scalp. Leave for 1-2 hours or overnight before washing.",
    whoShouldUse: ["Those with hair fall issues", "Anyone with dry scalp", "People seeking natural hair care"],
    isBestseller: false,
    isNew: true,
    sku: "ATH-KES-001"
  },
  {
    id: "5",
    name: "Shilajit Gold Resin",
    slug: "shilajit-gold-resin",
    description: "Pure Himalayan Shilajit resin sourced from 18,000 feet altitude. Enriched with gold and silver bhasma for maximum potency and vitality enhancement.",
    shortDescription: "Pure Himalayan vitality enhancer",
    price: 1299,
    originalPrice: 1599,
    discount: 19,
    rating: 4.8,
    reviewCount: 756,
    images: ["/placeholder.svg"],
    category: "capsules",
    concern: ["mens-health", "immunity", "stress-sleep"],
    productType: "Resin",
    tags: ["premium", "vitality", "mens-wellness"],
    inStock: true,
    stockCount: 80,
    ingredients: ["Pure Himalayan Shilajit", "Gold Bhasma", "Silver Bhasma"],
    benefits: ["Enhances stamina & energy", "Supports testosterone levels", "Improves cognitive function", "Anti-aging properties", "Boosts overall vitality"],
    usage: "Dissolve a pea-sized amount in warm milk or water. Take once daily in morning.",
    whoShouldUse: ["Men above 25 years", "Those seeking energy boost", "Active lifestyle individuals"],
    isBestseller: true,
    isNew: false,
    sku: "ATH-SHI-001"
  },
  {
    id: "6",
    name: "Shatavari Women's Wellness",
    slug: "shatavari-womens-wellness",
    description: "Premium Shatavari extract formulated specifically for women's health. Supports hormonal balance, reproductive health, and overall feminine wellness.",
    shortDescription: "Complete women's hormonal balance",
    price: 549,
    originalPrice: 699,
    discount: 21,
    rating: 4.7,
    reviewCount: 1245,
    images: ["/placeholder.svg"],
    category: "capsules",
    concern: ["womens-health", "immunity"],
    productType: "Capsules",
    tags: ["womens-care", "hormonal", "ayurvedic"],
    inStock: true,
    stockCount: 140,
    ingredients: ["Shatavari Extract", "Ashoka", "Lodhra", "Jatamansi"],
    benefits: ["Balances hormones naturally", "Supports menstrual health", "Enhances lactation", "Improves fertility", "Reduces menopausal symptoms"],
    usage: "Take 1 capsule twice daily with water after meals.",
    whoShouldUse: ["Women of all ages", "Those with menstrual issues", "New mothers", "Women approaching menopause"],
    isBestseller: false,
    isNew: false,
    sku: "ATH-SHA-001"
  },
  {
    id: "7",
    name: "Ortho Care Oil",
    slug: "ortho-care-oil",
    description: "Deep penetrating pain relief oil for joints and muscles. Made with Mahanarayan oil base and enriched with powerful anti-inflammatory herbs.",
    shortDescription: "Fast acting joint & muscle pain relief",
    price: 399,
    originalPrice: 499,
    discount: 20,
    rating: 4.6,
    reviewCount: 2134,
    images: ["/placeholder.svg"],
    category: "oils",
    concern: ["joint-bone"],
    productType: "Oil",
    tags: ["pain-relief", "joints", "massage"],
    inStock: true,
    stockCount: 160,
    ingredients: ["Mahanarayan Oil", "Eucalyptus", "Wintergreen", "Camphor", "Turpentine"],
    benefits: ["Quick pain relief", "Reduces inflammation", "Improves joint mobility", "Relaxes muscles", "Provides warming sensation"],
    usage: "Gently massage on affected area 2-3 times daily. For best results, apply after warm compress.",
    whoShouldUse: ["Those with joint pain", "Athletes", "Elderly individuals", "Desk workers with body aches"],
    isBestseller: true,
    isNew: false,
    sku: "ATH-ORT-001"
  },
  {
    id: "8",
    name: "Brahmi Memory Plus",
    slug: "brahmi-memory-plus",
    description: "Enhance your cognitive function with this powerful brain tonic. Brahmi Memory Plus improves concentration, memory retention, and mental clarity.",
    shortDescription: "Brain health & memory enhancement",
    price: 449,
    originalPrice: 599,
    discount: 25,
    rating: 4.5,
    reviewCount: 876,
    images: ["/placeholder.svg"],
    category: "capsules",
    concern: ["stress-sleep"],
    productType: "Capsules",
    tags: ["brain-health", "memory", "students"],
    inStock: true,
    stockCount: 130,
    ingredients: ["Brahmi", "Shankhpushpi", "Vacha", "Jyotishmati", "Gotu Kola"],
    benefits: ["Enhances memory power", "Improves concentration", "Reduces mental fatigue", "Supports learning ability", "Calms the mind"],
    usage: "Take 1-2 capsules daily with water after breakfast.",
    whoShouldUse: ["Students", "Working professionals", "Elderly for cognitive support", "Those with mental stress"],
    isBestseller: false,
    isNew: true,
    sku: "ATH-BRA-001"
  },
  {
    id: "9",
    name: "Diabetic Care Tablets",
    slug: "diabetic-care-tablets",
    description: "Natural blood sugar management with powerful Ayurvedic herbs. Helps maintain healthy glucose levels and supports pancreatic function.",
    shortDescription: "Natural blood sugar management",
    price: 649,
    originalPrice: 799,
    discount: 19,
    rating: 4.7,
    reviewCount: 1567,
    images: ["/placeholder.svg"],
    category: "capsules",
    concern: ["diabetes-care"],
    productType: "Tablets",
    tags: ["diabetes", "blood-sugar", "metabolic"],
    inStock: true,
    stockCount: 110,
    ingredients: ["Karela", "Jamun", "Gurmar", "Methi", "Vijaysar", "Neem"],
    benefits: ["Maintains blood sugar levels", "Supports insulin sensitivity", "Reduces sugar cravings", "Supports pancreatic health", "Improves metabolism"],
    usage: "Take 2 tablets twice daily with water before meals.",
    whoShouldUse: ["Pre-diabetics", "Type 2 diabetics (as supplement)", "Those with family history of diabetes"],
    isBestseller: false,
    isNew: false,
    sku: "ATH-DIA-001"
  },
  {
    id: "10",
    name: "Hridya Heart Care",
    slug: "hridya-heart-care",
    description: "Comprehensive heart health formula with Arjuna bark and other cardio-protective herbs. Supports healthy cholesterol levels and cardiovascular function.",
    shortDescription: "Complete cardiovascular support",
    price: 599,
    originalPrice: 749,
    discount: 20,
    rating: 4.8,
    reviewCount: 923,
    images: ["/placeholder.svg"],
    category: "capsules",
    concern: ["heart-health"],
    productType: "Capsules",
    tags: ["heart", "cholesterol", "cardio"],
    inStock: true,
    stockCount: 100,
    ingredients: ["Arjuna", "Pushkarmool", "Guggul", "Garlic", "Punarnava"],
    benefits: ["Supports heart function", "Maintains healthy cholesterol", "Regulates blood pressure", "Improves circulation", "Reduces oxidative stress"],
    usage: "Take 1 capsule twice daily with water after meals.",
    whoShouldUse: ["Adults above 35", "Those with cholesterol concerns", "People with sedentary lifestyle"],
    isBestseller: false,
    isNew: false,
    sku: "ATH-HRI-001"
  },
  {
    id: "11",
    name: "Kumkumadi Face Oil",
    slug: "kumkumadi-face-oil",
    description: "Luxurious Ayurvedic face oil with saffron and 16 potent herbs. Illuminates skin, reduces blemishes, and provides intense nourishment.",
    shortDescription: "Saffron-infused radiance booster",
    price: 899,
    originalPrice: 1199,
    discount: 25,
    rating: 4.9,
    reviewCount: 2341,
    images: ["/placeholder.svg"],
    category: "oils",
    concern: ["skin-hair"],
    productType: "Oil",
    tags: ["face-care", "saffron", "luxury"],
    inStock: true,
    stockCount: 90,
    ingredients: ["Saffron", "Sandalwood", "Lotus", "Vetiver", "Manjishtha", "Licorice"],
    benefits: ["Brightens complexion", "Reduces dark spots", "Anti-aging properties", "Deep nourishment", "Improves skin texture"],
    usage: "Apply 3-4 drops on cleansed face at night. Massage gently in upward motions.",
    whoShouldUse: ["Those with dull skin", "Anyone seeking natural glow", "All skin types"],
    isBestseller: true,
    isNew: false,
    sku: "ATH-KUM-001"
  },
  {
    id: "12",
    name: "Liver Detox Syrup",
    slug: "liver-detox-syrup",
    description: "Gentle yet effective liver cleansing formula with Bhumiamla and Kutki. Supports liver function and natural detoxification processes.",
    shortDescription: "Natural liver cleansing formula",
    price: 349,
    originalPrice: 449,
    discount: 22,
    rating: 4.5,
    reviewCount: 654,
    images: ["/placeholder.svg"],
    category: "syrups",
    concern: ["digestion"],
    productType: "Syrup",
    tags: ["liver", "detox", "digestive"],
    inStock: true,
    stockCount: 85,
    ingredients: ["Bhumiamla", "Kutki", "Kalmegh", "Kasni", "Makoy"],
    benefits: ["Cleanses liver naturally", "Improves digestion", "Supports metabolism", "Reduces toxin buildup", "Enhances appetite"],
    usage: "Take 2 teaspoons twice daily with water before meals.",
    whoShouldUse: ["Those with liver concerns", "People with poor digestion", "Anyone seeking detox"],
    isBestseller: false,
    isNew: true,
    sku: "ATH-LIV-001"
  },
];

export const testimonials = [
  {
    id: "1",
    name: "Rajesh Sharma",
    location: "Delhi",
    rating: 5,
    text: "I've been using Ashwagandha Gold for 3 months now and the difference in my energy levels is remarkable. Highly recommend!",
    product: "Ashwagandha Gold Capsules",
    image: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Priya Patel",
    location: "Mumbai",
    rating: 5,
    text: "The Kumkumadi Face Oil has transformed my skin. Natural glow without any harsh chemicals. Love it!",
    product: "Kumkumadi Face Oil",
    image: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Amit Kumar",
    location: "Bangalore",
    rating: 5,
    text: "Chyawanprash Special has become a family tradition now. Kids love the taste and we've seen fewer sick days!",
    product: "Chyawanprash Special",
    image: "/placeholder.svg"
  },
  {
    id: "4",
    name: "Sunita Devi",
    location: "Jaipur",
    rating: 5,
    text: "Shatavari helped me during my menopause journey. Natural and effective without any side effects.",
    product: "Shatavari Women's Wellness",
    image: "/placeholder.svg"
  },
];

export const blogPosts = [
  {
    id: "1",
    title: "5 Ayurvedic Herbs for Better Sleep",
    excerpt: "Discover natural remedies for quality sleep without side effects.",
    image: "/placeholder.svg",
    category: "Wellness",
    date: "Dec 15, 2024",
    readTime: "5 min read"
  },
  {
    id: "2",
    title: "Winter Immunity Guide with Ayurveda",
    excerpt: "Strengthen your defenses naturally this winter season.",
    image: "/placeholder.svg",
    category: "Immunity",
    date: "Dec 10, 2024",
    readTime: "7 min read"
  },
  {
    id: "3",
    title: "Understanding Your Dosha Type",
    excerpt: "Learn how to identify your body type for personalized wellness.",
    image: "/placeholder.svg",
    category: "Ayurveda Basics",
    date: "Dec 5, 2024",
    readTime: "8 min read"
  },
];
