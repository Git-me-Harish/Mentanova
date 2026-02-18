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
import { useCustomization } from '../../contexts/CustomizationContext';

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
  const { darkMode } = useCustomization();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 backdrop-blur-sm transition-colors ${
          darkMode ? 'bg-black/70' : 'bg-gray-900/50'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative rounded-lg sm:rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col transition-all duration-200 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b flex-shrink-0 transition-colors ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              darkMode ? 'bg-blue-600/80' : 'bg-blue-600'
            }`}>
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className={`text-base sm:text-lg font-semibold transition-colors ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Conversation Analytics
              </h2>
              <p className={`text-xs sm:text-sm hidden sm:block transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Performance insights and metrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all flex-shrink-0 min-touch-target ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto scroll-smooth-touch transition-colors ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className={`w-10 h-10 sm:w-12 sm:h-12 animate-spin mx-auto mb-4 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <p className={`text-xs sm:text-sm transition-colors ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Loading analytics...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center max-w-md px-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                  darkMode ? 'bg-red-900/30' : 'bg-red-100'
                }`}>
                  <AlertCircle className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    darkMode ? 'text-red-400' : 'text-red-600'
                  }`} />
                </div>
                <p className={`text-sm sm:text-base font-medium mb-2 transition-colors ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Failed to load analytics
                </p>
                <p className={`text-xs sm:text-sm mb-4 transition-colors ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {error}
                </p>
                <button
                  onClick={fetchAnalytics}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all min-touch-target ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : analytics ? (
            <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <MetricCard
                  icon={MessageSquare}
                  label="Total Messages"
                  value={analytics.total_messages.toString()}
                  color="blue"
                  darkMode={darkMode}
                />
                <MetricCard
                  icon={FileText}
                  label="Documents"
                  value={analytics.total_documents.toString()}
                  color="purple"
                  darkMode={darkMode}
                />
                <MetricCard
                  icon={TrendingUp}
                  label="Sources Cited"
                  value={analytics.total_sources_cited.toString()}
                  color="green"
                  darkMode={darkMode}
                />
                <MetricCard
                  icon={Clock}
                  label="Duration"
                  value={`${analytics.duration_minutes}m`}
                  color="orange"
                  darkMode={darkMode}
                />
              </div>

              {/* Conversation Breakdown */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className={`rounded-lg p-3 sm:p-4 border transition-all ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`text-xs sm:text-sm mb-1 transition-colors ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    User Queries
                  </div>
                  <div className={`text-xl sm:text-2xl font-semibold transition-colors ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {analytics.user_queries}
                  </div>
                </div>
                <div className={`rounded-lg p-3 sm:p-4 border transition-all ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`text-xs sm:text-sm mb-1 transition-colors ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    AI Responses
                  </div>
                  <div className={`text-xl sm:text-2xl font-semibold transition-colors ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {analytics.ai_responses}
                  </div>
                </div>
              </div>

              {/* Confidence Distribution */}
              <div className={`rounded-lg border p-4 sm:p-5 transition-all ${
                darkMode 
                  ? 'bg-gray-700/30 border-gray-600' 
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-sm sm:text-base font-semibold mb-3 sm:mb-4 transition-colors ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Response Confidence
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <ConfidenceBar
                    icon={CheckCircle}
                    label="High Confidence"
                    count={analytics.confidence_distribution.high}
                    total={analytics.ai_responses}
                    color="green"
                    darkMode={darkMode}
                  />
                  <ConfidenceBar
                    icon={MinusCircle}
                    label="Medium Confidence"
                    count={analytics.confidence_distribution.medium}
                    total={analytics.ai_responses}
                    color="yellow"
                    darkMode={darkMode}
                  />
                  <ConfidenceBar
                    icon={AlertCircle}
                    label="Low Confidence"
                    count={analytics.confidence_distribution.low}
                    total={analytics.ai_responses}
                    color="red"
                    darkMode={darkMode}
                  />
                </div>
              </div>

              {/* Documents Referenced */}
              {analytics.documents_referenced.length > 0 && (
                <div className={`rounded-lg border p-4 sm:p-5 transition-all ${
                  darkMode 
                    ? 'bg-gray-700/30 border-gray-600' 
                    : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-sm sm:text-base font-semibold mb-3 transition-colors ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Documents Referenced
                  </h3>
                  <div className="space-y-2">
                    {analytics.documents_referenced.map((doc, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center gap-2 sm:gap-3 px-3 py-2 sm:py-2.5 rounded-lg border transition-all ${
                          doc === analytics.primary_document 
                            ? darkMode
                              ? 'bg-blue-900/30 border-blue-700'
                              : 'bg-blue-50 border-blue-200'
                            : darkMode
                              ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <FileText className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-colors ${
                          doc === analytics.primary_document 
                            ? darkMode ? 'text-blue-400' : 'text-blue-600'
                            : darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <span className={`flex-1 text-xs sm:text-sm truncate transition-colors ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`} title={doc}>
                          {doc}
                        </span>
                        {doc === analytics.primary_document && (
                          <span className={`px-2 py-0.5 text-xs font-medium rounded flex-shrink-0 transition-colors ${
                            darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                          }`}>
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
                <div className={`rounded-lg border p-4 sm:p-5 transition-all ${
                  darkMode 
                    ? 'bg-gray-700/30 border-gray-600' 
                    : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-sm sm:text-base font-semibold mb-3 transition-colors ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Time Periods Discussed
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analytics.time_periods_discussed.map((period, idx) => (
                      <span 
                        key={idx}
                        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {period}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className={`rounded-lg p-3 sm:p-4 border transition-all ${
                darkMode 
                  ? 'bg-gray-700/50 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <div className={`mb-1 transition-colors ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Created
                    </div>
                    <div className={`font-medium transition-colors ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {new Date(analytics.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div>
                    <div className={`mb-1 transition-colors ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Conversation ID
                    </div>
                    <div className={`font-mono text-xs truncate transition-colors ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} title={analytics.conversation_id}>
                      {analytics.conversation_id.slice(0, 16)}...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className={`border-t px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0 transition-all ${
          darkMode 
            ? 'border-gray-700 bg-gray-800' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            onClick={onClose}
            className={`w-full sm:w-auto px-4 py-2.5 text-sm font-medium rounded-lg border transition-all min-touch-target ${
              darkMode 
                ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600 hover:text-white' 
                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  color,
  darkMode 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  color: 'blue' | 'purple' | 'green' | 'orange';
  darkMode: boolean;
}) {
  const colorClasses = {
    blue: darkMode 
      ? 'bg-blue-900/40 text-blue-400 border-blue-800' 
      : 'bg-blue-50 text-blue-600 border-blue-100',
    purple: darkMode 
      ? 'bg-purple-900/40 text-purple-400 border-purple-800' 
      : 'bg-purple-50 text-purple-600 border-purple-100',
    green: darkMode 
      ? 'bg-green-900/40 text-green-400 border-green-800' 
      : 'bg-green-50 text-green-600 border-green-100',
    orange: darkMode 
      ? 'bg-orange-900/40 text-orange-400 border-orange-800' 
      : 'bg-orange-50 text-orange-600 border-orange-100',
  };

  const iconColorClasses = {
    blue: darkMode ? 'text-blue-400' : 'text-blue-600',
    purple: darkMode ? 'text-purple-400' : 'text-purple-600',
    green: darkMode ? 'text-green-400' : 'text-green-600',
    orange: darkMode ? 'text-orange-400' : 'text-orange-600',
  };

  return (
    <div className={`rounded-lg p-3 sm:p-4 border transition-all ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-colors ${iconColorClasses[color]}`} />
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-medium mb-0.5 truncate transition-colors ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {label}
          </div>
          <div className={`text-lg sm:text-xl font-semibold transition-colors ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

// Confidence Bar Component
function ConfidenceBar({ 
  icon: Icon, 
  label, 
  count, 
  total, 
  color,
  darkMode 
}: { 
  icon: any; 
  label: string; 
  count: number; 
  total: number; 
  color: 'green' | 'yellow' | 'red';
  darkMode: boolean;
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  const colorClasses = {
    green: { 
      bg: darkMode ? 'bg-green-500' : 'bg-green-500', 
      text: darkMode ? 'text-green-400' : 'text-green-600', 
      icon: darkMode ? 'text-green-400' : 'text-green-500' 
    },
    yellow: { 
      bg: darkMode ? 'bg-yellow-500' : 'bg-yellow-500', 
      text: darkMode ? 'text-yellow-400' : 'text-yellow-600', 
      icon: darkMode ? 'text-yellow-400' : 'text-yellow-500' 
    },
    red: { 
      bg: darkMode ? 'bg-red-500' : 'bg-red-500', 
      text: darkMode ? 'text-red-400' : 'text-red-600', 
      icon: darkMode ? 'text-red-400' : 'text-red-500' 
    },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-colors ${colorClasses[color].icon}`} />
          <span className={`text-xs sm:text-sm font-medium transition-colors ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {label}
          </span>
        </div>
        <span className={`text-xs sm:text-sm font-semibold transition-colors ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {count} <span className={`font-normal transition-colors ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            ({percentage}%)
          </span>
        </span>
      </div>
      <div className={`w-full rounded-full h-2 overflow-hidden transition-colors ${
        darkMode ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ${colorClasses[color].bg}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}