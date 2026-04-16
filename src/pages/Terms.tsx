import { motion } from 'framer-motion';
import { FileText, Shield, User, Lock, CreditCard, RefreshCw, AlertCircle, CheckCircle2, Scale } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/seo/SEO';

const Terms = () => {
  return (
    <>
      <SEO 
        title="Terms and Conditions - Jugraj Son's Hive"
        description="Read our Terms and Conditions to understand the rules and regulations for using Jugraj Son's Hive website and services."
      />
      <main className="pb-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-red-950/30 py-12 md:py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Terms and Conditions
              </h1>
              <p className="text-lg text-muted-foreground">
                Please read these terms carefully before using our website
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert max-w-none">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Welcome to jugrajsonshive.com (the Website), operated by Jugraj Son's Hive 
                    (Company, we, our, us). By accessing or using this Website in any manner, you agree to comply 
                    with and be bound by these Terms and Conditions (Agreement). If you do not agree to these terms, 
                    please do not use the Website.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Use of Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary" />
                    1. Use of Personal Information
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We respect your privacy and handle personal information as outlined in our{' '}
                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>. By using this 
                    Website, you consent to the collection, use, and disclosure of your data as described.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Eligibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <User className="w-6 h-6 text-primary" />
                    2. Eligibility
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Persons below 18 years of age may only use the Website under parental or guardian supervision. 
                    Use of the Website by incompetent persons under applicable laws is prohibited.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Website Access and Restrictions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Lock className="w-6 h-6 text-primary" />
                    3. Website Access and Restrictions
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You are granted a limited license to use the Website for personal, non-commercial purposes. You 
                    shall not copy, reproduce, modify, sell, or exploit the Website content without our express written 
                    permission. Unauthorized use terminates your rights hereunder.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Account Registration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <User className="w-6 h-6 text-primary" />
                    4. Account Registration
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    For placing orders, you must register and provide accurate and current information. You agree to 
                    receive promotional communications, which you may opt out of anytime.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pricing and Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-primary" />
                    5. Pricing and Orders
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    All products are sold at the stated MRP unless otherwise specified. Prices are final at the time 
                    of delivery.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cancellations and Refunds */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <RefreshCw className="w-6 h-6 text-primary" />
                    6. Cancellations and Refunds
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Orders may be cancelled by you before dispatch by contacting customer service. Post-dispatch 
                    cancellations are not accepted. Refunds for cancelled orders will be processed as applicable 
                    under Returns/Refunds or Cancellation Policy mentioned on the website. Fraudulent transactions 
                    may be cancelled at our discretion.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Returns and Exchanges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <RefreshCw className="w-6 h-6 text-primary" />
                    7. Returns and Exchanges
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Due to the nature of food products, we do not accept returns or exchanges, except for damaged 
                    goods. Contact customer support with order details for damaged items. For more details, please refer 
                    to our{' '}
                    <a href="/returns" className="text-primary hover:underline">Returns Policy</a>.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* User Obligations and Conduct */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-primary" />
                    8. User Obligations and Conduct
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You agree to provide true information, use the Website lawfully, and refrain from any activity that 
                    disrupts or harms the Website or its users.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Intellectual Property */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" />
                    9. Intellectual Property
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    All content, trademarks, and logos on the Website are owned by us or our licensors and protected by law.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Changes to Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-primary" />
                    10. Changes to Terms
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to modify these Terms at any time without prior notice. Continued use of the 
                    Website implies acceptance of updated Terms.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Governing Law and Jurisdiction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Scale className="w-6 h-6 text-primary" />
                    11. Governing Law and Jurisdiction
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    This Agreement is governed by Indian laws. Any disputes shall be subject to the exclusive jurisdiction 
                    of courts in India and resolved by binding arbitration under the Arbitration and Conciliation Act, 1996.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Limitation of Liability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary" />
                    12. Limitation of Liability
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We are not liable for any losses or damages arising from transactions, including authorization declines 
                    related to payment methods.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="mb-8"
            >
              <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Contact</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you have any questions about these Terms and Conditions, please contact us:
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      <strong className="text-foreground">Email:</strong>{' '}
                      <a href="mailto:connect@jugrajsonshive.com" className="text-primary hover:underline">
                        connect@jugrajsonshive.com
                      </a>
                    </p>
                    <p>
                      <strong className="text-foreground">Phone:</strong>{' '}
                      <a href="tel:+919826124108" className="text-primary hover:underline">
                        9826124108
                      </a>
                    </p>
                    <p>
                      <strong className="text-foreground">Website:</strong>{' '}
                      <a href="https://jugrajsonshive.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        https://jugrajsonshive.com
                      </a>
                    </p>
                    <p>
                      <strong className="text-foreground">Address:</strong> Jugraj Son's Hive, India
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Terms;

