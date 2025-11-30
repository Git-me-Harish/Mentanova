/**
 * API Service for communicating with the backend
 */
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

// Types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  metadata?: any;
}

export interface ChatRequest {
  query: string;
  conversation_id?: string | null;
  doc_type?: string;
  department?: string;
  stream?: boolean;
}

export interface Source {
  document: string;
  page: number | null;
  section: string | null;
  chunk_id: string;
}

export interface ChatResponse {
  answer: string;
  conversation_id: string;
  sources: Source[];
  citations: any[];
  confidence: string;
  status: string;
  metadata: any;
}

export interface Document {
  id: string;
  filename: string;
  doc_type: string;
  department: string | null;
  total_pages: number;
  total_chunks: number;
  status: string;
  upload_date: string;
  processed_date: string | null;
}

export interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
  metadata: any;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}${API_VERSION}`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60 seconds
    });

    // Request interceptor for adding auth tokens
    this.api.interceptors.request.use(
      (config) => {
        // TODO: Add authentication token
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async healthCheck() {
    const response = await this.api.get('/health');
    return response.data;
  }

  // Chat endpoints
  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await this.api.post('/chat', request);
    return response.data;
  }

  async getConversations(limit: number = 10): Promise<Conversation[]> {
    const response = await this.api.get('/chat/conversations', {
      params: { limit },
    });
    return response.data;
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    const response = await this.api.get(`/chat/conversations/${conversationId}`);
    return response.data;
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await this.api.delete(`/chat/conversations/${conversationId}`);
  }

  // Document endpoints
  async uploadDocument(
    file: File,
    docType: string,
    department?: string
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const params: any = { doc_type: docType };
    if (department) params.department = department;

    const response = await this.api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params,
    });
    return response.data;
  }

  async getDocuments(params?: {
    skip?: number;
    limit?: number;
    doc_type?: string;
    status?: string;
    department?: string;
  }): Promise<{ total: number; documents: Document[] }> {
    const response = await this.api.get('/documents', { params });
    return response.data;
  }

  async getDocumentStatus(documentId: string): Promise<any> {
    const response = await this.api.get(`/documents/${documentId}/status`);
    return response.data;
  }

  async deleteDocument(documentId: string): Promise<void> {
    await this.api.delete(`/documents/${documentId}`);
  }

  // Search endpoints
  async search(query: string, topK: number = 5, docType?: string) {
    const response = await this.api.post('/search', null, {
      params: { query, top_k: topK, doc_type: docType },
    });
    return response.data;
  }
}

// Export singleton instance
export const api = new ApiService();
export default api;