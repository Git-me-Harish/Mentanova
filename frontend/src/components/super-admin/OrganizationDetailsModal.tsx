import { useState, useEffect } from 'react';
import { X, Building2, Users, FileText, HardDrive, Shield, Loader2, UserCog, UserMinus } from 'lucide-react';
import api from '../../services/api';
import type { OrganizationDetails } from '../../types';

interface OrganizationDetailsModalProps {
  organizationId: string;
  onClose: () => void;
}

export default function OrganizationDetailsModal({ organizationId, onClose }: OrganizationDetailsModalProps) {
  const [details, setDetails] = useState<OrganizationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadDetails();
  }, [organizationId]);

  const loadDetails = async () => {
    try {
      const data = await api.getOrganizationDetails(organizationId);
      setDetails(data);
    } catch (error) {
      console.error('Failed to load organization details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAdmin = async (userId: string) => {
    if (!confirm('Assign this user as organization admin?')) return;
    
    setActionLoading(userId);
    try {
      await api.assignOrganizationAdmin(organizationId, userId);
      await loadDetails();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to assign admin role');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeAdmin = async (userId: string) => {
    if (!confirm('Revoke admin role from this user?')) return;
    
    setActionLoading(userId);
    try {
      await api.revokeOrganizationAdmin(organizationId, userId);
      await loadDetails();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to revoke admin role');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Organization Details</h2>
              {details && (
                <p className="text-xs sm:text-sm text-gray-500">{details.organization.display_name}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : details ? (
          <div className="p-4 sm:p-6 space-y-6">
            {/* Statistics */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Statistics
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatBox icon={Users} label="Total Users" value={details.statistics.total_users} />
                <StatBox icon={Shield} label="Admins" value={details.statistics.total_admins} />
                <StatBox icon={FileText} label="Documents" value={details.statistics.total_documents} />
                <StatBox 
                  icon={HardDrive} 
                  label="Storage Used" 
                  value={`${details.statistics.storage_used_gb.toFixed(2)} MB`}
                  subtitle={details.statistics.storage_limit_mb 
                    ? `${details.statistics.storage_percentage?.toFixed(1)}% of ${details.statistics.storage_limit_mb} MB`
                    : 'Unlimited'
                  }
                />
              </div>
            </div>

            {/* Admins */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Organization Admins ({details.admins.length})
              </h3>
              {details.admins.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No admins assigned yet</p>
              ) : (
                <div className="space-y-2">
                  {details.admins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{admin.username}</p>
                          <p className="text-xs text-gray-500">{admin.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRevokeAdmin(admin.id)}
                        disabled={actionLoading === admin.id}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {actionLoading === admin.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <UserMinus className="w-3 h-3" />
                        )}
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Users */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Recent Users ({details.recent_users.length})
              </h3>
              {details.recent_users.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No users yet</p>
              ) : (
                <div className="space-y-2">
                  {details.recent_users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      {user.role !== 'org_admin' && (
                        <button
                          onClick={() => handleAssignAdmin(user.id)}
                          disabled={actionLoading === user.id}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {actionLoading === user.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <UserCog className="w-3 h-3" />
                          )}
                          Make Admin
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500">Failed to load organization details</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, subtitle }: { icon: any; label: string; value: string | number; subtitle?: string }) {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-gray-400" />
        <p className="text-xs text-gray-600">{label}</p>
      </div>
      <p className="text-lg font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}