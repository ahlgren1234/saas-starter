"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateUserDialog } from '@/components/admin/create-user-dialog';
import { UserDialog } from '@/components/admin/user-dialog';
import { Breadcrumb } from '@/components/ui/breadcrumb';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchUsers();
  }, [user, router]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCsv = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Role', 'Status', 'Created At', 'Last Login'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        `"${user.name}"`,
        `"${user.email}"`,
        user.role,
        user.isEmailVerified ? 'Verified' : 'Pending',
        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
        user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'
      ].join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Breadcrumb
            items={[
              { title: 'Dashboard', href: '/dashboard' },
              { title: 'Admin', href: '/admin' },
              { title: 'Users' }
            ]}
          />

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground">
                View and manage user accounts
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={fetchUsers} variant="outline">
                Refresh
              </Button>
              <Button onClick={exportToCsv} variant="outline">
                Export CSV
              </Button>
              <CreateUserDialog onUserCreated={fetchUsers} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <div className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} users
            </div>
          </div>

          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}

          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading users...</div>
          ) : (
            <>
              <div className="rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Name</th>
                        <th className="px-4 py-3 text-left font-medium">Email</th>
                        <th className="px-4 py-3 text-left font-medium">Role</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user) => (
                        <tr 
                          key={user._id} 
                          className="border-t cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsUserDialogOpen(true);
                          }}
                        >
                          <td className="px-4 py-3">{user.name}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3 capitalize">{user.role}</td>
                          <td className="px-4 py-3">
                            {user.isEmailVerified ? (
                              <span className="text-green-600">Verified</span>
                            ) : (
                              <span className="text-yellow-600">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <UserDialog
        user={selectedUser}
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        onUserUpdated={fetchUsers}
      />
    </div>
  );
} 