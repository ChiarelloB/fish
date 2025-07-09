import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile } from '../types/game';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile
      const newUserProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        username,
        algas: 500,
        createdAt: new Date()
      };
      
      await setDoc(doc(db, 'users', user.uid), newUserProfile);
      
      // Add starting inventory
      const startingInventory = [
        { id: '1', name: 'Vara Básica', type: 'rod', quantity: 1, image: '🎣', description: 'Vara de pescar básica' },
        { id: '2', name: 'Ovos Básicos', type: 'egg', quantity: 3, image: '🥚', description: 'Ovos básicos para incubação' },
        { id: '3', name: 'Algas Comuns', type: 'food', quantity: 5, image: '🌿', description: 'Alimento básico para peixes' }
      ];
      
      for (const item of startingInventory) {
        await setDoc(doc(db, 'users', user.uid, 'inventory', item.id), item);
      }
      
      toast.success('Conta criada com sucesso! Bônus de novo usuário adicionado!');
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer logout.');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Email de recuperação enviado!');
    } catch (error) {
      toast.error('Erro ao enviar email de recuperação.');
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};