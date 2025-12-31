import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import SEO from '@/components/seo/SEO';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'reminder';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: typeof Bell;
}

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Order Confirmed',
      message: 'Your order #123456 has been confirmed and is being processed.',
      time: '2 hours ago',
      read: false,
      icon: CheckCircle,
    },
    {
      id: '2',
      type: 'promotion',
      title: 'Special Offer',
      message: 'Get 20% off on all Ayurvedic products. Use code AYUR20',
      time: '1 day ago',
      read: false,
      icon: Info,
    },
    {
      id: '3',
      type: 'order',
      title: 'Order Shipped',
      message: 'Your order #123456 has been shipped and will arrive soon.',
      time: '2 days ago',
      read: true,
      icon: CheckCircle,
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Reorder Reminder',
      message: 'Your favorite product is back in stock! Order now.',
      time: '3 days ago',
      read: true,
      icon: AlertCircle,
    },
  ]);

  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotions: true,
    reminders: true,
    systemAlerts: true,
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-700';
      case 'promotion':
        return 'bg-purple-100 text-purple-700';
      case 'reminder':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <SEO title="Notifications" />
      <main className="container-custom py-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Notifications List */}
          <div className="lg:col-span-2 space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    You're all caught up! We'll notify you when something important happens.
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <Card
                    key={notification.id}
                    className={notification.read ? 'opacity-60' : 'border-primary/20'}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h4 className="font-semibold">{notification.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.read && (
                              <Badge variant="default" className="ml-2">New</Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                            <div className="flex gap-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark as read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Notification Settings */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="orderUpdates" className="cursor-pointer">
                      Order Updates
                    </Label>
                    <Switch
                      id="orderUpdates"
                      checked={settings.orderUpdates}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, orderUpdates: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="promotions" className="cursor-pointer">
                      Promotions & Offers
                    </Label>
                    <Switch
                      id="promotions"
                      checked={settings.promotions}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, promotions: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reminders" className="cursor-pointer">
                      Reminders
                    </Label>
                    <Switch
                      id="reminders"
                      checked={settings.reminders}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, reminders: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="systemAlerts" className="cursor-pointer">
                      System Alerts
                    </Label>
                    <Switch
                      id="systemAlerts"
                      checked={settings.systemAlerts}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, systemAlerts: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};

export default Notifications;

