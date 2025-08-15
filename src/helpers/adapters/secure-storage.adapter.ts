export const SecureStorageAdapter = {
  async setItem(key: string, value: string): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },

  async getItem(key: string): Promise<string | null> {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },

  async deleteItem(key: string): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },

  async setItems(key: string, value: string): Promise<void> {
    return this.setItem(key, value);
  },
};
