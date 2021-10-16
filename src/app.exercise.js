/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {client} from 'utils/api-client'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {useAsync} from 'utils/hooks'
import { FullPageSpinner} from 'components/lib'
import * as colors from './styles/colors';


async function getUser() {
	let user = null;

	const token = await auth.getToken();
	if(token){
		const data = await client('me', {token});
		user = data.user;
	}

	return user
		
}

function App() {

	const {
		data:user,
		error,
		isIdle,
		isLoading,
		isSuccess,
		isError,
		run,
		setData,
	} = useAsync();

	const login = form => run(auth.login(form)).then(user => setData(user));
	const register = form => run(auth.register(form)).then(user => setData(user))
	const logout = () => auth.logout().then(u => setData(null));

	React.useEffect(() => {
		run(getUser());
	},[run])

	if(isLoading){
		return <FullPageSpinner />
	}
	if(isError){
		return <div
		css={{
			color: colors.danger,
			height: '100vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		}}
	>
		<p>Uh oh... There's a problem. Try refreshing the app.</p>
		<pre>{error.message}</pre>
	</div>
	}
	return user ? <AuthenticatedApp {...{ user, logout }} /> : <UnauthenticatedApp {...{ login, register }} />
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
