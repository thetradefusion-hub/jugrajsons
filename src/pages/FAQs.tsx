import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, Search, HelpCircle, Package, CreditCard, 
  Truck, RefreshCw, Shield, User, FileQuestion
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/seo/SEO';
import { cn } from '@/lib/utils';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'products' | 'orders' | 'shipping' | 'payment' | 'returns' | 'account';
}

const faqs: FAQ[] = [
  // General
  {
    id: '1',
    category: 'general',
    question: "What is Jugraj Son's Hive?",
    answer: "Jugraj Son's Hive is a trusted raw honey brand focused on pure, natural honey sourced from reliable apiaries. We offer multiple honey variants for daily use, wellness, and gifting.",
  },
  {
    id: '2',
    category: 'general',
    question: 'Are your products authentic and certified?',
    answer: 'Yes, all our products are 100% authentic, GMP-certified, and manufactured in state-of-the-art facilities. We source ingredients from trusted suppliers and ensure strict quality control at every step.',
  },
  {
    id: '3',
    category: 'general',
    question: 'How do I choose the right honey for daily use?',
    answer: 'For daily use, start with mild variants like Lychee or Multi-Flora. For stronger flavor, try Ajwain or Jamun honey. You can also choose based on taste preference and usage like tea, toast, or warm water.',
  },
  {
    id: '4',
    category: 'general',
    question: 'How can I track my order?',
    answer: 'Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order status in the "My Orders" section of your account dashboard.',
  },
  // Products
  {
    id: '5',
    category: 'products',
    question: 'What types of products do you offer?',
    answer: 'We offer a comprehensive range of Ayurvedic products including herbal supplements, wellness products, skincare items, immunity boosters, digestive aids, and specialized health solutions.',
  },
  {
    id: '6',
    category: 'products',
    question: 'Are your products safe to use?',
    answer: 'Absolutely! Our honey is sourced from trusted apiaries and checked for quality and purity. If you have specific medical conditions, please consult your healthcare provider before making dietary changes.',
  },
  {
    id: '7',
    category: 'products',
    question: 'How should I store the products?',
    answer: 'Most products should be stored in a cool, dry place away from direct sunlight. Some products may require refrigeration - please check the product label for specific storage instructions.',
  },
  {
    id: '8',
    category: 'products',
    question: 'What is the shelf life of your products?',
    answer: 'Shelf life varies by product and is clearly mentioned on each product label. Generally, our products have a shelf life of 2-3 years from the date of manufacture when stored properly.',
  },
  // Orders
  {
    id: '9',
    category: 'orders',
    question: 'How do I place an order?',
    answer: 'Simply browse our products, add items to your cart, and proceed to checkout. You can place orders as a guest or create an account for faster checkout and order tracking.',
  },
  {
    id: '10',
    category: 'orders',
    question: 'Can I modify or cancel my order?',
    answer: 'You can modify or cancel your order within 2 hours of placing it, provided it hasn\'t been shipped yet. After that, please contact our support team for assistance.',
  },
  {
    id: '11',
    category: 'orders',
    question: 'How long does it take to process an order?',
    answer: 'Orders are typically processed within 1-2 business days. During peak seasons or sales, processing may take up to 3 business days.',
  },
  {
    id: '12',
    category: 'orders',
    question: 'Can I order products in bulk?',
    answer: "Yes, we offer bulk ordering options for businesses and institutions. Please contact our sales team at connect@jugrajsonshive.com for bulk pricing and custom orders.",
  },
  // Shipping
  {
    id: '13',
    category: 'shipping',
    question: 'What are your shipping charges?',
    answer: 'Shipping charges vary based on your location and order value. We offer free shipping on orders above Rs. 999. Standard shipping charges apply for orders below this amount.',
  },
  {
    id: '14',
    category: 'shipping',
    question: 'How long does delivery take?',
    answer: 'Delivery typically takes 3-7 business days depending on your location. Express delivery options are available for faster shipping at additional charges.',
  },
  {
    id: '15',
    category: 'shipping',
    question: 'Do you ship internationally?',
    answer: 'Currently, we ship within India only. We are working on expanding our international shipping services. Please check back soon or contact us for updates.',
  },
  {
    id: '16',
    category: 'shipping',
    question: 'What if my package is damaged or lost?',
    answer: 'If your package arrives damaged or is lost in transit, please contact our support team immediately with your order number. We will investigate and provide a replacement or full refund.',
  },
  // Payment
  {
    id: '17',
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major payment methods including credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay. We also support Cash on Delivery (COD) for eligible orders.',
  },
  {
    id: '18',
    category: 'payment',
    question: 'Is my payment information secure?',
    answer: 'Yes, we use industry-standard encryption and secure payment gateways (Razorpay) to protect your payment information. We never store your complete card details on our servers.',
  },
  {
    id: '19',
    category: 'payment',
    question: 'When will I be charged for my order?',
    answer: 'For online payments, you will be charged immediately upon order confirmation. For Cash on Delivery orders, payment is collected when the package is delivered.',
  },
  {
    id: '20',
    category: 'payment',
    question: 'Can I get a refund if I cancel my order?',
    answer: 'Yes, refunds are processed within 5-7 business days after order cancellation. The refund will be credited to your original payment method.',
  },
  // Returns
  {
    id: '21',
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a 7-day return policy for unopened and unused products in their original packaging. Products must be returned within 7 days of delivery to be eligible for a refund.',
  },
  {
    id: '22',
    category: 'returns',
    question: 'How do I return a product?',
    answer: 'You can initiate a return from your "My Orders" section. Select the item you want to return, provide a reason, and our team will process your return request. We will arrange for pickup or provide return instructions.',
  },
  {
    id: '23',
    category: 'returns',
    question: 'Are there any products that cannot be returned?',
    answer: 'Personalized products, perishable items, and products that have been opened or used cannot be returned. Please check the product description for specific return eligibility.',
  },
  {
    id: '24',
    category: 'returns',
    question: 'How long does it take to process a refund?',
    answer: 'Once we receive and inspect the returned product, refunds are processed within 5-7 business days. You will receive a confirmation email once the refund is initiated.',
  },
  // Account
  {
    id: '25',
    category: 'account',
    question: 'How do I create an account?',
    answer: 'Click on "Login" in the top navigation, then select "Create Account". Fill in your details, verify your email, and you\'re all set! Creating an account helps you track orders, save addresses, and access exclusive offers.',
  },
  {
    id: '26',
    category: 'account',
    question: 'I forgot my password. How do I reset it?',
    answer: 'Click on "Login" and then "Forgot Password". Enter your registered email address, and we will send you a password reset link. Follow the instructions in the email to create a new password.',
  },
  {
    id: '27',
    category: 'account',
    question: 'Can I have multiple addresses saved?',
    answer: 'Yes, you can save multiple delivery addresses in your account. Go to "My Account" > "Addresses" to add, edit, or delete addresses. You can set a default address for faster checkout.',
  },
  {
    id: '28',
    category: 'account',
    question: 'How do I update my profile information?',
    answer: 'You can update your profile information from the "My Account" > "Profile" section. Changes to your email or phone number may require verification.',
  },
];

