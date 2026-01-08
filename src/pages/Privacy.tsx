import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/seo/SEO';

const Privacy = () => {
  return (
    <>
      <SEO 
        title="Privacy Policy - Atharva Health Solutions"
        description="Read our Privacy Policy to understand how we collect, use, and protect your personal information at Atharva Health Solutions."
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
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: October 6, 2025
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
                    Atharva Health Solutions operates this store and website, including all related information, 
                    content, features, tools, products and services, in order to provide you, the customer, 
                    with a curated shopping experience (the "Services"). This Privacy Policy describes how we 
                    collect, use, and disclose your personal information when you visit, use, or make a purchase 
                    or other transaction using the Services or otherwise communicate with us.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    <strong>Please read this Privacy Policy carefully.</strong> By using and accessing any of the 
                    Services, you acknowledge that you have read this Privacy Policy and understand the collection, 
                    use, and disclosure of your information as described in this Privacy Policy.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Personal Information We Collect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Eye className="w-6 h-6 text-primary" />
                    Personal Information We Collect or Process
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    When we use the term "personal information," we are referring to information that identifies 
                    or can reasonably be linked to you or another person. Personal information does not include 
                    information that is collected anonymously or that has been de-identified, so that it cannot 
                    identify or be reasonably linked to you. We may collect or process the following categories 
                    of personal information, including inferences drawn from this personal information, depending 
                    on how you interact with the Services, where you live, and as permitted or required by applicable law:
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Contact details</strong> including your name, address, billing address, shipping 
                        address, phone number, and email address.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Financial information</strong> including credit card, debit card, and financial 
                        account numbers, payment card information, financial account information, transaction 
                        details, form of payment, payment confirmation and other payment details.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Account information</strong> including your username, password, security questions, 
                        preferences and settings.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Transaction information</strong> including the items you view, put in your cart, 
                        add to your wishlist, or purchase, return, exchange or cancel and your past transactions.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Communications with us</strong> including the information you include in communications 
                        with us, for example, when sending a customer support inquiry.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Device information</strong> including information about your device, browser, or network 
                        connection, your IP address, and other unique identifiers.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Usage information</strong> including information regarding your interaction with the 
                        Services, including how and when you interact with or navigate the Services.
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Personal Information Sources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" />
                    Personal Information Sources
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    We may collect personal information from the following sources:
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Directly from you</strong> including when you create an account, visit or use the 
                        Services, communicate with us, or otherwise provide us with your personal information;
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Automatically through the Services</strong> including from your device when you use 
                        our products or services or visit our websites, and through the use of cookies and similar technologies;
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>From our service providers</strong> including when we engage them to enable certain 
                        technology and when they collect or process your personal information on our behalf;
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>From our partners or other third parties.</strong>
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* How We Use Your Personal Information */}
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
                    How We Use Your Personal Information
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Depending on how you interact with us or which of the Services you use, we may use personal 
                    information for the following purposes:
                  </p>
                  <ul className="space-y-4 text-muted-foreground">
                    <li>
                      <strong className="text-foreground">Provide, Tailor, and Improve the Services.</strong> We use 
                      your personal information to provide you with the Services, including to perform our contract 
                      with you, to process your payments, to fulfill your orders, to remember your preferences and 
                      items you are interested in, to send notifications to you related to your account, to process 
                      purchases, returns, exchanges or other transactions, to create, maintain and otherwise manage 
                      your account, to arrange for shipping, to facilitate any returns and exchanges, to enable you 
                      to post reviews, and to create a customized shopping experience for you, such as recommending 
                      products related to your purchases. This may include using your personal information to better 
                      tailor and improve the Services.
                    </li>
                    <li>
                      <strong className="text-foreground">Marketing and Advertising.</strong> We use your personal 
                      information for marketing and promotional purposes, such as to send marketing, advertising and 
                      promotional communications by email, text message or postal mail, and to show you online 
                      advertisements for products or services on the Services or other websites, including based on 
                      items you previously have purchased or added to your cart and other activity on the Services.
                    </li>
                    <li>
                      <strong className="text-foreground">Security and Fraud Prevention.</strong> We use your personal 
                      information to authenticate your account, to provide a secure payment and shopping experience, 
                      detect, investigate or take action regarding possible fraudulent, illegal, unsafe, or malicious 
                      activity, protect public safety, and to secure our services. If you choose to use the Services 
                      and register an account, you are responsible for keeping your account credentials safe. We highly 
                      recommend that you do not share your username, password or other access details with anyone else.
                    </li>
                    <li>
                      <strong className="text-foreground">Communicating with You.</strong> We use your personal 
                      information to provide you with customer support, to be responsive to you, to provide effective 
                      services to you and to maintain our business relationship with you.
                    </li>
                    <li>
                      <strong className="text-foreground">Legal Reasons.</strong> We use your personal information to 
                      comply with applicable law or respond to valid legal process, including requests from law 
                      enforcement or government agencies, to investigate or participate in civil discovery, potential or 
                      actual litigation, or other adversarial legal proceedings, and to enforce or investigate potential 
                      violations of our terms or policies.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* How We Disclose Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary" />
                    How We Disclose Personal Information
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    In certain circumstances, we may disclose your personal information to third parties for legitimate 
                    purposes subject to this Privacy Policy. Such circumstances may include:
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        With vendors and other third parties who perform services on our behalf (e.g. IT management, 
                        payment processing, data analytics, customer support, cloud storage, fulfillment and shipping).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        With business and marketing partners to provide marketing services and advertise to you. 
                        Our business and marketing partners will use your information in accordance with their own 
                        privacy notices.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        When you direct, request us or otherwise consent to our disclosure of certain information 
                        to third parties, such as to ship you products or through your use of social media widgets 
                        or login integrations.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        With our affiliates or otherwise within our corporate group.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        In connection with a business transaction such as a merger or bankruptcy, to comply with any 
                        applicable legal obligations (including to respond to subpoenas, search warrants and similar 
                        requests), to enforce any applicable terms of service or policies, and to protect or defend 
                        the Services, our rights, and the rights of our users or others.
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Third Party Websites and Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-primary" />
                    Third Party Websites and Links
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The Services may provide links to websites or other online platforms operated by third parties. 
                    If you follow links to sites not affiliated or controlled by us, you should review their privacy 
                    and security policies and other terms and conditions. We do not guarantee and are not responsible for 
                    the privacy or security of such sites, including the accuracy, completeness, or reliability of 
                    information found on these sites. Information you provide on public or semi-public venues, including 
                    information you share on third-party social networking platforms may also be viewable by other users 
                    of the Services and/or users of those third-party platforms without limitation as to its use by us or 
                    by a third party. Our inclusion of such links does not, by itself, imply any endorsement of the 
                    content on such platforms or of their owners or operators, except as disclosed on the Services.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Children's Data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary" />
                    Children's Data
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The Services are not intended to be used by children, and we do not knowingly collect any personal 
                    information about children under the age of majority in your jurisdiction. If you are the parent or 
                    guardian of a child who has provided us with their personal information, you may contact us using 
                    the contact details set out below to request that it be deleted. As of the Effective Date of this 
                    Privacy Policy, we do not have actual knowledge that we "share" or "sell" (as those terms are defined 
                    in applicable law) personal information of individuals under 16 years of age.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security and Retention */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Lock className="w-6 h-6 text-primary" />
                    Security and Retention of Your Information
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Please be aware that no security measures are perfect or impenetrable, and we cannot guarantee 
                    "perfect security." In addition, any information you send to us may not be secure while in transit. 
                    We recommend that you do not use unsecure channels to communicate sensitive or confidential information 
                    to us.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    How long we retain your personal information depends on different factors, such as whether we need 
                    the information to maintain your account, to provide you with Services, comply with legal obligations, 
                    resolve disputes or enforce other applicable contracts and policies.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Your Rights and Choices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    Your Rights and Choices
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Depending on where you live, you may have some or all of the rights listed below in relation to your 
                    personal information. However, these rights are not absolute, may apply only in certain circumstances 
                    and, in certain cases, we may decline your request as permitted by law.
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-foreground">Right to Access / Know.</strong> You may have a right to 
                        request access to personal information that we hold about you.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-foreground">Right to Delete.</strong> You may have a right to request 
                        that we delete personal information we maintain about you.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-foreground">Right to Correct.</strong> You may have a right to request 
                        that we correct inaccurate personal information we maintain about you.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-foreground">Right of Portability.</strong> You may have a right to 
                        receive a copy of the personal information we hold about you and to request that we transfer it 
                        to a third party, in certain circumstances and with certain exceptions.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-foreground">Managing Communication Preferences.</strong> We may send you 
                        promotional emails, and you may opt out of receiving these at any time by using the unsubscribe 
                        option displayed in our emails to you. If you opt out, we may still send you non-promotional 
                        emails, such as those about your account or orders that you have made.
                      </span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    You may exercise any of these rights by contacting us using the contact details provided below. We will 
                    not discriminate against you for exercising any of these rights. We may need to verify your identity 
                    before we can process your requests, as permitted or required under applicable law. In accordance with 
                    applicable laws, you may designate an authorized agent to make requests on your behalf to exercise your 
                    rights. Before accepting such a request from an agent, we will require that the agent provide proof you 
                    have authorized them to act on your behalf, and we may need you to verify your identity directly with us. 
                    We will respond to your request in a timely manner as required under applicable law.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Complaints */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Complaints</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have complaints about how we process your personal information, please contact us using the 
                    contact details provided below. Depending on where you live, you may have the right to appeal our 
                    decision by contacting us using the contact details set out below, or lodge your complaint with your 
                    local data protection authority.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* International Transfers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">International Transfers</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Please note that we may transfer, store and process your personal information outside the country you 
                    live in. If we transfer your personal information out of the European Economic Area or the United Kingdom, 
                    we will rely on recognized transfer mechanisms like the European Commission's Standard Contractual Clauses, 
                    or any equivalent contracts issued by the relevant competent authority of the UK, as relevant, unless the 
                    data transfer is to a country that has been determined to provide an adequate level of protection.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Changes to This Privacy Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mb-8"
            >
              <Card className="border-2">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this Privacy Policy from time to time, including to reflect changes to our practices or 
                    for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on this 
                    website, update the "Last updated" date and provide notice as required by applicable law.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="mb-8"
            >
              <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Contact</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Should you have any questions about our privacy practices or this Privacy Policy, or if you would like 
                    to exercise any of the rights available to you, please contact us:
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      <strong className="text-foreground">Email:</strong>{' '}
                      <a href="mailto:support@atharvahealthsolutions.com" className="text-primary hover:underline">
                        support@atharvahealthsolutions.com
                      </a>
                    </p>
                    <p>
                      <strong className="text-foreground">Phone:</strong>{' '}
                      <a href="tel:+919669361290" className="text-primary hover:underline">
                        09669361290
                      </a>
                    </p>
                    <p>
                      <strong className="text-foreground">Website:</strong>{' '}
                      <a href="http://atharvahealthsolutions.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        http://atharvahealthsolutions.com
                      </a>
                    </p>
                    <p>
                      <strong className="text-foreground">Address:</strong> Atharva Health Solution, Dunda Seoni, Seoni, Madhya Pradesh – 480661, India
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

export default Privacy;
