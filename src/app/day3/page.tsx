'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Tabs } from '@/components/ui/Tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { Progress } from '@/components/ui/Progress';
import { Toggle } from '@/components/ui/Toggle';
import { Tooltip } from '@/components/ui/Tooltip';
import { Badge } from '@/components/ui/Badge';

function ComponentsShowcase() {
  const [selectedCity, setSelectedCity] = useState('');
  const [progress, setProgress] = useState(45);
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(true);
  const { addToast } = useToast();

  const cityOptions = [
    { label: 'New York', value: 'ny' },
    { label: 'Los Angeles', value: 'la' },
    { label: 'Chicago', value: 'chi' },
    { label: 'Houston', value: 'hou' },
    { label: 'Phoenix', value: 'phx' },
  ];

  const tabs = [
    {
      label: 'Overview',
      value: 'overview',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">This is the overview tab. It contains general information.</p>
          <Button>Learn More</Button>
        </div>
      ),
    },
    {
      label: 'Settings',
      value: 'settings',
      badge: 3,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Settings tab with configuration options.</p>
          <Toggle label="Enable notifications" checked={toggle1} onChange={setToggle1} />
          <Toggle label="Auto-save" checked={toggle2} onChange={setToggle2} />
        </div>
      ),
    },
    {
      label: 'Activity',
      value: 'activity',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Recent activity and history.</p>
          <Badge variant="success">All systems operational</Badge>
        </div>
      ),
    },
  ];

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Day 3 Components</h1>
          <Breadcrumbs items={[{ label: 'Components' }, { label: 'Day 3' }]} className="mt-2" />
        </div>

        {/* Dropdown */}
        <Card>
          <CardHeader>
            <CardTitle>Dropdown / Select</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dropdown
              label="Select a city"
              options={cityOptions}
              value={selectedCity}
              onChange={setSelectedCity}
              placeholder="Choose a city..."
            />
            {selectedCity && (
              <p className="text-sm text-gray-600">
                Selected: <strong>{cityOptions.find(c => c.value === selectedCity)?.label}</strong>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs tabs={tabs} />
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Data Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === 'active' ? 'success' : 'default'}>
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Toast Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Toast Notifications</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button onClick={() => addToast({ type: 'success', title: 'Success!', description: 'Operation completed successfully.' })}>
              Show Success
            </Button>
            <Button variant="secondary" onClick={() => addToast({ type: 'error', title: 'Error!', description: 'Something went wrong.' })}>
              Show Error
            </Button>
            <Button variant="outline" onClick={() => addToast({ type: 'info', title: 'Info', description: 'Here is some information.' })}>
              Show Info
            </Button>
            <Button variant="ghost" onClick={() => addToast({ type: 'warning', title: 'Warning!', description: 'Please be careful.' })}>
              Show Warning
            </Button>
          </CardContent>
        </Card>

        {/* Progress Bars */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Bars</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Progress value={progress} showLabel />
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>-10%</Button>
                <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>+10%</Button>
              </div>
            </div>
            <Progress value={75} variant="success" />
            <Progress value={50} variant="warning" />
            <Progress value={25} variant="error" />
          </CardContent>
        </Card>

        {/* Toggle Switches */}
        <Card>
          <CardHeader>
            <CardTitle>Toggle Switches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Toggle label="Enable feature (Medium)" checked={toggle1} onChange={setToggle1} />
            <Toggle label="Small toggle" checked={toggle2} onChange={setToggle2} size="sm" />
            <Toggle label="Large toggle" checked={true} onChange={() => {}} size="lg" />
            <Toggle label="Disabled toggle" checked={false} onChange={() => {}} disabled />
          </CardContent>
        </Card>

        {/* Tooltips */}
        <Card>
          <CardHeader>
            <CardTitle>Tooltips</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Tooltip content="This is a top tooltip" position="top">
              <Button variant="outline">Hover (Top)</Button>
            </Tooltip>
            <Tooltip content="This is a bottom tooltip" position="bottom">
              <Button variant="outline">Hover (Bottom)</Button>
            </Tooltip>
            <Tooltip content="This is a left tooltip" position="left">
              <Button variant="outline">Hover (Left)</Button>
            </Tooltip>
            <Tooltip content="This is a right tooltip" position="right">
              <Button variant="outline">Hover (Right)</Button>
            </Tooltip>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function Day3Page() {
  return (
    <ToastProvider>
      <ComponentsShowcase />
    </ToastProvider>
  );
}


