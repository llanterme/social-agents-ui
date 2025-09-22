// Safe localStorage wrapper with error handling and debugging
export class SafeStorage {
  private static isAvailable(): boolean {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.error('localStorage is not available:', e);
      return false;
    }
  }

  static setItem(key: string, value: string): boolean {
    try {
      if (!this.isAvailable()) {
        console.error('localStorage not available');
        return false;
      }

      // Clear any corrupted data first
      try {
        const existing = localStorage.getItem(key);
        if (existing !== null) {
          console.log(`Clearing existing value for ${key}`);
          localStorage.removeItem(key);
        }
      } catch (e) {
        console.error(`Error clearing ${key}:`, e);
      }

      // Now set the new value
      localStorage.setItem(key, value);

      // Verify it was stored
      const stored = localStorage.getItem(key);
      if (stored !== value) {
        console.error(`Failed to verify storage of ${key}`);
        return false;
      }

      console.log(`Successfully stored ${key} (length: ${value.length})`);
      return true;
    } catch (e) {
      console.error(`Error storing ${key}:`, e);
      return false;
    }
  }

  static getItem(key: string): string | null {
    try {
      if (!this.isAvailable()) {
        return null;
      }
      const value = localStorage.getItem(key);
      if (value !== null) {
        console.log(`Retrieved ${key} from storage (length: ${value.length})`);
      }
      return value;
    } catch (e) {
      console.error(`Error retrieving ${key}:`, e);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      if (!this.isAvailable()) {
        return;
      }
      localStorage.removeItem(key);
      console.log(`Removed ${key} from storage`);
    } catch (e) {
      console.error(`Error removing ${key}:`, e);
    }
  }

  static clear(): void {
    try {
      if (!this.isAvailable()) {
        return;
      }
      localStorage.clear();
      console.log('Cleared all localStorage');
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  }

  // Debug function to check localStorage state
  static debug(): void {
    console.group('localStorage Debug Info');
    try {
      console.log('localStorage available:', this.isAvailable());
      console.log('localStorage length:', localStorage.length);
      console.log('localStorage keys:', Object.keys(localStorage));

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          console.log(`${key}:`, value ? value.substring(0, 50) + '...' : 'null');
        }
      }
    } catch (e) {
      console.error('Error during debug:', e);
    }
    console.groupEnd();
  }
}

// Make debug available globally for testing
if (typeof window !== 'undefined') {
  (window as any).debugStorage = () => SafeStorage.debug();
}