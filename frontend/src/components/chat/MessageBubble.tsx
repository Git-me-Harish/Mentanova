import { User, Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../../services/api';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  // Function to remove inline citations from text
  const removeInlineCitations = (text: string): string => {
    // Remove patterns like [Document: X, Page: Y] or [Document: X, Page: Y, Section: Z]
    return text.replace(/\[Document:\s*[^\]]+\]/gi, '').trim();
  };

  // Clean the message content
  const cleanedContent = isUser ? message.content : removeInlineCitations(message.content);

  return (
    <div className={`flex items-start gap-4 w-full ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {!isUser ? (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
      ) : (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0 shadow-md">
          <User className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Message Content - WIDER */}
      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''} max-w-none`}>
        <div
          className={`rounded-2xl px-5 py-4 ${
            isUser
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg max-w-2xl'
              : 'bg-white border border-gray-200 shadow-md w-full'
          }`}
        >
          {isUser ? (
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{cleanedContent}</p>
          ) : (
            <div className="prose prose-base max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-800 prose-p:leading-relaxed prose-p:text-[15px] prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-semibold prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:text-sm prose-ul:list-disc prose-ul:pl-6 prose-ul:my-3 prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-3 prose-li:text-gray-800 prose-li:my-2 prose-li:text-[15px] prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:my-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-3" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-semibold text-gray-900 mt-5 mb-3" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-gray-800 leading-relaxed my-3 text-[15px]" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-6 my-3 space-y-2" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-6 my-3 space-y-2" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-gray-800 leading-relaxed text-[15px]" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 italic text-gray-600 my-4 bg-blue-50 rounded-r" {...props} />
                  ),
                  code: ({ node, inline, ...props }: any) =>
                    inline ? (
                      <code className="bg-pink-50 text-pink-600 px-2 py-1 rounded text-sm font-mono" {...props} />
                    ) : (
                      <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-3 leading-relaxed" {...props} />
                    ),
                  a: ({ node, ...props }) => (
                    <a className="text-blue-600 hover:text-blue-700 hover:underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                  // ENHANCED TABLE RENDERING - WIDER
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-5 rounded-lg border border-gray-300 shadow-md">
                      <table className="min-w-full divide-y divide-gray-300 text-sm" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50" {...props} />
                  ),
                  tbody: ({ node, ...props }) => (
                    <tbody className="bg-white divide-y divide-gray-200" {...props} />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr className="hover:bg-blue-50 transition-colors duration-150" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border-b-2 border-gray-400" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="px-5 py-4 text-[15px] text-gray-800 whitespace-normal" {...props} />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="my-6 border-t-2 border-gray-300" {...props} />
                  ),
                }}
              >
                {cleanedContent}
              </ReactMarkdown>
            </div>
          )}

          {/* Metadata for assistant messages */}
          {!isUser && message.metadata && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {message.metadata.confidence && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 font-medium">Confidence:</span>
                  <span
                    className={`px-2.5 py-1 rounded-full font-semibold ${
                      message.metadata.confidence === 'high'
                        ? 'bg-green-100 text-green-700'
                        : message.metadata.confidence === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {message.metadata.confidence}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        {message.timestamp && (
          <p className={`text-xs text-gray-400 mt-2 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}