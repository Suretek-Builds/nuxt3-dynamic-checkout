// utils/storage.ts

const storage = {
  // Set item in session storage
  setSessionItem(key: string, value: any): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  },

  // Get item from session storage
  getSessionItem<T>(key: string): T | null {
    if (typeof window !== "undefined") {
      const value = sessionStorage.getItem(key);
      return value != 'undefined' ? JSON.parse(value!) : null;
    }
    return null; // For server-side rendering
  },

  // Remove item from session storage
  removeSessionItem(key: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(key);
    }
  },

  // Clear all session storage
  clearSession(): void {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }
  },

  // Set item in local storage
  setLocalItem(key: string, value: any): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  // Get item from local storage
  getLocalItem<T>(key: string): T | null {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem(key);
      return value !== 'undefined' ? JSON.parse(value!) : null;
    }
    return null; // For server-side rendering
  },

  // Remove item from local storage
  removeLocalItem(key: string): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },

  // Clear all local storage
  clearLocal(): void {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }
};

export default storage;
