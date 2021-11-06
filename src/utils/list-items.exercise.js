import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from './api-client'



function useListItems(user) {
  const result = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data?.listItems),
  })
	return {...result, listItems: result.data ?? [] };
}

function useListItem(user, bookId) {
  const { listItems = null } = useListItems(user)

  const listItem =
    listItems?.find(itemBook => itemBook.bookId === bookId) ?? null

  return {listItem}
}

function useUpdateListItem(user) {
  return useMutation(
    (data) => {
      client(`list-items/${data.id}`, {data, method: 'PUT', token: user.token})
    },
    {
      onSettled: () => queryCache.invalidateQueries('list-items'),
    },
  )
}

function useRemoveListItem(user) {
  return useMutation(
    id => {
      client(`list-items/${id}`, {method: 'DELETE', token: user.token})
    },
    {
      onSettled: () => queryCache.invalidateQueries('list-items'),
    },
  )
}

function useCreateListItem(user) {
  return useMutation(
    bookId => {
      client(`list-items`, {data: {bookId}, method: 'POST', token: user.token})
    },
    {
      onSettled: () => queryCache.invalidateQueries('list-items'),
    },
  )
}

export {useListItem, useListItems, useCreateListItem, useUpdateListItem, useRemoveListItem}