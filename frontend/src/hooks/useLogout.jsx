import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const { dispatch: authDispatch } = useAuthContext()

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action
    authDispatch({ type: 'LOGOUT' })
  }

  return logout;  // Directly return the logout function
}
