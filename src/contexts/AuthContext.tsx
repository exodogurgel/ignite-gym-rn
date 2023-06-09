import { createContext, ReactNode, useEffect, useState } from "react"

import { UserDTO } from "@dtos/UserDTO"
import { api } from "@services/axios"
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser"
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken"

export type AuthContextDataProps = {
  user: UserDTO
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>
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

  async function userAndTokenUpdate(user: UserDTO, token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
  }

  async function storageUserAndTokenSave(user: UserDTO, token: string, refresh_token: string) {
    try {
      setLoadingUserStorageData(true)

      await storageUserSave(user)
      await storageAuthTokenSave({token, refresh_token})
    } catch (error) {
      throw error
    } finally {
      setLoadingUserStorageData(false)
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password })
      
      if (data.user && data.token && data.refresh_token) {

        await storageUserAndTokenSave(data.user, data.token, data.refresh_token)

        userAndTokenUpdate(data.user, data.token)
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
      await storageAuthTokenRemove()

    } catch (error) {
      throw error
    } finally {
      setLoadingUserStorageData(false)
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated)
      await storageUserSave(userUpdated)

    } catch (error) {
      throw error
    }
  }

  async function loadUserData() {
    try {
      setLoadingUserStorageData(true)

      const userLogged = await storageUserGet()
      const { token } = await storageAuthTokenGet()

      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token)
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

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut)

    return () => {
      subscribe()
    }
  }, [signOut])

  return (
    <AuthContext.Provider value={{ 
      user,
      updateUserProfile, 
      signIn, 
      isLoadingUserStorageData, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  )
} 