import * as React from 'react';
import * as auth from 'auth-provider'
import {FullPageSpinner, FullPageErrorFallback} from '../components/lib'
import {client} from '../utils/api-client'
import {useAsync} from '../utils/hooks'
const AuthContext = React.createContext();

function useAuth() {
	if(!React.useContext(AuthContext)){
		throw Error('useAuth hook must be called inside AuthContext.Provider')
	}
	return React.useContext(AuthContext)
}

function useClient() {
	const { user: {token}} = useAuth();
	return React.useCallback((endpoint, config) => client(endpoint, {...config, token}),[token])
}

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

function AuthProvider({children}) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    const props = {user, login, register, logout}
    return (
      <AuthContext.Provider value={props}>
				{children}
      </AuthContext.Provider>
    )
  }
}

export {AuthContext, AuthProvider, useAuth, useClient}
