import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from "../lib/supabase";

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const loadSession = async () => {
      const savedSession = await AsyncStorage.getItem('supabase.auth.token');
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        supabase.auth.setSession(parsedSession); // Ensure Supabase knows about the session
        setSession(parsedSession);
      }
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (newSession) {
          setSession(newSession);
          await AsyncStorage.setItem('supabase.auth.token', JSON.stringify(newSession));
        } else {
          await AsyncStorage.removeItem('supabase.auth.token');
          setSession(null);
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
