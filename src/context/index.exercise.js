import * as React from 'react'
import {AuthProvider} from './auth-context'
import {ReactQueryConfigProvider} from 'react-query'
import {BrowserRouter as Router} from 'react-router-dom'

const queryConfig = {
	retry(failureCount, error) {
		if (error.status === 404) return false
		else if (failureCount < 2) return true
		else return false
	},
	useErrorBoundary: true,
	refetchAllOnWindowFocus: false,
}

function AppProviders({children}) {

  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <AuthProvider>
				<Router>
					{children}
				</Router>
			</AuthProvider>
    </ReactQueryConfigProvider>
  )
}

export { AppProviders }
