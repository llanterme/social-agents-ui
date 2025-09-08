'use client';

import { useState } from 'react';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Calendar, Shield, Edit2, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: 'text' | 'email';
  required?: boolean;
}

function EditableField({ 
  label, 
  value, 
  isEditing, 
  onChange, 
  type = 'text',
  required = false 
}: EditableFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase()}>{label}</Label>
      {isEditing ? (
        <Input
          id={label.toLowerCase()}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <div className="px-3 py-2 border rounded-md bg-gray-50">
          {value || 'Not provided'}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <div className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      active 
        ? "bg-green-100 text-green-800" 
        : "bg-red-100 text-red-800"
    )}>
      <div className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        active ? "bg-green-500" : "bg-red-500"
      )} />
      {active ? 'Active' : 'Inactive'}
    </div>
  );
}

export function UserProfile() {
  const { data: profile, isLoading, error, refetch } = useProfile();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    surname: '',
    email: ''
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <Card className="p-6">
          <div className="flex items-center space-x-3 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">Failed to load profile</p>
              <p className="text-sm text-gray-600 mt-1">
                {error instanceof Error ? error.message : 'An error occurred'}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => refetch()} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <Card className="p-6">
          <p className="text-gray-600">No profile data available.</p>
        </Card>
      </div>
    );
  }

  const handleEdit = () => {
    setEditForm({
      name: profile.name,
      surname: profile.surname,
      email: profile.email
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: profile.name,
      surname: profile.surname,
      email: profile.email
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        {!isEditing ? (
          <Button onClick={handleEdit} className="flex items-center space-x-2">
            <Edit2 className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleSave} 
              disabled={updateProfile.isPending}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{updateProfile.isPending ? 'Saving...' : 'Save'}</span>
            </Button>
            <Button 
              onClick={handleCancel} 
              variant="outline"
              disabled={updateProfile.isPending}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
          </div>
        )}
      </div>

      {updateProfile.isSuccess && (
        <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Profile updated successfully!</span>
        </div>
      )}

      {updateProfile.error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-medium">
            {updateProfile.error instanceof Error 
              ? updateProfile.error.message 
              : 'Failed to update profile'}
          </span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          </div>
          
          <div className="space-y-4">
            <EditableField
              label="First Name"
              value={isEditing ? editForm.name : profile.name}
              isEditing={isEditing}
              onChange={(value) => setEditForm(prev => ({ ...prev, name: value }))}
              required
            />
            
            <EditableField
              label="Last Name"
              value={isEditing ? editForm.surname : profile.surname}
              isEditing={isEditing}
              onChange={(value) => setEditForm(prev => ({ ...prev, surname: value }))}
              required
            />
            
            <EditableField
              label="Email Address"
              value={isEditing ? editForm.email : profile.email}
              isEditing={isEditing}
              onChange={(value) => setEditForm(prev => ({ ...prev, email: value }))}
              type="email"
              required
            />
          </div>
        </Card>

        {/* Account Information */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Account Status</Label>
              <div className="mt-2">
                <StatusBadge active={profile.active} />
              </div>
            </div>

            <div>
              <Label>User ID</Label>
              <div className="px-3 py-2 border rounded-md bg-gray-50 font-mono text-sm">
                #{profile.id}
              </div>
            </div>

            <div>
              <Label>Roles</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.roles.map((role, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Member Since</span>
              </Label>
              <div className="px-3 py-2 border rounded-md bg-gray-50">
                {formatDate(profile.createdAt)}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}