const TOKEN_KEY = "Sufra_token";
const storage = typeof window !== "undefined" ? window.localStorage : null;

export const tokenService = {
  save(token) {
    if (!storage) return;

    storage.setItem(TOKEN_KEY, token);
  },

  get() {
    if (!storage) return null;

    return storage.getItem(TOKEN_KEY);
  },

  remove() {
    if (!storage) return;

    storage.removeItem(TOKEN_KEY);
  },

  exists() {
    return !!this.get();
  },
};

export default tokenService;
