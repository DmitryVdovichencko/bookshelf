import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from './api-client'
import {setQueryDataForBook} from './books'


function useListItems(user) {
  const result = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data?.listItems),
			config:{
				onSuccess:(data)=>{
					for (const {book} of data){
						setQueryDataForBook(book)
					}
				}}
  })
	return {...result, listItems: result.data ?? [] };
}

function useListItem(user, bookId) {
  const { listItems = null } = useListItems(user)

  const listItem =
    listItems?.find(itemBook => itemBook.bookId === bookId) ?? null

  return {listItem}
}

function useUpdateListItem(user, { throwOnError } = { throwOnError:false }) {
  return useMutation(
    (data) => {
				client(`list-items/${data.id}`, {data, method: 'PUT', token: user.token})
    },
    {
      onSettled: () => queryCache.invalidateQueries('list-items'),
			// onMutate:(updatedItem) => {
			// 	const {id} = updatedItem;
			// 	console.log(id,queryCache)
			// 	queryCache.setQueryData(['list-items',{id}], updatedItem)
			// },
			throwOnError:true
    },
  )
}

function useRemoveListItem(user, { throwOnError } = { throwOnError:false }) {
  return useMutation(
    id => {
      client(`list-items/${id}`, {method: 'DELETE', token: user.token})
    },
    {
      onSettled: () => queryCache.invalidateQueries('list-items'),
			throwOnError
    },
  )
}

function useCreateListItem(user, { throwOnError } = { throwOnError:false }) {
  return useMutation(
    bookId => {
      client(`list-items`, {data: {bookId}, method: 'POST', token: user.token})
    },
    {
      onSettled: () => queryCache.invalidateQueries('list-items'),
			throwOnError
    },
  )
}

export {useListItem, useListItems, useCreateListItem, useUpdateListItem, useRemoveListItem}