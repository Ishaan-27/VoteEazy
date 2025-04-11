import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  supabase: SupabaseClient;
  signIn: (identifier: string, password: string, method: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

// Create the Supabase client with retryAttempts and timeout options
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'Content-Type': 'application/json'
      }
    },
    // Add retry logic for failed requests
    db: {
      schema: 'public'
    }
  }
);

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabase,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const validateAadhar = (aadhar: string): boolean => {
    const aadharRegex = /^[0-9]{12}$/;
    return aadharRegex.test(aadhar);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const signIn = async (identifier: string, password: string, method: string) => {
    try {
      // Validate identifier based on method
      switch (method) {
        case 'email':
          if (!validateEmail(identifier)) {
            toast.error('Please enter a valid email address');
            return;
          }
          break;
        case 'mobile':
          if (!validateMobile(identifier)) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
          }
          break;
        case 'aadhar':
          if (!validateAadhar(identifier)) {
            toast.error('Please enter a valid 12-digit Aadhar number');
            return;
          }
          break;
      }

      if (!validatePassword(password)) {
        toast.error('Password must be at least 6 characters long');
        return;
      }

      let email = identifier;
      
      if (method !== 'email') {
        try {
          // First try to find the user in the profiles table
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id')
            .eq(method === 'mobile' ? 'mobile_number' : 'aadhar_number', identifier)
            .maybeSingle();

          if (userError) {
            console.error('Error finding user:', userError);
            toast.error('An error occurred while finding your account');
            return;
          }

          if (!userData) {
            toast.error(`No account found with this ${method === 'mobile' ? 'mobile number' : 'Aadhar number'}`);
            return;
          }

          // Now get the email from auth.users using the profile id
          const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userData.id);

          if (authError || !authUser?.user) {
            console.error('Error getting auth user:', authError);
            toast.error('Could not find your account details');
            return;
          }

          email = authUser.user.email;
        } catch (error) {
          console.error('Error in profile lookup:', error);
          toast.error('An error occurred while looking up your account');
          return;
        }
      }

      try {
        const { error: signInError, data } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          if (signInError.message === 'Email not confirmed') {
            toast.error('Please check your email and confirm your account before signing in');
          } else if (signInError.message === 'Invalid login credentials') {
            toast.error('Invalid credentials');
          } else {
            console.error('Sign in error:', signInError);
            toast.error(signInError.message);
          }
          return;
        }

        if (!data.user?.email_confirmed_at) {
          toast.error('Please check your email and confirm your account before signing in');
          await supabase.auth.signOut();
          return;
        }

        toast.success('Signed in successfully');
      } catch (error) {
        console.error('Error in sign in request:', error);
        toast.error('Failed to connect to authentication service. Please try again.');
        return;
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      if (!validateEmail(email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      if (!validatePassword(password)) {
        toast.error('Password must be at least 6 characters long');
        return;
      }

      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        toast.error(error.message);
        return;
      }

      toast.success('Please check your email to confirm your account');
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to create account. Please try again.');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Failed to sign out');
        return;
      }
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, supabase, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};