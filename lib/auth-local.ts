// lib/auth-local.ts
// This is a localStorage-based authentication system to replace Supabase

import { User } from './types';

// Simulated database of users (in a real app, this would be a server API)
interface StoredUser extends User {
  password: string;
}

// Initialize default users if none exist
function initializeDefaultUsers(): Record<string, StoredUser> {
  const defaultUsers: Record<string, StoredUser> = {
    "admin_1": {
      id: "admin_1",
      email: "admin@qhereayem.com",
      password: "admin123",
      name: "Admin QhereAyem",
      role: "admin",
      avatar: "/placeholder-user.jpg",
    },
    "user_1": {
      id: "user_1",
      email: "user@qhereayem.com",
      password: "user123",
      name: "User Demo",
      role: "customer",
      avatar: "/placeholder-user.jpg",
    }
  };
  
  saveStoredUsers(defaultUsers);
  return defaultUsers;
}

// Helper function to get users from localStorage
function getStoredUsers(): Record<string, StoredUser> {
  if (typeof window === 'undefined') return {};
  
  const usersJson = localStorage.getItem('mountain_gear_users');
  if (!usersJson) {
    // Initialize default users if none exist
    return initializeDefaultUsers();
  }
  
  try {
    const users = JSON.parse(usersJson);
    // If the user object is empty, initialize with default users
    if (Object.keys(users).length === 0) {
      return initializeDefaultUsers();
    }
    return users;
  } catch (e) {
    console.error('Failed to parse users from localStorage', e);
    return initializeDefaultUsers();
  }
}

// Helper function to save users to localStorage
function saveStoredUsers(users: Record<string, StoredUser>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mountain_gear_users', JSON.stringify(users));
}

// Helper to get the current user
function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userJson = localStorage.getItem('mountain_gear_currentUser');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (e) {
    console.error('Failed to parse current user from localStorage', e);
    return null;
  }
}

// Helper to set the current user
function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  
  if (user) {
    localStorage.setItem('mountain_gear_currentUser', JSON.stringify(user));
    // Also store the user role in a separate key for simpler access
    localStorage.setItem('userRole', user.role);
  } else {
    localStorage.removeItem('mountain_gear_currentUser');
    localStorage.removeItem('userRole');
  }
}

// Authentication service
export const auth = {
  // Reset authentication system (useful for debugging)
  resetAuth: async (): Promise<void> => {
    // Clear current user
    setCurrentUser(null);
    
    // Reset users to default
    initializeDefaultUsers();
    
    console.log('Auth system reset with default users');
  },
  // Get the current user
  getUser: async (): Promise<User | null> => {
    return getCurrentUser();
  },
  
  // Sign in with email and password
  signInWithEmail: async (email: string, password: string): Promise<{ user: User | null; error: any }> => {
    try {
      const users = getStoredUsers();
      
      // Find user by email
      const userEntry = Object.entries(users).find(([_, user]) => user.email === email);
      
      if (!userEntry || userEntry[1].password !== password) {
        return { 
          user: null, 
          error: { message: 'Invalid email or password' }
        };
      }
      
      const user: User = {
        id: userEntry[0],
        email: userEntry[1].email,
        name: userEntry[1].name,
        role: userEntry[1].role,
        avatar: userEntry[1].avatar
      };
      
      // Set as current user
      setCurrentUser(user);
      
      return { user, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { user: null, error };
    }
  },
  
  // Sign up with email and password
  signUpWithEmail: async (email: string, password: string, name: string): Promise<{ user: User | null; error: any }> => {
    try {
      const users = getStoredUsers();
      
      // Check if email already exists
      if (Object.values(users).some(user => user.email === email)) {
        return { 
          user: null, 
          error: { message: 'User already registered' }
        };
      }
      
      // Generate a unique ID
      const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create the new user
      const newUser: StoredUser = {
        id,
        email,
        name,
        role: 'customer',
        password,
        avatar: null
      };
      
      // Save to "database"
      users[id] = newUser;
      saveStoredUsers(users);
      
      // Set as current user (without password)
      const userForSession: User = {
        id,
        email,
        name,
        role: 'customer',
        avatar: null
      };
      
      setCurrentUser(userForSession);
      
      return { user: userForSession, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { user: null, error };
    }
  },
  
  // Sign out
  signOut: async (): Promise<{ error: any }> => {
    try {
      setCurrentUser(null);
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error };
    }
  },
  
  // Generate default admin user if none exists
  initDefaultAdmin: () => {
    if (typeof window === 'undefined') return;
    
    const users = getStoredUsers();
    
    // If no admin exists, create one
    if (!Object.values(users).some(user => user.role === 'admin')) {
      const adminId = 'admin_default';
      users[adminId] = {
        id: adminId,
        email: 'admin@example.com',
        name: 'Admin',
        role: 'admin',
        password: 'admin123', // In a real app, use a more secure default
        avatar: null
      };
      
      saveStoredUsers(users);
      console.log('Created default admin user');
    }
  }
};

// Initialize the default admin on load
if (typeof window !== 'undefined') {
  // Wait for window to be ready
  setTimeout(() => {
    auth.initDefaultAdmin();
  }, 100);
}

export default auth;
