"use client";

import { WaitingListTable } from "@/components/admin/waiting-list-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SettingsForm } from "@/components/admin/settings-form";

export default function AdminWaitingListPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Waiting List Settings</CardTitle>
            <CardDescription>
              Configure waiting list mode and manage entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waiting List Entries</CardTitle>
            <CardDescription>
              View and manage waiting list sign-ups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WaitingListTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 