"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  subscriptionStatus?: string | null;
  subscriptionPlan?: string | null;
  subscriptionCurrentPeriodEnd?: string | null;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['user', 'admin']),
});

interface UserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export function UserDialog({ user, open, onOpenChange, onUserUpdated }: UserDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: (user?.role as 'user' | 'admin') || 'user',
    },
  });

  // Update form when user changes
  if (user && (user.name !== form.getValues('name') || user.email !== form.getValues('email'))) {
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role as 'user' | 'admin',
    });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${user?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* User Information Section */}
          <div className="grid gap-2 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-muted-foreground">Status</div>
              <div>
                {user.isEmailVerified ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-yellow-600">Pending Verification</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="text-muted-foreground">Last Login</div>
              <div>
                {user.lastLogin ? (
                  new Date(user.lastLogin).toLocaleString()
                ) : (
                  <span className="text-muted-foreground">Never</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="text-muted-foreground">Joined</div>
              <div>{new Date(user.createdAt).toLocaleString()}</div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="text-muted-foreground">Subscription Status</div>
              <div>
                {user.role === 'admin' ? (
                  <span className="text-purple-600">Admin (Pro Features)</span>
                ) : user.subscriptionStatus === 'active' ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-yellow-600">No Active Subscription</span>
                )}
              </div>
            </div>
            {(user.role === 'admin' || user.subscriptionStatus === 'active') && (
              <>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Plan</div>
                  <div className="capitalize">
                    {user.role === 'admin' ? 'Pro' : user.subscriptionPlan || 'N/A'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Expires</div>
                  <div>
                    {user.role === 'admin' ? (
                      'Never'
                    ) : user.subscriptionCurrentPeriodEnd ? (
                      new Date(user.subscriptionCurrentPeriodEnd).toLocaleDateString()
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Edit Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-sm font-medium text-destructive">{error}</div>
              )}

              <div className="flex justify-between">
                <div className="flex space-x-2">
                  {!user.isEmailVerified && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/auth/verify-test', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            },
                            body: JSON.stringify({ email: user.email }),
                          });

                          if (!response.ok) {
                            throw new Error('Failed to verify user');
                          }

                          onUserUpdated();
                        } catch (error) {
                          setError(error instanceof Error ? error.message : 'Failed to verify user');
                        }
                      }}
                    >
                      Verify Email
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 