"use client";

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Settings {
  isWaitingListMode: boolean;
}

export function SettingsForm() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch settings');
      }

      setSettings(data.settings);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update settings');
      }

      setSettings(data.settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update settings');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>
          Configure your site settings and features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="waiting-list-mode" className="flex flex-col space-y-1">
            <span>Waiting List Mode</span>
            <span className="font-normal text-sm text-muted-foreground">
              When enabled, visitors will only see a waiting list signup form.
            </span>
          </Label>
          <Switch
            id="waiting-list-mode"
            checked={settings?.isWaitingListMode ?? false}
            onCheckedChange={(checked) => updateSettings({ isWaitingListMode: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
} 