import {
  AuthTokens,
  User,
  RegisterRequest,
  LoginRequest,
  ApiError,
} from './types';
import { formatError, isTokenExpired, getTokenExpiration } from './utils';
import { SafeStorage } from './storage';

class AuthService {
  private baseUrl: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    if (typeof window === 'undefined') return;

    console.log('AuthService: Initializing from storage...');
    SafeStorage.debug(); // Debug current storage state

    try {
      const storedAccessToken = SafeStorage.getItem('accessToken');
      const storedRefreshToken = SafeStorage.getItem('refreshToken');

      if (storedAccessToken && storedRefreshToken) {
        this.accessToken = storedAccessToken;
        this.refreshToken = storedRefreshToken;
        console.log('AuthService: Initialized with stored tokens');
      } else {
        console.log('AuthService: No stored tokens found');
      }
    } catch (error) {
      console.error('Failed to initialize from storage:', error);
      this.clearTokens();
    }
  }

  // Public method to force re-initialization
  reinitialize(): void {
    console.log('AuthService: Forcing re-initialization...');
    this.initializeFromStorage();
  }

  async register(request: RegisterRequest): Promise<AuthTokens> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const tokens: AuthTokens = data;
      this.setTokens(tokens);
      return tokens;
    } catch (error) {
      throw new Error(formatError(error));
    }
  }

  async login(request: LoginRequest): Promise<AuthTokens> {
    try {
      console.log('AuthService: Starting login...');
      const response = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const tokens: AuthTokens = data;
      console.log('AuthService: Login successful, setting tokens...');
      this.setTokens(tokens);
      console.log('AuthService: Tokens set, accessToken present:', !!this.accessToken);
      console.log('AuthService: isAuthenticated after login:', this.isAuthenticated());
      return tokens;
    } catch (error) {
      throw new Error(formatError(error));
    }
  }

  async logout(): Promise<void> {
    this.clearTokens();
    // Note: Backend doesn't have a logout endpoint, tokens will expire naturally
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.authenticatedRequest('/api/v1/auth/me');

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Failed to get current user:', response.status, errorData);
      throw new Error(errorData?.message || `Failed to get current user: ${response.status}`);
    }

    const userData = await response.json();
    console.log('Got user data:', userData);
    return userData;
  }

  async authenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    console.log('AuthService: Making authenticated request to:', endpoint);
    console.log('AuthService: Current accessToken present:', !!this.accessToken);

    // Ensure we have a valid access token
    await this.ensureValidToken();

    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const url = `${this.baseUrl}${endpoint}`;
    console.log('AuthService: Full URL:', url);
    console.log('AuthService: Authorization header being sent');

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log('AuthService: Response status:', response.status);

    // If we get a 401 and we haven't already tried to refresh, attempt refresh
    if (response.status === 401 && this.refreshToken) {
      try {
        await this.refreshAccessToken();
        // Retry the original request with the new token
        return this.authenticatedRequest(endpoint, options);
      } catch (refreshError) {
        // Refresh failed, clear tokens and throw error
        this.clearTokens();
        throw new Error('Authentication failed');
      }
    }

    return response;
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken || !this.refreshToken) {
      throw new Error('Not authenticated');
    }

    // Check if token is expired or will expire soon (5 minutes buffer)
    const expirationTime = getTokenExpiration(this.accessToken);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (expirationTime && expirationTime - now < fiveMinutes) {
      await this.refreshAccessToken();
    }
  }

  private async refreshAccessToken(): Promise<AuthTokens> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshPromise = this.performRefresh();

    try {
      const tokens = await this.refreshPromise;
      return tokens;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<AuthTokens> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.refreshToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      const tokens: AuthTokens = data;
      this.setTokens(tokens);
      return tokens;
    } catch (error) {
      this.clearTokens();
      throw new Error(formatError(error));
    }
  }

  private setTokens(tokens: AuthTokens): void {
    console.log('AuthService: setTokens called with tokens');
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;

    if (typeof window !== 'undefined') {
      console.log('AuthService: Attempting to store tokens...');

      // Debug current storage state before storing
      SafeStorage.debug();

      const accessStored = SafeStorage.setItem('accessToken', tokens.accessToken);
      const refreshStored = SafeStorage.setItem('refreshToken', tokens.refreshToken);

      if (accessStored && refreshStored) {
        console.log('AuthService: ✅ Tokens successfully stored');
      } else {
        console.error('AuthService: ❌ Failed to store tokens properly');
      }

      // Debug storage state after storing
      SafeStorage.debug();
    }
  }

  private clearTokens(): void {
    console.log('AuthService: Clearing tokens...');
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof window !== 'undefined') {
      SafeStorage.removeItem('accessToken');
      SafeStorage.removeItem('refreshToken');
      SafeStorage.debug(); // Show state after clearing
    }
  }

  isAuthenticated(): boolean {
    if (!this.accessToken || !this.refreshToken) {
      return false;
    }

    // Check if refresh token is still valid
    if (isTokenExpired(this.refreshToken)) {
      this.clearTokens();
      return false;
    }

    return true;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }
}

// Create a singleton instance
export const authService = new AuthService();
export default AuthService;