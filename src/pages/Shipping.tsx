import { motion } from 'framer-motion';
import { 
  Truck, Package, MapPin, Clock, Shield, CheckCircle2,
  AlertCircle, Info, Zap, Globe, CreditCard, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEO from '@/components/seo/SEO';

const Shipping = () => {
  const shippingMethods = [
    {
      name: 'Standard Shipping',
      icon: Truck,
      duration: '5-7 business days',
      price: 'Free on orders above ₹999',
      priceBelow: '₹50 for orders below ₹999',
      description: 'Regular delivery to your doorstep',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      name: 'Express Shipping',
      icon: Zap,
      duration: '2-3 business days',
      price: '₹150',
      priceBelow: null,
      description: 'Faster delivery for urgent orders',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
    {
      name: 'Same Day Delivery',
      icon: Package,
      duration: 'Same day (select cities)',
      price: '₹200',
      priceBelow: null,
      description: 'Available in major metro cities',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    },
  ];

  const shippingInfo = [
    {
      icon: MapPin,
      title: 'Delivery Locations',
      content: 'We currently deliver across all major cities and towns in India. Enter your pin code during checkout to check delivery availability.',
    },
    {
      icon: Clock,
      title: 'Processing Time',
      content: 'Orders are typically processed within 1-2 business days. During peak seasons or sales, processing may take up to 3 business days.',
    },
    {
      icon: Package,
      title: 'Order Tracking',
      content: 'Once your order is shipped, you will receive a tracking number via email and SMS. Track your order in real-time from your account.',
    },
    {
      icon: Shield,
      title: 'Secure Packaging',
      content: 'All products are carefully packed in secure, tamper-proof packaging to ensure they reach you in perfect condition.',
    },
  ];

  const deliverySteps = [
    {
      step: 1,
      title: 'Order Placed',
      description: 'You place your order and receive confirmation',
      icon: CheckCircle2,
    },
    {
      step: 2,
      title: 'Order Processing',
      description: 'We prepare and pack your order (1-2 days)',
      icon: Package,
    },
    {
      step: 3,
      title: 'Order Shipped',
      description: 'Your order is dispatched with tracking details',
      icon: Truck,
    },
    {
      step: 4,
      title: 'Out for Delivery',
      description: 'Your order is on the way to your address',
      icon: MapPin,
    },
    {
      step: 5,
      title: 'Delivered',
      description: 'Your order arrives safely at your doorstep',
      icon: CheckCircle2,
    },
  ];

  const importantNotes = [
    {
      type: 'info',
      icon: Info,
      title: 'Delivery Address',
      content: 'Please ensure your delivery address is complete and accurate. We are not responsible for delays due to incorrect addresses.',
    },
    {
      type: 'warning',
      icon: AlertCircle,
      title: 'Delivery Attempts',
      content: 'We make 2 delivery attempts. If unsuccessful, the order will be returned. Please ensure someone is available to receive the package.',
    },
    {
      type: 'success',
      icon: CheckCircle2,
      title: 'Cash on Delivery',
      content: 'COD is available for orders up to ₹5000. Payment is collected at the time of delivery.',
    },
    {
      type: 'info',
      icon: Globe,
      title: 'International Shipping',
      content: 'Currently, we ship within India only. We are working on expanding our international shipping services.',
    },
  ];

  const faqItems = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Same-day delivery is available in select cities.',
    },
    {
      question: 'What are the shipping charges?',
      answer: 'Shipping is free on orders above ₹999. For orders below ₹999, standard shipping charges are ₹50. Express shipping costs ₹150, and same-day delivery costs ₹200.',
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes! Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order in the "My Orders" section of your account.',
    },
    {
      question: 'What if my package is damaged?',
      answer: 'If your package arrives damaged, please contact our support team immediately with photos. We will arrange for a replacement or full refund.',
    },
    {
      question: 'Do you ship to all locations in India?',
      answer: 'We deliver to all major cities and towns across India. Enter your pin code during checkout to check delivery availability in your area.',
    },
    {
      question: 'Can I change my delivery address after placing an order?',
      answer: 'You can change your delivery address within 2 hours of placing the order, provided it hasn\'t been shipped yet. Contact our support team for assistance.',
    },
  ];

  return (
    <>
      <SEO 
        title="Shipping Information - Delivery & Shipping Policy | Atharva Health Solutions"
        description="Learn about our shipping methods, delivery times, charges, and tracking. Free shipping on orders above ₹999. Fast and secure delivery across India."
      />
      <main className="pb-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 py-12 md:py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Shipping Information
              </h1>
              <p className="text-lg text-muted-foreground">
                Fast, secure, and reliable delivery to your doorstep. Free shipping on orders above ₹999!
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-12">
          {/* Shipping Methods */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">Shipping Methods</h2>
              <p className="text-muted-foreground">Choose the delivery option that works best for you</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {shippingMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.div
                    key={method.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="h-full border-2 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-full ${method.bgColor} flex items-center justify-center mb-4`}>
                          <Icon className={`w-6 h-6 ${method.color}`} />
                        </div>
                        <CardTitle className="text-xl">{method.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{method.duration}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-lg text-primary">{method.price}</p>
                            {method.priceBelow && (
                              <p className="text-sm text-muted-foreground mt-1">{method.priceBelow}</p>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Delivery Process */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">Delivery Process</h2>
              <p className="text-muted-foreground">From order to delivery in 5 simple steps</p>
            </motion.div>

            <div className="grid md:grid-cols-5 gap-4">
              {deliverySteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="relative"
                  >
                    {index < deliverySteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border -z-10" style={{ width: 'calc(100% - 2rem)' }} />
                    )}
                    <Card className="text-center border-2">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <Badge variant="outline" className="mb-2">Step {step.step}</Badge>
                        <h3 className="font-semibold mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Shipping Information Grid */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-6">
              {shippingInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">{info.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{info.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Important Notes */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">Important Information</h2>
              <p className="text-muted-foreground">Things you should know about our shipping</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {importantNotes.map((note, index) => {
                const Icon = note.icon;
                const colorClasses = {
                  info: 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800',
                  warning: 'border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800',
                  success: 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800',
                };
                return (
                  <motion.div
                    key={note.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <Card className={`border-2 ${colorClasses[note.type as keyof typeof colorClasses]}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Icon className={`w-6 h-6 mt-1 ${
                            note.type === 'info' ? 'text-blue-600' :
                            note.type === 'warning' ? 'text-orange-600' :
                            'text-emerald-600'
                          }`} />
                          <div>
                            <h3 className="font-semibold mb-2">{note.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{note.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">Shipping FAQs</h2>
              <p className="text-muted-foreground">Common questions about shipping and delivery</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {faqItems.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2 flex items-start gap-2">
                        <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        {faq.question}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed ml-7">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800">
              <CardContent className="p-8 text-center">
                <Truck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-blue-900 dark:text-blue-100">
                  Need Help with Shipping?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Have questions about your order or delivery? Our support team is here to help you.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button asChild>
                    <a href="/contact">Contact Support</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/faqs">View FAQs</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Shipping;

