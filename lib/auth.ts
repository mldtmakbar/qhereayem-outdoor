import { supabase } from './supabase';
import { User } from './types';

// Supabase authentication service
export const auth = {
  // Sign in with Google
  signInWithGoogle: async (): Promise<{ user: User | null; error: any }> => {
    try {
      console.log('Initiating Google OAuth sign-in flow');
      
      // Start the OAuth flow with Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline', // Get refresh token
            prompt: 'consent' // Force consent screen to ensure we get refresh token
          }
        }
      });
      
      if (error) {
        console.error('Google login error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          code: error.code
        });
        return { user: null, error };
      }

      console.log('Google OAuth initiated successfully, redirecting user...');
      
      // The auth callback will handle the actual sign-in after redirect
      return { user: null, error: null };
    } catch (error: any) {
      console.error('Unexpected Google login error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      return { user: null, error };
    }
  },

  // Check auth state and get user profile
  getUser: async (): Promise<User | null> => {
    try {
      // First, get the authenticated user from Supabase
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) return null;
      
      // Then, get the user profile from our users table
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authUser.id)
        .single();
      
      if (error || !profile) {
        console.error('Error getting user profile:', error);
        return null;
      }
      
      // Convert from database format to our User type
      const user: User = {
        id: profile.id,
        name: profile.name || authUser.user_metadata?.full_name || 'User',
        email: profile.email || authUser.email || '',
        role: profile.role || 'customer',
        avatar: profile.avatar || authUser.user_metadata?.avatar_url || '',
        phone: profile.phone || '',
        address: profile.address || '',
        createdAt: new Date(profile.created_at),
        googleId: authUser.app_metadata?.provider === 'google' ? authUser.id : undefined,
        joinDate: new Date(profile.created_at)
      };
      
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },
  
  // Sign out
  signOut: async (): Promise<{ error: any }> => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  // Sign in with email and password
  signInWithEmail: async (email: string, password: string): Promise<{ user: User | null; error: any }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) return { user: null, error };
      if (!data || !data.user) return { user: null, error: new Error('No user data returned from login') };
      
      // Get user profile from our database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', data.user.id)
        .single();
      
      if (profileError || !profile) {
        console.error('Error getting user profile after login:', profileError);
        return { user: null, error: profileError || new Error('User profile not found') };
      }
      
      const user: User = {
        id: profile.id,
        name: profile.name || data.user.user_metadata?.full_name || 'User',
        email: profile.email || data.user.email || '',
        role: profile.role || 'customer',
        avatar: profile.avatar || data.user.user_metadata?.avatar_url || '',
        phone: profile.phone || '',
        address: profile.address || '',
        createdAt: new Date(profile.created_at),
        googleId: data.user.app_metadata?.provider === 'google' ? data.user.id : undefined,
        joinDate: new Date(profile.created_at)
      };
      
      return { user, error: null };
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      return { user: null, error };
    }
  },

  // Sign up with email and password
  signUpWithEmail: async (email: string, password: string, name: string): Promise<{ user: User | null; error: any }> => {
    // Define data variable outside try/catch so it's available in catch block
    let userData: any = null;
    
    try {
      // Step 1: Log the attempt with details (for debugging)
      console.log('Attempting to sign up user:', { email, name });
      
      // Step 2: Use signUp with improved error handling
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            name: name, // Add name as well, for better compatibility
            user_name: name, // Add user_name for better compatibility
            provider: 'email', // Explicitly set the provider
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      
      // Save data for potential use in catch block
      userData = data;
      
      // Step 3: Enhanced error handling
      if (error) {
        console.error('Signup error from Supabase:', error);
        
        // Log more details about the error
        if (error.message) console.error('Error message:', error.message);
        if (error.status) console.error('Error status:', error.status);
        
        return { user: null, error };
      }
      
      // Step 4: Check if user was created at all
      if (!data || !data.user) {
        console.error('No user data returned from signup');
        return { user: null, error: new Error('No user data returned from signup') };
      }
      
      // Save user data for potential use in catch block
      userData = data;
      
      // Step 5: Log successful registration
      console.log('User registered successfully, auth data:', { 
        id: data.user.id,
        email_confirmed: !!data.user.email_confirmed_at,
        provider: 'email' // Explicitly note this is email signup
      });
      
      // Step 6: Manually create a user profile if needed - with improved error handling
      try {
        console.log('Checking and ensuring user profile exists');
        
        // Wait a moment to give the trigger a chance to complete
        await new Promise(resolve => setTimeout(resolve, 500)); // Longer timeout for more reliability
        
        // Check if profile was created by trigger
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', data.user.id)
          .maybeSingle();
          
        if (fetchError) {
          console.error('Error checking for existing user profile:', fetchError);
        }
        
        // If no profile exists yet, try to create one manually
        if (!existingUser && !fetchError) {
          console.log('No user profile found, creating manually as fallback');
          
          // Generate a UUID for the user
          const userId = crypto.randomUUID();
          
          // Try with all fields first
          try {
            console.log('Attempting full profile creation');
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: userId,
                auth_id: data.user.id,
                name: name,
                email: email,
                role: 'customer',
                join_date: new Date(),
                created_at: new Date(),
                updated_at: new Date()
              });
              
            if (insertError) {
              console.error('Error creating full user profile:', insertError);
              throw insertError; // Force fall through to minimal version
            } else {
              console.log('Full profile creation successful with ID:', userId);
            }
          } catch (fullProfileError) {
            console.log('Falling back to minimal profile creation');
            
            // Try with minimal fields as fallback
            try {
              const { error: minimalError } = await supabase
                .from('users')
                .insert({
                  id: userId,
                  auth_id: data.user.id,
                  role: 'customer'
                });
                
              if (minimalError) {
                console.error('Error creating minimal user profile:', minimalError);
                console.error('Error details:', JSON.stringify(minimalError));
              } else {
                console.log('Minimal profile creation successful with ID:', userId);
              }
            } catch (minimalProfileError) {
              console.error('All profile creation attempts failed:', minimalProfileError);
            }
          }
        }
      } catch (profileError) {
        console.error('Error in manual profile creation:', profileError);
      }
      
      return { user: null, error: null };
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      
      // Log more detailed error information
      console.error('Signup error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        status: error.status
      });
      
      // Check if the error relates to the user creation trigger but the auth record was created
      if (error.message?.includes('Database error saving new user') && userData?.user?.id) {
        console.log('Auth record was created but user profile creation failed. Returning partial success.');
        return { 
          user: { id: userData.user.id, email: userData.user.email } as any, 
          error: { message: 'Account created but profile setup incomplete. Please contact support.' } 
        };
      }
      
      return { user: null, error };
    }
  },

  // Handle OAuth callback and ensure user profile is created
  handleAuthCallback: async (): Promise<{ user: User | null; error: any }> => {
    try {
      console.log('Handling auth callback...');
      
      // Get the current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error retrieving session:', sessionError);
        return { user: null, error: sessionError };
      }
      
      if (!sessionData.session?.user) {
        console.log('No active session found');
        return { user: null, error: null };
      }
      
      const authUser = sessionData.session.user;
      console.log('User authenticated:', { 
        id: authUser.id, 
        email: authUser.email,
        provider: authUser.app_metadata?.provider
      });
      
      // Check if user profile exists
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authUser.id)
        .maybeSingle();
      
      if (profileError) {
        console.error('Error checking for user profile:', profileError);
      }
      
      // If profile doesn't exist, create it
      if (!userProfile && !profileError) {
        console.log('No user profile found, creating one...');
        
        // Generate UUID for the user
        const userId = crypto.randomUUID();
        
        // Extract user information from metadata
        const name = authUser.user_metadata?.full_name || 
                    authUser.user_metadata?.name || 
                    'User';
                    
        const avatar = authUser.user_metadata?.avatar_url || 
                      authUser.user_metadata?.picture ||
                      '';
        
        // Try to create profile with full details
        try {
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: userId,
              auth_id: authUser.id,
              name,
              email: authUser.email || '',
              role: 'customer',
              avatar,
              google_id: authUser.app_metadata?.provider === 'google' ? authUser.id : null,
              join_date: new Date(),
              created_at: new Date(),
              updated_at: new Date()
            });
            
          if (insertError) {
            console.error('Error creating user profile during callback:', insertError);
            throw insertError; // Try fallback
          } else {
            console.log('Successfully created profile with ID:', userId);
          }
        } catch (error) {
          // Fallback to minimal profile
          console.log('Attempting minimal profile creation as fallback');
          try {
            const { error: fallbackError } = await supabase
              .from('users')
              .insert({
                id: userId,
                auth_id: authUser.id,
                role: 'customer'
              });
              
            if (fallbackError) {
              console.error('Failed to create even minimal profile:', fallbackError);
            } else {
              console.log('Created minimal profile with ID:', userId);
            }
          } catch (fallbackError) {
            console.error('All profile creation attempts failed:', fallbackError);
          }
        }
      }
      
      // Fetch the user (whether existing or newly created)
      return await auth.getUser()
        .then(user => ({ user, error: null }))
        .catch(error => {
          console.error('Error getting user after auth callback:', error);
          return { user: null, error }; 
        });
    } catch (error: any) {
      console.error('Error in auth callback handler:', error);
      return { user: null, error };
    }
  }
};
