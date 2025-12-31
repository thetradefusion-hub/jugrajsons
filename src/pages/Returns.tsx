import { motion } from 'framer-motion';
import { 
  RefreshCw, Package, CheckCircle2, XCircle, AlertCircle, Info,
  Clock, Truck, CreditCard, Shield, FileText, HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEO from '@/components/seo/SEO';

const Returns = () => {
  const returnPolicy = [
    {
      title: 'Return Window',
      icon: Clock,
      content: '7 days from the date of delivery',
      description: 'You have 7 days to initiate a return request after receiving your order.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: 'Condition',
      icon: Package,
      content: 'Unopened & Unused',
      description: 'Products must be in their original packaging and unopened to be eligible for return.',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      title: 'Refund Time',
      icon: CreditCard,
      content: '5-7 business days',
      description: 'Refunds are processed within 5-7 business days after we receive and inspect the returned product.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      title: 'Free Returns',
      icon: Truck,
      content: 'Pickup Available',
      description: 'We arrange free pickup for returns in most locations. No need to visit any courier office.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
  ];

  const returnSteps = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Go to "My Orders" and select the item you want to return',
      icon: FileText,
    },
    {
      step: 2,
      title: 'Select Reason',
      description: 'Choose the reason for return and provide additional details if needed',
      icon: HelpCircle,
    },
    {
      step: 3,
      title: 'Schedule Pickup',
      description: 'We will arrange pickup from your address (or provide return instructions)',
      icon: Truck,
    },
    {
      step: 4,
      title: 'Quality Check',
      description: 'We inspect the returned product to ensure it meets return conditions',
      icon: Shield,
    },
    {
      step: 5,
      title: 'Refund Processed',
      description: 'Refund is credited to your original payment method within 5-7 days',
      icon: CheckCircle2,
    },
  ];

  const eligibleItems = [
    {
      icon: CheckCircle2,
      title: 'Unopened Products',
      description: 'Products in original, unopened packaging with all seals intact',
    },
    {
      icon: CheckCircle2,
      title: 'Damaged Products',
      description: 'Products received damaged or defective (report within 48 hours)',
    },
    {
      icon: CheckCircle2,
      title: 'Wrong Products',
      description: 'Products that don\'t match your order (report within 24 hours)',
    },
    {
      icon: CheckCircle2,
      title: 'Missing Items',
      description: 'Items missing from your order (report within 24 hours)',
    },
  ];

  const nonEligibleItems = [
    {
      icon: XCircle,
      title: 'Opened/Used Products',
      description: 'Products that have been opened, used, or tampered with',
    },
    {
      icon: XCircle,
      title: 'Perishable Items',
      description: 'Items with short shelf life or expiry dates',
    },
    {
      icon: XCircle,
      title: 'Personalized Products',
      description: 'Products customized or personalized as per your specifications',
    },
    {
      icon: XCircle,
      title: 'Intimate/Sanitary Products',
      description: 'Items for hygiene and safety reasons cannot be returned',
    },
    {
      icon: XCircle,
      title: 'Accessories/Gifts',
      description: 'Free gifts, samples, or promotional items received with orders',
    },
    {
      icon: XCircle,
      title: 'Past Return Window',
      description: 'Returns requested after the 7-day return window',
    },
  ];

  const returnReasons = [
    {
      reason: 'Defective/Damaged Product',
      description: 'Product received in damaged condition or doesn\'t work as expected',
      processing: 'Immediate replacement or full refund',
    },
    {
      reason: 'Wrong Product Delivered',
      description: 'Received a different product than what was ordered',
      processing: 'Full refund or replacement with correct product',
    },
    {
      reason: 'Product Not as Described',
      description: 'Product doesn\'t match the description on the website',
      processing: 'Full refund after verification',
    },
    {
      reason: 'Changed My Mind',
      description: 'No longer need the product or found a better alternative',
      processing: 'Refund after quality check (shipping charges may apply)',
    },
    {
      reason: 'Quantity Mismatch',
      description: 'Received incorrect quantity of items',
      processing: 'Replacement or refund for missing items',
    },
  ];

  const importantNotes = [
    {
      type: 'warning',
      icon: AlertCircle,
      title: 'Return Packaging',
      content: 'Products must be returned in their original packaging with all tags, labels, and accessories intact. Items returned without original packaging may be rejected.',
    },
    {
      type: 'info',
      icon: Info,
      title: 'Return Shipping Charges',
      content: 'Return shipping is free for defective, damaged, or wrong products. For "Changed My Mind" returns, return shipping charges may be deducted from the refund amount.',
    },
    {
      type: 'info',
      icon: Clock,
      title: 'Refund Method',
      content: 'Refunds are processed to the original payment method. For Cash on Delivery orders, refunds are processed via bank transfer or wallet (subject to verification).',
    },
    {
      type: 'warning',
      icon: Shield,
      title: 'Quality Inspection',
      content: 'All returned products undergo quality inspection. Returns that don\'t meet our return policy may be rejected and sent back to you.',
    },
  ];

  const faqItems = [
    {
      question: 'How do I return a product?',
      answer: 'Go to "My Orders" in your account, select the order you want to return, choose the item(s), select a reason, and submit your return request. We will arrange pickup or provide return instructions.',
    },
    {
      question: 'What is the return policy?',
      answer: 'You can return unopened, unused products within 7 days of delivery. Products must be in original packaging with all tags and accessories intact.',
    },
    {
      question: 'How long does it take to process a refund?',
      answer: 'After we receive and inspect the returned product, refunds are processed within 5-7 business days. You will receive a confirmation email once the refund is initiated.',
    },
    {
      question: 'Will I get a full refund?',
      answer: 'Yes, for eligible returns, you will receive a full refund. However, for "Changed My Mind" returns, return shipping charges may be deducted from the refund amount.',
    },
    {
      question: 'Can I return opened products?',
      answer: 'No, products must be unopened and unused to be eligible for return. However, defective or damaged products can be returned even if opened (report within 48 hours).',
    },
    {
      question: 'What if my return is rejected?',
      answer: 'If your return doesn\'t meet our policy requirements, the product will be sent back to you. You will receive an email explaining the reason for rejection.',
    },
    {
      question: 'Do you offer exchanges?',
      answer: 'Currently, we process returns and refunds. If you want a different product, you can return the current one and place a new order for the desired product.',
    },
    {
      question: 'Can I return products bought on sale?',
      answer: 'Yes, sale products can be returned following the same return policy. However, promotional items or free gifts cannot be returned.',
    },
  ];

  return (
    <>
      <SEO 
        title="Returns & Refund Policy - Easy Returns | Atharva Health Solutions"
        description="Learn about our easy return policy. 7-day return window, free returns, and quick refunds. Return unopened products for full refund within 5-7 business days."
      />
      <main className="pb-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30 py-12 md:py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <RefreshCw className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Returns & Refund Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                Easy returns within 7 days. Free pickup and quick refunds processed within 5-7 business days.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-12">
          {/* Return Policy Highlights */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">Return Policy at a Glance</h2>
              <p className="text-muted-foreground">Simple and hassle-free return process</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {returnPolicy.map((policy, index) => {
                const Icon = policy.icon;
                return (
                  <motion.div
                    key={policy.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="h-full border-2 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-full ${policy.bgColor} flex items-center justify-center mb-4`}>
                          <Icon className={`w-6 h-6 ${policy.color}`} />
                        </div>
                        <CardTitle className="text-lg">{policy.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="font-semibold text-primary text-lg">{policy.content}</p>
                          <p className="text-sm text-muted-foreground">{policy.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Return Process Steps */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">How to Return a Product</h2>
              <p className="text-muted-foreground">Follow these simple steps to return your order</p>
            </motion.div>

            <div className="grid md:grid-cols-5 gap-4">
              {returnSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="relative"
                  >
                    {index < returnSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border -z-10" style={{ width: 'calc(100% - 2rem)' }} />
                    )}
                    <Card className="text-center border-2 h-full">
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

          {/* Eligible vs Non-Eligible Items */}
          <section className="mb-16">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Eligible Items */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="h-full border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-5 h-5" />
                      Eligible for Return
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {eligibleItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.title} className="flex items-start gap-3">
                            <Icon className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold mb-1">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Non-Eligible Items */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="h-full border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                      <XCircle className="w-5 h-5" />
                      Not Eligible for Return
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {nonEligibleItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.title} className="flex items-start gap-3">
                            <Icon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold mb-1">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Return Reasons */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">Common Return Reasons</h2>
              <p className="text-muted-foreground">Select the reason that best describes your return</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {returnReasons.map((reason, index) => (
                <motion.div
                  key={reason.reason}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2 flex items-start gap-2">
                        <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        {reason.reason}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 ml-7">{reason.description}</p>
                      <Badge variant="secondary" className="ml-7">
                        {reason.processing}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Important Notes */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">Important Information</h2>
              <p className="text-muted-foreground">Things you should know before returning</p>
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
                    transition={{ delay: 1.3 + index * 0.1 }}
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
              transition={{ delay: 1.4 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">Returns & Refunds FAQs</h2>
              <p className="text-muted-foreground">Common questions about returns and refunds</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {faqItems.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2 flex items-start gap-2">
                        <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
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
            transition={{ delay: 1.6 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-800">
              <CardContent className="p-8 text-center">
                <RefreshCw className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-purple-900 dark:text-purple-100">
                  Need Help with Returns?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Have questions about returning a product or processing a refund? Our support team is here to help you.
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

export default Returns;

