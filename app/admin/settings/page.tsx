"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Settings</CardTitle>
            <CardDescription>
              Manage your application settings and features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/admin/waiting-list">
                  <Button variant="outline" className="w-full justify-start">
                    🔒 Waiting List Management
                  </Button>
                </Link>
                {/* Add more quick links here as needed */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add more settings cards here as needed */}
      </div>
    </div>
  );
} 