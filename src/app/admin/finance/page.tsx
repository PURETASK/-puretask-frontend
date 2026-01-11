'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAllTransactions, useProcessRefund, useFinancialReport } from '@/hooks/useAdmin';
import { LineChart, BarChart } from '@/components/ui/Charts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Search,
} from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

export default function AdminFinancePage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminFinanceContent />
    </ProtectedRoute>
  );
}

function AdminFinanceContent() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const { data: transactionsData, isLoading } = useAllTransactions({
    search,
    status: statusFilter,
    page,
    per_page: 20,
  });

  const { data: reportData } = useFinancialReport(startDate, endDate);
  const { mutate: processRefund, isPending: processing } = useProcessRefund();

  const transactions = transactionsData?.transactions || [];
  const total = transactionsData?.total || 0;

  // Calculate stats
  const totalRevenue = transactions
    .filter((t: any) => t.status === 'completed')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter((t: any) => t.status === 'pending')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const refundedAmount = transactions
    .filter((t: any) => t.status === 'refunded')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const handleRefund = (transactionId: string) => {
    const amount = prompt('Enter refund amount:');
    const reason = prompt('Enter refund reason:');

    if (amount && reason) {
      processRefund({ transactionId, amount: parseFloat(amount), reason });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'destructive' | 'default' | 'primary'> = {
      completed: 'success',
      pending: 'warning',
      failed: 'destructive',
      refunded: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  // Chart data (mock - would come from report data)
  const revenueChart = [
    { label: 'Jan', value: 12500 },
    { label: 'Feb', value: 15300 },
    { label: 'Mar', value: 18200 },
    { label: 'Apr', value: 16800 },
    { label: 'May', value: 21500 },
    { label: 'Jun', value: 24300 },
  ];

  const serviceRevenueChart = [
    { label: 'Standard', value: 45000 },
    { label: 'Deep', value: 32000 },
    { label: 'Move In/Out', value: 28000 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
              <p className="text-gray-600 mt-1">
                Track revenue, transactions, and generate reports
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => (window.location.href = '/admin/dashboard')}>
                ← Back to Dashboard
              </Button>
              <Button variant="primary">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Pending</p>
                  <RefreshCw className="h-5 w-5 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(pendingAmount)}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {transactions.filter((t: any) => t.status === 'pending').length} transactions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Refunded</p>
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(refundedAmount)}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {transactions.filter((t: any) => t.status === 'refunded').length} refunds
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Transactions</p>
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
                <p className="text-xs text-gray-600 mt-1">Total processed</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <LineChart data={revenueChart} title="Monthly Revenue" height={250} />
            <BarChart data={serviceRevenueChart} title="Revenue by Service" height={250} />
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
                      placeholder="Search transactions..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-12 flex items-center justify-center">
                  <Loading />
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No transactions found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                          Transaction ID
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                          Booking
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                          Amount
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                          Method
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                          Date
                        </th>
                        <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {transactions.map((transaction: any) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="py-4 px-6 font-mono text-sm">
                            {transaction.id.slice(0, 8)}
                          </td>
                          <td className="py-4 px-6 text-sm">
                            <span className="font-medium">
                              #{transaction.booking_id.slice(0, 8)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm capitalize">
                            {transaction.payment_method || 'card'}
                          </td>
                          <td className="py-4 px-6">{getStatusBadge(transaction.status)}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {format(new Date(transaction.created_at), 'MMM d, yyyy')}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedTransaction(transaction)}
                              >
                                View
                              </Button>
                              {transaction.status === 'completed' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRefund(transaction.id)}
                                >
                                  Refund
                                </Button>
                              )}
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

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTransaction(null)}
        >
          <Card
            className="max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transaction Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                  <p className="font-mono text-sm font-medium">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                  <p className="font-mono text-sm font-medium">
                    {selectedTransaction.booking_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="font-medium capitalize">
                    {selectedTransaction.payment_method || 'card'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedTransaction.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {selectedTransaction.status === 'completed' && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleRefund(selectedTransaction.id);
                      setSelectedTransaction(null);
                    }}
                  >
                    Process Refund
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
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
