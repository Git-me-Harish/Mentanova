// Enhanced Customization Types

// Organization Types

/**
 * Organization model
 */
export interface Organization {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  is_active: boolean;
  max_users: number | null;
  max_documents: number | null;
  max_storage_gb: number | null;  
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  user_count?: number;
  document_count?: number;
  storage_used_gb?: number;
  admin_count?: number;
}

/**
 * Organization creation request
 */
export interface CreateOrganizationRequest {
  name: string;
  display_name: string;
  description?: string;
  max_users?: number;
  max_documents?: number;
  max_storage_mb?: number;
  settings?: Record<string, any>;
}

/**
 * Organization update request
 */
export interface UpdateOrganizationRequest {
  display_name?: string;
  description?: string;
  is_active?: boolean;
  max_users?: number;
  max_documents?: number;
  max_storage_gb?: number;
  settings?: Record<string, any>;
}

/**
 * Organization list response
 */
export interface OrganizationListResponse {
  total: number;
  organizations: Organization[];
}

/**
 * Organization details response (extended)
 */
export interface OrganizationDetails {
  organization: Organization;
  statistics: {
    total_users: number;
    total_admins: number;
    total_documents: number;
    max_storage_gb?: number;
    storage_limit_mb: number | null;
    storage_percentage: number | null;
  };
  recent_users: Array<{
    id: string;
    username: string;
    email: string;
    role: string;
    created_at: string;
  }>;
  admins: Array<{
    id: string;
    username: string;
    email: string;
    created_at: string;
  }>;
}

/**
 * Super admin statistics
 */
export interface SuperAdminStats {
  total_organizations: number;
  active_organizations: number;
  total_users: number;
  total_documents: number;
  total_storage_mb: number;
}

export interface CustomizationColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  background_secondary: string;
  background_tertiary: string;
  sidebar: string;
  text_primary: string;
  text_secondary: string;
  border: string;
  shadow: string;
}

export interface CustomizationButtons {
  primary_color: string;
  primary_text: string;
  secondary_color: string;
  secondary_text: string;
  border_radius: string;
}

export interface CustomizationInputs {
  border_color: string;
  focus_color: string;
  border_radius: string;
}

export interface CustomizationCards {
  background: string;
  border_color: string;
  border_radius: string;
  shadow: string;
}

export interface CustomizationNavigation {
  background: string;
  text_color: string;
  active_color: string;
  hover_color: string;
}

export interface CustomizationTypography {
  font_family: string | null;
  font_size_base: string;
  font_size_heading: string;
  font_weight_normal: string;
  font_weight_medium: string;
  font_weight_bold: string;
  line_height_base: string;
  line_height_heading: string;
  letter_spacing: string;
}

export interface CustomizationLayout {
  border_radius: string;
  spacing_unit: string;
  spacing_xs: string;
  spacing_sm: string;
  spacing_md: string;
  spacing_lg: string;
  spacing_xl: string;
}

export interface CustomizationAnimations {
  speed: string;
  enabled: boolean;
}

export interface CustomizationDarkMode {
  enabled: boolean;
  colors: Record<string, any>;
}

export interface CustomizationAdvanced {
  custom_css: string | null;
  custom_settings: Record<string, any>;
}

export interface CustomizationBranding {
  app_name: string | null;
  app_tagline: string | null;
  logo_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
}

export interface CustomizationMetadata {
  theme_name: string | null;
  theme_description: string | null;
  is_preset: boolean;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface Customization {
  id: string;
  organization_name: string;
  branding: CustomizationBranding;
  colors: CustomizationColors;
  buttons: CustomizationButtons;
  inputs: CustomizationInputs;
  cards: CustomizationCards;
  navigation: CustomizationNavigation;
  typography: CustomizationTypography;
  layout: CustomizationLayout;
  animations: CustomizationAnimations;
  dark_mode: CustomizationDarkMode;
  advanced: CustomizationAdvanced;
  metadata: CustomizationMetadata;
}

export interface CustomizationUpdateRequest {
  organization_name?: string;
  
  // Branding
  app_name?: string;
  app_tagline?: string;
  
  // Colors
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  success_color?: string;
  warning_color?: string;
  error_color?: string;
  info_color?: string;
  background_color?: string;
  background_secondary?: string;
  background_tertiary?: string;
  sidebar_color?: string;
  text_primary_color?: string;
  text_secondary_color?: string;
  border_color?: string;
  shadow_color?: string;
  
  // Buttons
  button_primary_color?: string;
  button_text_color?: string;
  button_secondary_color?: string;
  button_secondary_text?: string;
  button_border_radius?: string;
  
  // Inputs
  input_border_color?: string;
  input_focus_color?: string;
  input_border_radius?: string;
  
  // Cards
  card_background?: string;
  card_border_color?: string;
  card_border_radius?: string;
  card_shadow?: string;
  
  // Navigation
  nav_background?: string;
  nav_text_color?: string;
  nav_active_color?: string;
  nav_hover_color?: string;
  
  // Typography
  font_family?: string;
  font_size_base?: string;
  font_size_heading?: string;
  font_weight_normal?: string;
  font_weight_medium?: string;
  font_weight_bold?: string;
  line_height_base?: string;
  line_height_heading?: string;
  letter_spacing?: string;
  
  // Layout
  border_radius?: string;
  spacing_unit?: string;
  spacing_xs?: string;
  spacing_sm?: string;
  spacing_md?: string;
  spacing_lg?: string;
  spacing_xl?: string;
  
