import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, Filter, Download, User, Package, ShoppingCart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface ActivityLog {
  _id: string;
  adminId: string;
  adminName: string;
  action: string;
  entity: 'product' | 'order' | 'user' | 'coupon' | 'settings' | 'other';
  entityId: string;
  entityName: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

const AdminActivityLogs = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchLogs();
  }, [user, isLoading, navigate, entityFilter, actionFilter]);

  const fetchLogs = async () => {
    try {
      const params: any = {};
      if (entityFilter !== 'all') {
        params.entity = entityFilter;
      }
      if (actionFilter !== 'all') {
        params.action = actionFilter;
      }
      
      const response = await api.get('/admin/activity-logs', { params });
      // Backend populates adminId, so handle both populated and non-populated cases
      const logsData = response.data.map((log: any) => ({
        _id: log._id,
        adminId: log.adminId?._id || log.adminId || '',
        adminName: log.adminId?.name || 'Unknown Admin',
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        entityName: log.entityName,
        details: log.details,
        ipAddress: log.ipAddress,
        createdAt: log.createdAt,
      }));
      setLogs(logsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch activity logs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'product':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'order':
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case 'user':
        return <User className="h-4 w-4 text-purple-500" />;
      case 'coupon':
        return <Package className="h-4 w-4 text-amber-500" />;
      case 'settings':
        return <Settings className="h-4 w-4 text-gray-500" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
      case 'updated':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'deleted':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntity = entityFilter === 'all' || log.entity === entityFilter;
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesEntity && matchesAction;
  });

  const handleExport = () => {
    const csv = [
      ['Date', 'Admin', 'Action', 'Entity', 'Entity Name', 'Details', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.createdAt).toLocaleString(),
        log.adminName,
        log.action,
        log.entity,
        log.entityName,
        log.details,
        log.ipAddress
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading activity logs...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-section-spacing">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="admin-heading-1">Activity Logs</h1>
            <p className="admin-description">Track all admin actions and system activities</p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-gray-500 shadow-lg">
            <CardContent className="p-5">
              <div className="admin-stat-value">{logs.length}</div>
              <div className="admin-stat-label mt-2">Total Logs</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-emerald-500 shadow-lg">
            <CardContent className="p-5">
              <div className="admin-stat-value">
                {logs.filter(l => l.action === 'created').length}
              </div>
              <div className="admin-stat-label mt-2">Created</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-500 shadow-lg">
            <CardContent className="p-5">
              <div className="admin-stat-value">
                {logs.filter(l => l.action === 'updated').length}
              </div>
              <div className="admin-stat-label mt-2">Updated</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-500 shadow-lg">
            <CardContent className="p-5">
              <div className="admin-stat-value">
                {logs.filter(l => l.action === 'deleted').length}
              </div>
              <div className="admin-stat-label mt-2">Deleted</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-2 border-gray-500 shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by admin, entity, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="product">Products</SelectItem>
                  <SelectItem value="order">Orders</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="coupon">Coupons</SelectItem>
                  <SelectItem value="settings">Settings</SelectItem>
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Entity Name</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No activity logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log._id}>
                        <TableCell className="text-sm">
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {log.adminName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getEntityIcon(log.entity)}
                            <span className="capitalize">{log.entity}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{log.entityName}</TableCell>
                        <TableCell className="admin-body-small">
                          {log.details}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminActivityLogs;

