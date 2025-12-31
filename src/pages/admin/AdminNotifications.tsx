import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, XCircle, AlertCircle, Info, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface Notification {
  _id: string;
  type: 'order' | 'stock' | 'user' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

const AdminNotifications = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<string>('all');

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchNotifications();
  }, [user, isLoading, navigate, typeFilter, readFilter]);

  const fetchNotifications = async () => {
    try {
      const params: any = {};
      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }
      if (readFilter !== 'all') {
        params.read = readFilter === 'read';
      }
      
      const response = await api.get('/notifications', { params });
      setNotifications(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      toast({
        title: 'Success',
        description: 'Notification marked as read',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notifications',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
      toast({
        title: 'Success',
        description: 'Notification deleted',
      });
      fetchNotifications();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      case 'stock':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'user':
        return <Info className="h-5 w-5 text-purple-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesType = typeFilter === 'all' || n.type === typeFilter;
    const matchesRead = 
      readFilter === 'all' ||
      (readFilter === 'read' && n.read) ||
      (readFilter === 'unread' && !n.read);
    return matchesType && matchesRead;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading notifications...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-section-spacing">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="admin-heading-1">Notifications</h1>
            <p className="admin-description">Manage system notifications and alerts</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-blue-500 shadow-lg">
            <CardContent className="p-5">
              <div className="admin-stat-value">{notifications.length}</div>
              <div className="admin-stat-label mt-2">Total Notifications</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-500 shadow-lg bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="p-5">
              <div className="admin-stat-value text-blue-600">{unreadCount}</div>
              <div className="admin-stat-label mt-2">Unread</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-500 shadow-lg">
            <CardContent className="p-5">
              <div className="admin-stat-value">
                {notifications.filter(n => n.type === 'order').length}
              </div>
              <div className="admin-stat-label mt-2">Order Alerts</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-500 shadow-lg">
            <CardContent className="p-5">
              <div className="admin-stat-value">
                {notifications.filter(n => n.type === 'stock').length}
              </div>
              <div className="admin-stat-label mt-2">Stock Alerts</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-2 border-blue-500 shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="order">Orders</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Select value={readFilter} onValueChange={setReadFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No notifications found
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification._id}
                    className={notification.read ? 'opacity-60' : 'border-blue-200'}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">{getIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{notification.title}</h3>
                              <p className="admin-body-small">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-600">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm mb-2">{notification.message}</p>
                          {notification.link && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => navigate(notification.link!)}
                            >
                              View Details
                            </Button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification._id)}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(notification._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;

