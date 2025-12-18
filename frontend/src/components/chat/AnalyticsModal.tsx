import { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  FileText, 
  Clock, 
  TrendingUp, 
  Calendar,
  BarChart3,
  CheckCircle,
  AlertCircle,
  MinusCircle,
  Loader2
} from 'lucide-react';
import api from '../../services/api';

interface AnalyticsModalProps {
  conversationId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ConversationAnalytics {
  conversation_id: string;
  total_messages: number;
  user_queries: number;
  ai_responses: number;
  documents_referenced: string[];
  total_documents: number;
  total_sources_cited: number;
  confidence_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  primary_document: string | null;
  active_documents: string[];
  topics: string[];
  time_periods_discussed: string[];
  created_at: string;
  duration_minutes: number;
}

export default function AnalyticsModal({ conversationId, isOpen, onClose }: AnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<ConversationAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && conversationId) {
      fetchAnalytics();
    }
  }, [isOpen, conversationId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getConversationAnalytics(conversationId);
      setAnalytics(data);
    } catch (err: any) {
      console.error('Failed to fetch analytics:', err);
      setError(err.response?.data?.detail || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getConfidencePercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Conversation Analytics</h2>
              <p className="text-sm text-gray-500">Performance insights and metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-sm text-gray-500">Loading analytics...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center max-w-md">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-sm text-gray-900 font-medium mb-2">Failed to load analytics</p>
                <p className="text-sm text-gray-500 mb-4">{error}</p>
                <button
                  onClick={fetchAnalytics}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : analytics ? (
            <div className="p-6 space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  icon={MessageSquare}
                  label="Total Messages"
                  value={analytics.total_messages.toString()}
                  color="blue"
                />
                <MetricCard
                  icon={FileText}
                  label="Documents"
                  value={analytics.total_documents.toString()}
                  color="purple"
                />
                <MetricCard
                  icon={TrendingUp}
                  label="Sources Cited"
                  value={analytics.total_sources_cited.toString()}
                  color="green"
                />
                <MetricCard
                  icon={Clock}
                  label="Duration"
                  value={`${analytics.duration_minutes}m`}
                  color="orange"
                />
              </div>

              {/* Conversation Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">User Queries</div>
                  <div className="text-2xl font-semibold text-gray-900">{analytics.user_queries}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">AI Responses</div>
                  <div className="text-2xl font-semibold text-gray-900">{analytics.ai_responses}</div>
                </div>
              </div>

              {/* Confidence Distribution */}
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Response Confidence</h3>
                
                <div className="space-y-4">
                  <ConfidenceBar
                    icon={CheckCircle}
                    label="High Confidence"
                    count={analytics.confidence_distribution.high}
                    total={analytics.ai_responses}
                    color="green"
                  />
                  <ConfidenceBar
                    icon={MinusCircle}
                    label="Medium Confidence"
                    count={analytics.confidence_distribution.medium}
                    total={analytics.ai_responses}
                    color="yellow"
                  />
                  <ConfidenceBar
                    icon={AlertCircle}
                    label="Low Confidence"
                    count={analytics.confidence_distribution.low}
                    total={analytics.ai_responses}
                    color="red"
                  />
                </div>
              </div>

              {/* Documents Referenced */}
              {analytics.documents_referenced.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Documents Referenced</h3>
                  <div className="space-y-2">
                    {analytics.documents_referenced.map((doc, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          doc === analytics.primary_document 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                        }`}
                      >
                        <FileText className={`w-4 h-4 flex-shrink-0 ${
                          doc === analytics.primary_document ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span className="flex-1 text-sm text-gray-700 truncate">{doc}</span>
                        {doc === analytics.primary_document && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Periods */}
              {analytics.time_periods_discussed.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Time Periods Discussed</h3>
                  <div className="flex flex-wrap gap-2">
                    {analytics.time_periods_discussed.map((period, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                      >
                        {period}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">Created</div>
                    <div className="font-medium text-gray-900">
                      {new Date(analytics.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Conversation ID</div>
                    <div className="font-mono text-xs text-gray-600 truncate">
                      {analytics.conversation_id.slice(0, 16)}...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable Metric Card Component
function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  color: 'blue' | 'purple' | 'green' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
  };

  return (
    <div className={`rounded-lg p-4 border ${colorClasses[color]}`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${iconColorClasses[color]}`} />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-600 mb-0.5">{label}</div>
          <div className="text-xl font-semibold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}

// Reusable Confidence Bar Component
function ConfidenceBar({ 
  icon: Icon, 
  label, 
  count, 
  total, 
  color 
}: { 
  icon: any; 
  label: string; 
  count: number; 
  total: number; 
  color: 'green' | 'yellow' | 'red';
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  const colorClasses = {
    green: { bg: 'bg-green-500', text: 'text-green-600', icon: 'text-green-500' },
    yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', icon: 'text-yellow-500' },
    red: { bg: 'bg-red-500', text: 'text-red-600', icon: 'text-red-500' },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${colorClasses[color].icon}`} />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {count} <span className="text-gray-500 font-normal">({percentage}%)</span>
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`${colorClasses[color].bg} h-full rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}