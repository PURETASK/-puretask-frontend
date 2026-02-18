'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  useAllUsers,
  useUpdateUserStatus,
  useUpdateUserRole,
  useDeleteUser,
} from '@/hooks/useAdmin';
import { adminEnhancedService } from '@/services/adminEnhanced.service';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, MoreVertical, Mail, Phone, Calendar, Shield, AlertTriangle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { MobileTable } from '@/components/mobile/MobileTable';
import { useMobile } from '@/hooks/useMobile';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminUsersContent />
    </ProtectedRoute>
  );
}

function AdminUsersContent() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { mobile } = useMobile();

  const { data: usersData, isLoading } = useAllUsers({
    search,
    role: roleFilter,
    status: statusFilter,
    page,
    per_page: 20,
  });

  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateUserStatus();
  const { mutate: updateRole, isPending: updatingRole } = useUpdateUserRole();
  const { mutate: deleteUser, isPending: deleting } = useDeleteUser();

  // Get risk scoring data
  type RiskScoringData = { users?: Array<{ id: string; riskScore?: number }>; summary?: { highRisk?: number; mediumRisk?: number; lowRisk?: number; avgScore?: number } };
  const { data: riskData } = useQuery({
    queryKey: ['admin', 'risk', 'scoring'],
    queryFn: () => adminEnhancedService.getRiskScoring() as Promise<RiskScoringData>,
  });

  const users = usersData?.data?.users || [];
  const total = usersData?.data?.total || 0;

  // Get risk profile for selected user
  const { data: riskProfile } = useQuery({
    queryKey: ['admin', 'users', selectedUser?.id, 'risk-profile'],
    queryFn: () => adminEnhancedService.getRiskProfile(selectedUser?.id),
    enabled: !!selectedUser?.id,
  });

  const handleStatusChange = (userId: string, status: any) => {
    if (confirm(`Are you sure you want to change this user's status to ${status}?`)) {
      updateStatus({ userId, status });
    }
  };

  const handleRoleChange = (userId: string, role: any) => {
    if (confirm(`Are you sure you want to change this user's role to ${role}?`)) {
      updateRole({ userId, role });
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this user? This action cannot be undone.'
      )
    ) {
      deleteUser(userId);
    }
  };

  const getRiskBadge = (riskScore: number) => {
    if (riskScore >= 70) {
      return <Badge variant="error">High Risk</Badge>;
    } else if (riskScore >= 40) {
      return <Badge variant="warning">Medium Risk</Badge>;
    }
    return <Badge variant="success">Low Risk</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
      active: 'success',
      inactive: 'warning',
      suspended: 'error',
      pending: 'warning',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  // Table columns for MobileTable
  const columns = [
    {
      key: 'avatar',
      header: 'User',
      render: (user: any) => (
        <div className="flex items-center gap-3">
          <Avatar src={user.avatar_url} alt={user.full_name || user.email} fallback={(user.full_name || user.email)?.[0]?.toUpperCase() || 'U'} size="sm" />
          <div>
            <p className="font-medium text-gray-900">{user.full_name || 'N/A'}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: any) => (
        <Badge variant={user.role === 'admin' ? 'info' : 'default'}>
          {user.role || 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: any) => getStatusBadge(user.status || 'active'),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (user: any) => (
        <div className="flex items-center gap-1">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{user.phone || 'N/A'}</span>
        </div>
      ),
      mobileHidden: true,
    },
    {
      key: 'created',
      header: 'Created',
      render: (user: any) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : 'N/A'}
          </span>
        </div>
      ),
      mobileHidden: true,
    },
    {
      key: 'risk',
      header: 'Risk',
      render: (user: any) => {
        const riskScore = riskData?.users?.find((u: any) => u.id === user.id)?.riskScore || 0;
        return getRiskBadge(riskScore);
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedUser(user)}
            className="min-h-[44px] min-w-[44px]"
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">
                Manage all users, roles, and permissions
              </p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/admin/dashboard')} className="min-h-[44px]">
              ← Back to Dashboard
            </Button>
          </div>

          {/* Risk Summary */}
          {riskData && (
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-900">Risk Summary</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-amber-700">High Risk</p>
                    <p className="text-2xl font-bold text-amber-900">
                      {riskData.summary?.highRisk || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-amber-700">Medium Risk</p>
                    <p className="text-2xl font-bold text-amber-900">
                      {riskData.summary?.mediumRisk || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-amber-700">Low Risk</p>
                    <p className="text-2xl font-bold text-amber-900">
                      {riskData.summary?.lowRisk || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-amber-700">Avg Score</p>
                    <p className="text-2xl font-bold text-amber-900">
                      {riskData.summary?.avgScore?.toFixed(1) || '0.0'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    fieldType="search"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="min-h-[44px]"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Roles</option>
                    <option value="client">Client</option>
                    <option value="cleaner">Cleaner</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="w-full sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          {isLoading ? (
            <Loading />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Users ({total})</CardTitle>
              </CardHeader>
              <CardContent>
                <MobileTable
                  data={users}
                  columns={columns}
                  keyExtractor={(user) => user.id}
                  emptyMessage="No users found"
                />
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {total > 20 && (
            <div className="mt-6 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="min-h-[44px]"
              >
                Previous
              </Button>
              <span className="flex items-center px-4 min-h-[44px]">
                Page {page} of {Math.ceil(total / 20)}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 20)}
                className="min-h-[44px]"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
