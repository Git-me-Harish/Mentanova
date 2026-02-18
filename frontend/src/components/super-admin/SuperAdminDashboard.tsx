import { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  HardDrive, 
  Activity, 
  TrendingUp,
  Shield,
  Globe
} from 'lucide-react';
import api from '../../services/api';
import type { SuperAdminStats } from '../../types';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getSuperAdminStatistics();
      setStats(data);
    } catch (error) {
      console.error('Failed to load super admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 scroll-smooth-touch">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">Global system overview and analytics</p>
        </div>

        {/* Global Stats */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Global Statistics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
            <StatCard
              icon={Building2}
              label="Total Organizations"
              value={stats?.total_organizations || 0}
              color="purple"
            />
            <StatCard
              icon={Globe}
              label="Active Organizations"
              value={stats?.active_organizations || 0}
              color="green"
            />
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats?.total_users || 0}
              color="blue"
            />
            <StatCard
              icon={FileText}
              label="Total Documents"
              value={stats?.total_documents || 0}
              color="orange"
            />
            <StatCard
              icon={HardDrive}
              label="Total Storage"
              value={`${stats?.total_storage_mb.toFixed(2) || 0} MB`}
              color="red"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <QuickActionCard
              title="Manage Organizations"
              description="Create, edit, and manage all organizations"
              link="/super-admin/organizations"
              icon={Building2}
            />
            <QuickActionCard
              title="View All Users"
              description="Browse and manage users across all organizations"
              link="/admin/users"
              icon={Users}
            />
            <QuickActionCard
              title="System Documents"
              description="View all documents across the platform"
              link="/documents"
              icon={FileText}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  subtitle?: string;
}

function StatCard({ icon: Icon, label, value, color, subtitle }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 break-words">{value}</h3>
      <p className="text-xs sm:text-sm text-gray-600">{label}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  link: string;
  icon: any;
}

function QuickActionCard({ title, description, link, icon: Icon }: QuickActionCardProps) {
  return (
    <a
      href={link}
      className="block bg-white rounded-lg border border-gray-200 p-4 sm:p-6 transition-all min-touch-target hover:shadow-md hover:border-primary-300"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base break-words">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 break-words">{description}</p>
        </div>
      </div>
    </a>
  );
}