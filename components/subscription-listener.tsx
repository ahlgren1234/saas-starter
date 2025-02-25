'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export function SubscriptionListener() {
  const { refreshToken } = useAuth();

  useEffect(() => {
    const eventSource = new EventSource('/api/stripe/subscription-events');

    eventSource.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'subscription.updated') {
          await refreshToken();
        }
      } catch (error) {
        console.error('Error processing subscription event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [refreshToken]);

  return null;
} 