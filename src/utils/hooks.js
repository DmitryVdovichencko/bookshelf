import * as React from 'react'
import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from './api-client'

function useBook(bookId, user) {
  return useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then(data => {
        return data.book
      }),
  })
}
function useBookSearch(query, user) {
  return useQuery({
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then(data => data?.books),
  })
}

function useListItem(user, bookId) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data?.listItems),
  })
  const listItem =
    listItems?.find(itemBook => itemBook.bookId === bookId) ?? null
  return {listItem}
}

function useListItems(user) {
  return useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client('list-items', {token: user.token}).then(data => data?.listItems),
  })
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

function useSafeDispatch(dispatch) {
  const mounted = React.useRef(false)
  React.useLayoutEffect(() => {
    mounted.current = true
    return () => (mounted.current = false)
  }, [])
  return React.useCallback(
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch],
  )
}

// Example usage:
// const {data, error, status, run} = useAsync()
// React.useEffect(() => {
//   run(fetchPokemon(pokemonName))
// }, [pokemonName, run])
const defaultInitialState = {status: 'idle', data: null, error: null}
function useAsync(initialState) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  })
  const [{status, data, error}, setState] = React.useReducer(
    (s, a) => ({...s, ...a}),
    initialStateRef.current,
  )

  const safeSetState = useSafeDispatch(setState)

  const setData = React.useCallback(
    data => safeSetState({data, status: 'resolved'}),
    [safeSetState],
  )
  const setError = React.useCallback(
    error => safeSetState({error, status: 'rejected'}),
    [safeSetState],
  )
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState],
  )

  const run = React.useCallback(
    promise => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`,
        )
      }
      safeSetState({status: 'pending'})
      return promise.then(
        data => {
          setData(data)
          return data
        },
        error => {
          setError(error)
          return Promise.reject(error)
        },
      )
    },
    [safeSetState, setData, setError],
  )

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  }
}

export {
  useAsync,
  useBook,
  useBookSearch,
  useListItem,
  useListItems,
  useUpdateListItem,
  useCreateListItem,
  useRemoveListItem,
}
