'use client';

import React, { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function ChangePasswordForm() {
  const { changePassword, isChangingPassword } = useProfile();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required';
    }

    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }

    if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (formData.current_password === formData.new_password) {
      newErrors.new_password = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    changePassword({
      current_password: formData.current_password,
      new_password: formData.new_password,
    }, {
      onSuccess: () => {
        // Clear form on success
        setFormData({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
        setErrors({});
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={isChangingPassword}
            error={errors.current_password}
          />

          <Input
            label="New Password"
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={isChangingPassword}
            error={errors.new_password}
            helperText="Minimum 8 characters"
          />

          <Input
            label="Confirm New Password"
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={isChangingPassword}
            error={errors.confirm_password}
          />

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isChangingPassword}
            >
              {isChangingPassword ? 'Changing Password...' : 'Change Password'}
            </Button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Password Tips:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc space-y-1">
              <li>Use at least 8 characters</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include numbers and special characters</li>
              <li>Avoid using personal information</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

