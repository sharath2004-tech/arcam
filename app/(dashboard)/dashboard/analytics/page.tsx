'use client';

import { useState } from 'react';
import { Card } from '@/components/dashboard/card';
import { TrendingUp, Users, Camera, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  const [dateRange] = useState('month');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your studio&apos;s performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Total Revenue"
          value="$12,485"
          trend={12}
          icon={<DollarSign className="w-6 h-6" />}
          color="from-green-500 to-green-600"
        />
        <Card
          title="Total Bookings"
          value="34"
          trend={8}
          icon={<Camera className="w-6 h-6" />}
          color="from-blue-500 to-blue-600"
        />
        <Card
          title="New Clients"
          value="18"
          trend={-3}
          icon={<Users className="w-6 h-6" />}
          color="from-purple-500 to-purple-600"
        />
        <Card
          title="Avg Rating"
          value="4.8"
          trend={2}
          icon={<TrendingUp className="w-6 h-6" />}
          color="from-yellow-500 to-yellow-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card-glass">
          <h2 className="text-xl font-bold mb-6">Revenue Trend</h2>
          <div className="h-64 flex items-end gap-2 px-4">
            {[65, 78, 90, 81, 92, 85, 88, 95].map((height, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-primary to-accent"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="grid grid-cols-8 gap-2 mt-4 px-4 text-xs text-muted-foreground">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'].map((day, idx) => (
              <div key={idx} className="text-center">{day}</div>
            ))}
          </div>
        </div>

        {/* Booking Status */}
        <div className="card-glass">
          <h2 className="text-xl font-bold mb-6">Booking Status</h2>
          <div className="space-y-4">
            {[
              { label: 'Completed', value: 28, color: 'from-green-500 to-green-600' },
              { label: 'Upcoming', value: 8, color: 'from-blue-500 to-blue-600' },
              { label: 'Cancelled', value: 2, color: 'from-red-500 to-red-600' },
            ].map((status, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{status.label}</p>
                  <p className="font-bold">{status.value}</p>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${status.color}`}
                    style={{ width: `${(status.value / 38) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Photographers */}
        <div className="card-glass">
          <h2 className="text-xl font-bold mb-4">Top Photographers</h2>
          <div className="space-y-3">
            {[
              { name: 'Sarah Photographer', bookings: 24, rating: 4.9 },
              { name: 'John Photographer', bookings: 18, rating: 4.8 },
              { name: 'Emma Photographer', bookings: 12, rating: 4.7 },
            ].map((photo, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{photo.name}</p>
                  <p className="text-xs text-muted-foreground">{photo.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{photo.rating}⭐</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Satisfaction */}
        <div className="card-glass">
          <h2 className="text-xl font-bold mb-4">Client Satisfaction</h2>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl font-bold text-gradient mb-2">92%</div>
              <p className="text-muted-foreground">Clients satisfied</p>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="text-2xl mb-1">{idx === 4 ? '😍' : idx >= 3 ? '😊' : '😐'}</div>
                  <p className="text-xs text-muted-foreground">{(idx + 1) * 20}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
