import { useState, useEffect } from 'react';
import { X, Building2, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import api from '../../services/api';
import type { CreateOrganizationRequest } from '../../types';

interface CreateOrganizationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateOrganizationModal({ onClose, onSuccess }: CreateOrganizationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);
  const [formData, setFormData] = useState<CreateOrganizationRequest>({
    name: '',
    display_name: '',
    description: '',
    max_users: undefined,
    max_documents: undefined,
    max_storage_gb: undefined,  
  });

  // Auto-generate slug from display name
  useEffect(() => {
    if (autoGenerateSlug && formData.display_name) {
      const slug = formData.display_name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with hyphens
        .replace(/[^a-z0-9_-]/g, '')    // Remove invalid characters
        .replace(/[-_]+/g, '-')          // Replace consecutive hyphens/underscores
        .replace(/^[-_]+|[-_]+$/g, ''); // Strip leading/trailing hyphens/underscores
      
      setFormData(prev => ({ ...prev, name: slug }));
    }
  }, [formData.display_name, autoGenerateSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.createOrganization(formData);
      onSuccess();
    } catch (err: any) {
      console.error('Create organization error:', err);
      const errorDetail = err.response?.data?.detail;
      
      // Handle validation errors
      if (Array.isArray(errorDetail)) {
        const errorMessages = errorDetail.map((e: any) => e.msg).join(', ');
        setError(errorMessages);
      } else {
        setError(errorDetail || 'Failed to create organization');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If manually editing slug, disable auto-generation
    if (name === 'name') {
      setAutoGenerateSlug(false);
    }
    
    if (name === 'max_users' || name === 'max_documents' || name === 'max_storage_gb') { 
      setFormData({
        ...formData,
        [name]: value === '' ? undefined : parseInt(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const toggleAutoGenerate = () => {
    setAutoGenerateSlug(!autoGenerateSlug);
    if (!autoGenerateSlug && formData.display_name) {
      // Re-generate slug when toggling back on
      const slug = formData.display_name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9_-]/g, '')
        .replace(/[-_]+/g, '-')
        .replace(/^[-_]+|[-_]+$/g, '');
      setFormData(prev => ({ ...prev, name: slug }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Create Organization</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                placeholder="My Organization"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                The public-facing name of your organization
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Organization Slug <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={toggleAutoGenerate}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                    autoGenerateSlug 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  disabled={loading}
                >
                  <Sparkles className="w-3 h-3" />
                  {autoGenerateSlug ? 'Auto' : 'Manual'}
                </button>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base ${
                  autoGenerateSlug ? 'bg-gray-50' : ''
                }`}
                placeholder="my-organization"
                disabled={loading || autoGenerateSlug}
              />
              <p className="mt-1 text-xs text-gray-500">
                {autoGenerateSlug 
                  ? '✨ Auto-generated from display name'
                  : 'Lowercase letters, numbers, hyphens, and underscores only'
                }
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base resize-none"
                placeholder="Brief description of the organization..."
                disabled={loading}
              />
            </div>
          </div>

          {/* Limits */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Resource Limits (Optional)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Users
                </label>
                <input
                  type="number"
                  name="max_users"
                  value={formData.max_users || ''}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Unlimited"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Documents
                </label>
                <input
                  type="number"
                  name="max_documents"
                  value={formData.max_documents || ''}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Unlimited"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Storage (GB)
                </label>
                <input
                  type="number"
                  name="max_storage_gb"
                  value={formData.max_storage_gb || ''}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Unlimited"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm sm:text-base font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors text-sm sm:text-base font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Building2 className="w-4 h-4" />
                  Create Organization
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}