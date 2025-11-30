import { FileText, Trash2, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Document } from '../../services/api';

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function DocumentCard({ document, onDelete, onRefresh }: DocumentCardProps) {
  const getStatusIcon = () => {
    switch (document.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (document.status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDocTypeColor = () => {
    switch (document.doc_type) {
      case 'finance':
        return 'bg-blue-100 text-blue-700';
      case 'hrms':
        return 'bg-purple-100 text-purple-700';
      case 'policy':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-all p-4 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {document.filename}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${getDocTypeColor()}`}>
                {document.doc_type}
              </span>
              {document.department && (
                <span className="text-xs text-gray-500">{document.department}</span>
              )}
            </div>
          </div>
        </div>
        {getStatusIcon()}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-500">Pages</p>
          <p className="text-sm font-semibold text-gray-900">{document.total_pages || 0}</p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-500">Chunks</p>
          <p className="text-sm font-semibold text-gray-900">{document.total_chunks || 0}</p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-500">Status</p>
          <p className={`text-xs font-semibold capitalize ${getStatusColor().replace('bg-', 'text-')}`}>
            {document.status}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(document.upload_date), { addSuffix: true })}
        </span>
        <div className="flex items-center space-x-2">
          {document.status === 'processing' && (
            <button
              onClick={onRefresh}
              className="text-gray-400 hover:text-primary-600 transition-colors"
              title="Refresh status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(document.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Delete document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}