const categories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'general', label: 'General', icon: FileQuestion },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: CreditCard },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'payment', label: 'Payment', icon: Shield },
  { id: 'returns', label: 'Returns', icon: RefreshCw },
  { id: 'account', label: 'Account', icon: User },
];

const FAQs = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <>
      <SEO 
        title="FAQs - Frequently Asked Questions | Jugraj Son's Hive"
        description="Find answers to frequently asked questions about our honey products, orders, shipping, payments, returns, and more at Jugraj Son's Hive."
      />
      <main className="pb-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-green-950/30 py-12 md:py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Find answers to common questions about our products, services, and policies
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-12">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all',
                      selectedCategory === category.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted border-border'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQs List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {categories.find(c => c.id === faq.category)?.label}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-base md:text-lg pr-4">
                            {faq.question}
                          </h3>
                        </div>
                        <ChevronDown
                          className={cn(
                            'w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform',
                            openFAQ === faq.id && 'transform rotate-180'
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {openFAQ === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-0 text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Still Have Questions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-8 text-center">
                <HelpCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-emerald-900 dark:text-emerald-100">
                  Still have questions?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Can't find the answer you're looking for? Our support team is here to help you.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Contact Us
                  </a>
                  <a
                    href="/support"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-background border-2 border-border rounded-lg hover:bg-muted transition-colors font-medium"
                  >
                    Get Support
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default FAQs;

