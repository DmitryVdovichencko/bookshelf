function client(endpoint, customConfig = {}) {
  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, {
      method: 'GET',
      ...customConfig,
    }).then(async response => {
			const data = await response.json();
			if(response.ok){
				return data
			}else{
				console.log(data)
				return Promise.reject(data)
			}
		})
}

export {client}