  // Animations
  animation_speed?: string;
  enable_animations?: boolean;
  
  // Dark Mode
  dark_mode_enabled?: boolean;
  dark_mode_colors?: {
    background?: string;
    background_secondary?: string;
    background_tertiary?: string;
    text_primary?: string;
    text_secondary?: string;
    border?: string;
    shadow?: string;
  };
  
  // Advanced
  custom_css?: string;
  custom_settings?: Record<string, any>;
  
  // Metadata
  theme_name?: string;
  theme_description?: string;
}

export interface ThemePreset {
  name: string;
  description: string;
  colors: Record<string, string>;
  components: Record<string, string>;
  preview_image?: string;
}

// ==========================================
// User & Authentication Types
// ==========================================

/**
 * Standard User interface
 * Matches backend User model (app/models/user.py)
 * Used for current authenticated user
 */
export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string; // "user" | "org_admin" | "super_admin"
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login: string | null;
  preferences: Record<string, any>;
  metadata: Record<string, any>;
  organization_id: string | null;
  organization?: {
    id: string;
    name: string;
    display_name: string;
  };
}

/**
 * Admin User interface (extended with admin-specific fields)
 * Used in admin panels for user management
 * Extends the base User interface with additional admin data
 */
export interface AdminUser extends User {
  document_count: number;
}

/**
 * Login response from /auth/login endpoint
 */
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user: User;
}

/**
 * Registration response from /auth/register endpoint
 */
export interface RegisterResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user: User;
}

/**
 * Profile update request for /auth/profile endpoint
 * Only includes fields that can be updated by the user
 */
export interface ProfileUpdateRequest {
  full_name?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Password change request
 */
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

/**
 * Forgot password request
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset password request
 */
export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

/**
 * Email verification request
 */
export interface VerifyEmailRequest {
  token: string;
}

// ==========================================
// Document & Chat Types (from api.ts - for reference)
// ==========================================

/**
 * Chat message in a conversation
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  metadata?: {
    sources?: Source[];
    confidence?: string;
    citations?: any[];
    error?: boolean;
    reformulated_query?: string;
  };
}

/**
 * Source reference from RAG retrieval
 */
export interface Source {
  document: string;
  page: number | null;
  section: string | null;
  chunk_id: string;
}

/**
 * Document metadata
 */
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

/**
 * Conversation with messages
 */
export interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
  metadata: any;
}

/**
 * Chunk data for document editing
 */
export interface ChunkData {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  chunk_type: string;
  page_numbers: number[];
  section_title: string | null;
  token_count: number;
  title: string | null;
  is_edited: boolean;
  edited_at: string | null;
  edited_by: string | null;
  edit_count: number;
  metadata: any;
}

/**
 * Document detailed information
 */
export interface DocumentInfo {
  id: string;
  filename: string;
  original_filename: string;
  file_size_mb: number;
  doc_type: string;
  department: string | null;
  total_pages: number;
  total_chunks: number;
  has_tables: boolean;
  has_images: boolean;
  status: string;
  upload_date: string;
  processed_date: string | null;
  mime_type: string;
  preview_type: string;
  is_previewable: boolean;
}

/**
 * Edit history item for chunks
 */
export interface EditHistoryItem {
  id: string;
  edited_at: string;
  edited_by: string;
  old_content: string;
  new_content: string;
  change_summary: string | null;
  metadata: any;
}

/**
 * Statistics for document edits
 */
export interface DocumentEditStats {
  total_chunks: number;
  edited_chunks: number;
  unedited_chunks: number;
  total_edits: number;
  edit_percentage: number;
}

/**
 * User statistics for admin dashboard
 */
export interface UserStats {
  total_users: number;
  active_users: number;
  admin_users: number;
  regular_users: number;
  verified_users: number;
}

/**
 * System statistics for admin dashboard
 */
export interface SystemStats {
  total_users: number;
  total_documents: number;
  total_chunks: number;
  active_sessions: number;
  storage_used_mb: number;
}

/**
 * Token usage statistics for conversations
 */
export interface TokenStats {
  conversation_id: string;
  summary: {
    total_messages: number;
    total_tokens: number;
    cached_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
    cache_efficiency_percent: number;
    total_cost_usd: number;
    avg_tokens_per_message: number;
    avg_cost_per_message: number;
  };
  messages: MessageTokenStat[];
  pricing_info: {
    model: string;
    cached_token_price: number;
    regular_token_price: number;
    currency: string;
  };
}

/**
 * Token statistics for individual messages
 */
export interface MessageTokenStat {
  message_id: string;
  timestamp: string;
  tokens: {
    total: number;
    cached: number;
    prompt: number;
    completion: number;
  };
  cost_usd: number;
}

/**
 * Chat request payload
 */
export interface ChatRequest {
  query: string;
  conversation_id?: string | null;
  doc_type?: string;
  department?: string;
  stream?: boolean;
}

/**
 * Chat response from backend
 */
export interface ChatResponse {
  answer: string;
  conversation_id: string;
  sources: Source[];
  citations: any[];
  confidence: string;
  status: string;
  suggestions?: string[];
  metadata: {
    chunks_used?: number;
    tokens?: any;
    searched_documents?: boolean;
    retrieval_metadata?: any;
    context_summary?: {
      primary_document?: string;
      active_documents?: string[];
      recent_time_period?: string;
      message_count?: number;
      last_intent?: string;
    };
    query_reformulated?: boolean;
  };
}