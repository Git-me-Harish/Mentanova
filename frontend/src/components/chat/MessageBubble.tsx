import { User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../../services/api';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">M</span>
        </div>
      )}

      <div
        className={`flex-1 max-w-3xl ${
          isUser
            ? 'bg-primary-500 text-white rounded-lg p-4'
            : 'bg-white rounded-lg p-4 shadow-sm border border-gray-200'
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Metadata for assistant messages */}
        {!isUser && message.metadata && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            {message.metadata.confidence && (
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Confidence:</span>
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    message.metadata.confidence === 'high'
                      ? 'bg-green-100 text-green-700'
                      : message.metadata.confidence === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {message.metadata.confidence}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </div>
  );
}