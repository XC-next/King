import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User } from '@/types'
import toast from 'react-hot-toast'

interface AuthContextType {
  currentUser: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (data: Partial<User>) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithFacebook: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  const createUserDocument = async (firebaseUser: FirebaseUser, additionalData?: any) => {
    if (!firebaseUser) return

    const userRef = doc(db, 'users', firebaseUser.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = firebaseUser
      const userData: Omit<User, 'uid'> = {
        email: email!,
        displayName: displayName || '',
        photoURL: photoURL || '',
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...additionalData
      }

      try {
        await setDoc(userRef, userData)
      } catch (error) {
        console.error('Error creating user document:', error)
        throw error
      }
    }

    return getUserDocument(firebaseUser.uid)
  }

  const getUserDocument = async (uid: string): Promise<User | null> => {
    try {
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        return { uid, ...userSnap.data() } as User
      }
      return null
    } catch (error) {
      console.error('Error getting user document:', error)
      return null
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const user = await createUserDocument(result.user)
      setCurrentUser(user)
      toast.success('Successfully logged in!')
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Failed to log in')
      throw error
    }
  }

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })
      const user = await createUserDocument(result.user, { displayName })
      setCurrentUser(user)
      toast.success('Account created successfully!')
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Failed to create account')
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setCurrentUser(null)
      setFirebaseUser(null)
      toast.success('Successfully logged out!')
    } catch (error: any) {
      console.error('Logout error:', error)
      toast.error('Failed to log out')
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Password reset email sent!')
    } catch (error: any) {
      console.error('Password reset error:', error)
      toast.error(error.message || 'Failed to send password reset email')
      throw error
    }
  }

  const updateUserProfile = async (data: Partial<User>) => {
    if (!currentUser) throw new Error('No user logged in')

    try {
      const userRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date()
      })
      
      setCurrentUser(prev => prev ? { ...prev, ...data, updatedAt: new Date() } : null)
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile')
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = await createUserDocument(result.user)
      setCurrentUser(user)
      toast.success('Successfully logged in with Google!')
    } catch (error: any) {
      console.error('Google login error:', error)
      toast.error('Failed to log in with Google')
      throw error
    }
  }

  const loginWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = await createUserDocument(result.user)
      setCurrentUser(user)
      toast.success('Successfully logged in with Facebook!')
    } catch (error: any) {
      console.error('Facebook login error:', error)
      toast.error('Failed to log in with Facebook')
      throw error
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true)
      setFirebaseUser(firebaseUser)
      
      if (firebaseUser) {
        const user = await getUserDocument(firebaseUser.uid)
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    loginWithGoogle,
    loginWithFacebook
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}