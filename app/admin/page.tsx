"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Admin' }
          ]}
        />

        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Manage your application and access administrative features
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/users">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl">👥 Users</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/waiting-list">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl">📝 Waiting List</CardTitle>
                  <CardDescription>
                    Manage waiting list and access controls
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/settings">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl">⚙️ Settings</CardTitle>
                  <CardDescription>
                    Configure application settings
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 