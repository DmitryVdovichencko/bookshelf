import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {ReactQueryConfigProvider, ReactQueryCacheProvider, queryCache} from 'react-query'

import {App} from './app'
// const queryCache = new QueryCache({
// 	defaultConfig: {
// 		queries: {
// 			refetchOnWindowFocus: false,
// 			useErrorBoundary: true, 
// 		}
// 	},
// })
const queryConfig = {
	queries:{
    retry(failureCount, error) {
      if (error.status === 404) return false
      else if (failureCount < 2) return true
      else return false
    },
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
	}
}
console.log(queryCache)
loadDevTools(() => {
  ReactDOM.render(
		<ReactQueryCacheProvider queryCache={queryCache}>
			<ReactQueryConfigProvider config={queryConfig}>
				<App />
			</ReactQueryConfigProvider>
			</ReactQueryCacheProvider>, document.getElementById('root'))

})
