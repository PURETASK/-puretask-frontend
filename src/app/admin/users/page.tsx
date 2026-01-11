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
import { Search, Filter, MoreVertical, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';

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

  const users = usersData?.users || [];
  const total = usersData?.total || 0;

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">
                Manage all users, roles, and permissions
              </p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/admin/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter((u: any) => u.status === 'active').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Cleaners</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter((u: any) => u.role === 'cleaner').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Clients</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter((u: any) => u.role === 'client').length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by name or email..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Roles</option>
                  <option value="client">Client</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-12 flex items-center justify-center">
                  <Loading />
                </div>
              ) : users.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p>No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                          User
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                          Role
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                          Joined
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                          Last Login
                        </th>
                        <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {users.map((user: any) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={user.profile_picture_url}
                                fallback={user.full_name?.[0] || user.email[0]}
                                size="sm"
                              />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {user.full_name || 'No name'}
                                </p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge
                              variant={
                                user.role === 'admin'
                                  ? 'destructive'
                                  : user.role === 'cleaner'
                                  ? 'primary'
                                  : 'default'
                              }
                            >
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <Badge
                              variant={
                                user.status === 'active'
                                  ? 'success'
                                  : user.status === 'suspended'
                                  ? 'warning'
                                  : 'destructive'
                              }
                            >
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {format(new Date(user.created_at), 'MMM d, yyyy')}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {user.last_login_at
                              ? format(new Date(user.last_login_at), 'MMM d, yyyy')
                              : 'Never'}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                View
                              </Button>
                              <div className="relative group">
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                                <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        user.id,
                                        user.status === 'active' ? 'suspended' : 'active'
                                      )
                                    }
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                  >
                                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleRoleChange(
                                        user.id,
                                        user.role === 'client' ? 'cleaner' : 'client'
                                      )
                                    }
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                  >
                                    Change Role
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    Delete User
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {total > 20 && (
                <div className="border-t p-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page * 20 >= total}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar
                  src={selectedUser.profile_picture_url}
                  fallback={selectedUser.full_name?.[0] || selectedUser.email[0]}
                  size="lg"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedUser.full_name || 'No name'}
                  </h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="primary">{selectedUser.role}</Badge>
                    <Badge
                      variant={
                        selectedUser.status === 'active'
                          ? 'success'
                          : selectedUser.status === 'suspended'
                          ? 'warning'
                          : 'destructive'
                      }
                    >
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{selectedUser.email}</p>
                </div>
                {selectedUser.phone_number && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-medium text-gray-900">{selectedUser.phone_number}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Joined</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(selectedUser.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Login</p>
                  <p className="font-medium text-gray-900">
                    {selectedUser.last_login_at
                      ? format(new Date(selectedUser.last_login_at), 'MMM d, yyyy')
                      : 'Never'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={() =>
                    (window.location.href = `/admin/users/${selectedUser.id}/bookings`)
                  }
                >
                  View Bookings
                </Button>
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
