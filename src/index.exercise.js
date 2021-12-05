// 🐨 you don't need to do anything for the exercise, but there's an extra credit!
import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {AppProviders} from './context/';
import {App} from './app'


loadDevTools(() => {
  ReactDOM.render(
    <AppProviders>
      	<App />
			</AppProviders>,
    document.getElementById('root'),
  )
})
