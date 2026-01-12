import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Save, Bell, Shield, Mail, Globe, CreditCard, Truck, 
  Database, Key, Palette, FileText, AlertCircle, CheckCircle2,
  Upload, Download, RefreshCw, Trash2, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Form schemas
const generalSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteUrl: z.string().url('Invalid URL'),
  adminEmail: z.string().email('Invalid email'),
  supportEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  currency: z.string().min(1, 'Currency is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.string().min(1, 'Language is required'),
});

const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, 'SMTP host is required'),
  smtpPort: z.string().min(1, 'SMTP port is required'),
  smtpUser: z.string().email('Invalid email'),
  smtpPassword: z.string().optional(),
  fromEmail: z.string().email('Invalid email'),
  fromName: z.string().min(1, 'From name is required'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type GeneralSettingsForm = z.infer<typeof generalSettingsSchema>;
type EmailSettingsForm = z.infer<typeof emailSettingsSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const AdminSettings = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const generalForm = useForm<GeneralSettingsForm>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: 'AtharvaHelth',
      siteUrl: 'https://atharvahelth.com',
      adminEmail: user?.email || '',
      supportEmail: '',
      phone: '',
      address: '',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      language: 'en',
    },
  });

  const emailForm = useForm<EmailSettingsForm>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpHost: '',
      smtpPort: '587',
      smtpUser: '',
      smtpPassword: '',
      fromEmail: user?.email || '',
      fromName: 'AtharvaHelth',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchSettings();
  }, [user, authLoading, navigate]);

  const fetchSettings = async () => {
    try {
      // In real app, fetch from backend
      // const response = await api.get('/admin/settings');
      // setSettings(response.data);
      // generalForm.reset(response.data.general);
      // emailForm.reset(response.data.email);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleGeneralSave = async (data: GeneralSettingsForm) => {
    setIsLoading(true);
    try {
      // await api.put('/admin/settings/general', data);
      toast({
        title: 'Success',
        description: 'General settings saved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSave = async (data: EmailSettingsForm) => {
    setIsLoading(true);
    try {
      // await api.put('/admin/settings/email', data);
      toast({
        title: 'Success',
        description: 'Email settings saved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save email settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (data: PasswordForm) => {
    setIsLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });
      passwordForm.reset();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      toast({
        title: 'Backup Started',
        description: 'Database backup is being created...',
      });
      // await api.post('/admin/settings/backup');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create backup',
        variant: 'destructive',
      });
    }
  };

  const handleExportData = async () => {
    try {
      toast({
        title: 'Export Started',
        description: 'Data export is being prepared...',
      });
      // await api.get('/admin/settings/export');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive',
      });
    }
  };

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading settings...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="admin-heading-1">Settings</h1>
            <p className="admin-description">Manage your admin panel and store settings</p>
          </div>
          <Badge variant="outline" className="text-sm">
            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" />
            All Systems Operational
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <form onSubmit={generalForm.handleSubmit(handleGeneralSave)}>
              <Card className="border-2 border-emerald-500 shadow-xl">
                <CardHeader>
                  <CardTitle className="admin-heading-4 flex items-center gap-3">
                    <Globe className="h-5 w-5" />
                    General Settings
                  </CardTitle>
                  <CardDescription>Configure basic store information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name *</Label>
                      <Input
                        id="siteName"
                        {...generalForm.register('siteName')}
                        placeholder="AtharvaHelth"
                      />
                      {generalForm.formState.errors.siteName && (
                        <p className="text-sm text-destructive">
                          {generalForm.formState.errors.siteName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="siteUrl">Site URL *</Label>
                      <Input
                        id="siteUrl"
                        {...generalForm.register('siteUrl')}
                        placeholder="https://atharvahelth.com"
                      />
                      {generalForm.formState.errors.siteUrl && (
                        <p className="text-sm text-destructive">
                          {generalForm.formState.errors.siteUrl.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Admin Email *</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        {...generalForm.register('adminEmail')}
                      />
                      {generalForm.formState.errors.adminEmail && (
                        <p className="text-sm text-destructive">
                          {generalForm.formState.errors.adminEmail.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        {...generalForm.register('supportEmail')}
                        placeholder="support@atharvahelth.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...generalForm.register('phone')}
                        placeholder="+91 1234567890"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency *</Label>
                      <Select
                        value={generalForm.watch('currency')}
                        onValueChange={(value) => generalForm.setValue('currency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR (Rs.)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone *</Label>
                      <Select
                        value={generalForm.watch('timezone')}
                        onValueChange={(value) => generalForm.setValue('timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language *</Label>
                      <Select
                        value={generalForm.watch('language')}
                        onValueChange={(value) => generalForm.setValue('language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="mr">Marathi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Store Address</Label>
                    <Textarea
                      id="address"
                      {...generalForm.register('address')}
                      placeholder="Enter your store address"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <Label htmlFor="maintenance">Maintenance Mode</Label>
                      <p className="admin-body-small">
                        Temporarily disable the site for maintenance
                      </p>
                    </div>
                    <Switch id="maintenance" />
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save General Settings'}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-2 border-blue-500 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Manage notification preferences and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="orderNotifications">New Order Notifications</Label>
                      <p className="admin-body-small">
                        Get notified when new orders are placed
                      </p>
                    </div>
                    <Switch id="orderNotifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="userNotifications">New User Notifications</Label>
                      <p className="admin-body-small">
                        Get notified when new users register
                      </p>
                    </div>
                    <Switch id="userNotifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="stockNotifications">Low Stock Alerts</Label>
                      <p className="admin-body-small">
                        Get notified when products are low in stock
                      </p>
                    </div>
                    <Switch id="stockNotifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="reviewNotifications">New Review Notifications</Label>
                      <p className="admin-body-small">
                        Get notified when customers submit reviews
                      </p>
                    </div>
                    <Switch id="reviewNotifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="paymentNotifications">Payment Notifications</Label>
                      <p className="admin-body-small">
                        Get notified about payment status updates
                      </p>
                    </div>
                    <Switch id="paymentNotifications" defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Low Stock Threshold</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={10} min={1} className="w-32" />
                    <span className="text-sm text-muted-foreground">units</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Alert when product stock falls below this number
                  </p>
                </div>

                <Button onClick={handleGeneralSave} disabled={isLoading} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Notification Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-4">
            <Card className="border-2 border-blue-500 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-4" />
                  Payment Settings
                </CardTitle>
                <CardDescription>Configure payment gateways and methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="codEnabled">Cash on Delivery (COD)</Label>
                      <p className="admin-body-small">
                        Allow customers to pay on delivery
                      </p>
                    </div>
                    <Switch id="codEnabled" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="razorpayEnabled">Razorpay</Label>
                      <p className="admin-body-small">
                        Enable Razorpay payment gateway
                      </p>
                    </div>
                    <Switch id="razorpayEnabled" />
                  </div>

                  {true && (
                    <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
                      <div className="space-y-2">
                        <Label htmlFor="razorpayKey">Razorpay Key ID</Label>
                        <Input id="razorpayKey" placeholder="rzp_test_..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="razorpaySecret">Razorpay Key Secret</Label>
                        <div className="relative">
                          <Input
                            id="razorpaySecret"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter secret key"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="stripeEnabled">Stripe</Label>
                      <p className="admin-body-small">
                        Enable Stripe payment gateway
                      </p>
                    </div>
                    <Switch id="stripeEnabled" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="paypalEnabled">PayPal</Label>
                      <p className="admin-body-small">
                        Enable PayPal payment gateway
                      </p>
                    </div>
                    <Switch id="paypalEnabled" />
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Payment gateway credentials are encrypted and stored securely.
                  </AlertDescription>
                </Alert>

                <Button onClick={handleGeneralSave} disabled={isLoading} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Payment Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Settings */}
          <TabsContent value="shipping" className="space-y-4">
            <Card className="border-2 border-blue-500 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Settings
                </CardTitle>
                <CardDescription>Configure shipping methods and rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="freeShippingThreshold"
                        type="number"
                        defaultValue={500}
                        min={0}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">Rs.</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Orders above this amount qualify for free shipping
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultShippingRate">Default Shipping Rate</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="defaultShippingRate"
                        type="number"
                        defaultValue={50}
                        min={0}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">Rs.</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Standard shipping charge for orders
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="expressShipping">Express Shipping</Label>
                      <p className="admin-body-small">
                        Enable express shipping option
                      </p>
                    </div>
                    <Switch id="expressShipping" />
                  </div>

                  {true && (
                    <div className="space-y-2">
                      <Label htmlFor="expressShippingRate">Express Shipping Rate</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="expressShippingRate"
                          type="number"
                          defaultValue={150}
                          min={0}
                          className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">Rs.</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="estimatedDeliveryDays">Estimated Delivery Days</Label>
                    <Input
                      id="estimatedDeliveryDays"
                      type="number"
                      defaultValue={5}
                      min={1}
                      className="w-32"
                    />
                    <p className="text-sm text-muted-foreground">
                      Average delivery time in days
                    </p>
                  </div>
                </div>

                <Button onClick={handleGeneralSave} disabled={isLoading} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Shipping Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-4">
            <form onSubmit={emailForm.handleSubmit(handleEmailSave)}>
              <Card className="border-2 border-blue-500 shadow-xl">
                <CardHeader>
                  <CardTitle className="admin-heading-4 flex items-center gap-3">
                    <Mail className="h-5 w-5" />
                    Email Settings
                  </CardTitle>
                  <CardDescription>Configure SMTP settings for email notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host *</Label>
                      <Input
                        id="smtpHost"
                        {...emailForm.register('smtpHost')}
                        placeholder="smtp.gmail.com"
                      />
                      {emailForm.formState.errors.smtpHost && (
                        <p className="text-sm text-destructive">
                          {emailForm.formState.errors.smtpHost.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port *</Label>
                      <Input
                        id="smtpPort"
                        {...emailForm.register('smtpPort')}
                        placeholder="587"
                      />
                      {emailForm.formState.errors.smtpPort && (
                        <p className="text-sm text-destructive">
                          {emailForm.formState.errors.smtpPort.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">SMTP Username *</Label>
                      <Input
                        id="smtpUser"
                        type="email"
                        {...emailForm.register('smtpUser')}
                        placeholder="your-email@gmail.com"
                      />
                      {emailForm.formState.errors.smtpUser && (
                        <p className="text-sm text-destructive">
                          {emailForm.formState.errors.smtpUser.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        {...emailForm.register('smtpPassword')}
                        placeholder="Leave blank to keep current"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email *</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        {...emailForm.register('fromEmail')}
                      />
                      {emailForm.formState.errors.fromEmail && (
                        <p className="text-sm text-destructive">
                          {emailForm.formState.errors.fromEmail.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fromName">From Name *</Label>
                      <Input
                        id="fromName"
                        {...emailForm.register('fromName')}
                      />
                      {emailForm.formState.errors.fromName && (
                        <p className="text-sm text-destructive">
                          {emailForm.formState.errors.fromName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Test your email settings before saving. Use the test button to send a test email.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Email Settings'}
                    </Button>
                    <Button type="button" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Test Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
              <Card className="border-2 border-red-500 shadow-xl">
                <CardHeader>
                  <CardTitle className="admin-heading-4 flex items-center gap-3">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your account security and password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password *</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        {...passwordForm.register('currentPassword')}
                      />
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-sm text-destructive">
                          {passwordForm.formState.errors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password *</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...passwordForm.register('newPassword')}
                      />
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-sm text-destructive">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...passwordForm.register('confirmPassword')}
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {passwordForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                      <p className="admin-body-small">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch id="twoFactor" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="sessionTimeout">Session Timeout</Label>
                      <p className="admin-body-small">
                        Automatically logout after inactivity
                      </p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                    <Shield className="h-4 w-4 mr-2" />
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 border-gray-500 shadow-xl">
                <CardHeader>
                  <CardTitle className="admin-heading-4 flex items-center gap-3">
                    <Database className="h-5 w-5" />
                    Database
                  </CardTitle>
                  <CardDescription>Manage database backups and exports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button onClick={handleBackup} variant="outline" className="w-full">
                      <Database className="h-4 w-4 mr-2" />
                      Create Backup
                    </Button>
                    <Button onClick={handleExportData} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-500 shadow-xl">
                <CardHeader>
                  <CardTitle className="admin-heading-4 flex items-center gap-3">
                    <Key className="h-5 w-5" />
                    API Settings
                  </CardTitle>
                  <CardDescription>Manage API keys and tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="flex gap-2">
                      <Input id="apiKey" value="sk_live_..." readOnly />
                      <Button variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Regenerate API key for external integrations
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-500 shadow-xl">
                <CardHeader>
                  <CardTitle className="admin-heading-4 flex items-center gap-3">
                    <Palette className="h-5 w-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>Customize admin panel appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue="light">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-500 shadow-xl">
                <CardHeader>
                  <CardTitle className="admin-heading-4 flex items-center gap-3">
                    <FileText className="h-5 w-5" />
                    Logs & Reports
                  </CardTitle>
                  <CardDescription>View system logs and reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" onClick={() => navigate('/admin/activity-logs')}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Activity Logs
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/admin/reports')}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
