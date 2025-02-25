"use client";

import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function ProfilePage() {
  const { user, refreshToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a JPEG or PNG image');
      return;
    }

    setAvatarLoading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update avatar');
      }

      const data = await response.json();
      await refreshToken(); // Refresh the user data to get the new avatar
      toast.success('Avatar updated successfully');
    } catch {
      toast.error('Failed to update avatar');
    } finally {
      setAvatarLoading(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      // Add profile update logic here
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Profile' }
          ]}
        />

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Manage your profile settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-24 w-24">
                <Image
                  key={user?.avatar || 'default'}
                  src={user?.avatar || '/avatars/default.png'}
                  alt="Avatar"
                  className="rounded-full object-cover"
                  fill
                  sizes="96px"
                  priority
                />
              </div>
              <div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={avatarLoading}
                />
                <Button 
                  onClick={handleAvatarClick} 
                  disabled={avatarLoading} 
                  variant="outline" 
                  size="sm"
                >
                  {avatarLoading ? 'Uploading...' : 'Change avatar'}
                </Button>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  defaultValue={user?.name}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  defaultValue={user?.email}
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 