// Simulating a secure backend auth service
const ADMIN_CREDS = {
  email: 'carsmagnum583@gmail.com',
  password: 'Magnum@123'
};

export const adminAuth = {
  login: (email: string, pass: string) => {
    if (email === ADMIN_CREDS.email && pass === ADMIN_CREDS.password) {
      const token = btoa(JSON.stringify({ role: 'admin', email, exp: Date.now() + 86400000 }));
      localStorage.setItem('magnum_admin_token', token);
      return { success: true, token };
    }
    return { success: false, error: 'Invalid Credentials' };
  },
  
  logout: () => {
    localStorage.removeItem('magnum_admin_token');
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem('magnum_admin_token');
    if (!token) return false;
    try {
      const decoded = JSON.parse(atob(token));
      return decoded.email === ADMIN_CREDS.email && decoded.exp > Date.now();
    } catch {
      return false;
    }
  }
};
