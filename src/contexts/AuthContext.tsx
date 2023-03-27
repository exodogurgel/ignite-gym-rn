import { createContext, ReactNode, useEffect, useState } from "react"

import { UserDTO } from "@dtos/UserDTO"
import { api } from "@services/axios"
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser"

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  isLoadingUserStorageData: boolean
  signOut: () => Promise<void>
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({children}: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setLoadingUserStorageData] = useState(true)

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password })
      
      if (data.user) {
        setUser(data.user)
        storageUserSave(data.user)
      }

    } catch (error) {
      throw error
    }
  }

  async function signOut() {
    try {
      setLoadingUserStorageData(true)

      setUser({} as UserDTO)
      await storageUserRemove()

    } catch (error) {
      throw error
    } finally {
      setLoadingUserStorageData(false)
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet()

      if (userLogged) {
        setUser(userLogged)
      }
    } catch (error) {
      throw error
    } finally {
      setLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider value={{ user, signIn, isLoadingUserStorageData, signOut }}>
      {children}
    </AuthContext.Provider>
  )
} 