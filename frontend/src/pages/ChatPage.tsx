import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Loader2, FileText, AlertCircle } from 'lucide-react';
import api, { ChatMessage, ChatResponse, Source } from '../services/api';
import MessageBubble from '../components/chat/MessageBubble';
import SourceCard from '../components/chat/SourceCard';

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(
    conversationId || null
  );
  const [sources, setSources] = useState<Source[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation if ID provided
  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversation = async (convId: string) => {
    try {
      const conversation = await api.getConversation(convId);
      setMessages(conversation.messages);
      setCurrentConversationId(convId);
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setError('Failed to load conversation');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);
    setSources([]);

    try {
      const response: ChatResponse = await api.sendChatMessage({
        query: input,
        conversation_id: currentConversationId,
      });

      // Update conversation ID if new
      if (!currentConversationId && response.conversation_id) {
        setCurrentConversationId(response.conversation_id);
        navigate(`/chat/${response.conversation_id}`, { replace: true });
      }

      // Check for errors
      if (response.status === 'rejected' || response.status === 'retrieval_error' || response.status === 'generation_error') {
        setError(response.answer);
        return;
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toISOString(),
        metadata: {
          sources: response.sources,
          confidence: response.confidence,
          citations: response.citations,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSources(response.sources);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.response?.data?.detail || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setSources([]);
    setError(null);
    navigate('/chat');
  };

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {currentConversationId ? 'Conversation' : 'New Chat'}
            </h1>
            <p className="text-sm text-gray-500">Ask questions about your documents</p>
          </div>
          {currentConversationId && (
            <button
              onClick={startNewChat}
              className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              New Chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to Mentanova AI
                </h2>
                <p className="text-gray-600 max-w-md">
                  Ask questions about your finance and HRMS documents. I'll provide accurate answers
                  with source citations.
                </p>
                <div className="mt-6 space-y-2">
                  <p className="text-sm text-gray-500">Try asking:</p>
                  <div className="space-y-2">
                    {[
                      'What was the Q4 2024 revenue?',
                      'Explain the PF contribution policy',
                      'Show me the expense breakdown',
                    ].map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(example)}
                        className="block w-full max-w-md mx-auto px-4 py-2 text-sm text-left text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        "{example}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about your documents..."
                  rows={1}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                className="px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Sources Sidebar */}
      {sources.length > 0 && (
        <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Sources</h3>
            <div className="space-y-2">
              {sources.map((source, index) => (
                <SourceCard key={index} source={source} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}