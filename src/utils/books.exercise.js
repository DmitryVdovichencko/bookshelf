import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from './api-client'
import bookPlaceholderSvg from '../assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

function useBook(bookId, user) {
  const result = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then(data => {
        return data?.book
      }),
  })
	return {...result, book: result.data ?? loadingBook}
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

function useBookSearch(query, user) {
  const result = useQuery({
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then(data => data?.books),
		config:{
			onSuccess:(data)=>{
				for (const book of data){
					setQueryDataForBook(book)
				}
			}}
		})
	return {...result, books: result.data ?? loadingBooks}
}

function setQueryDataForBook(book) {
	const {id:bookId} = book;
	return queryCache.setQueryData(['book', {bookId}], book)
}

async function refetchBookSearchQuery(query,user) {
	queryCache.removeQueries(['bookSearch', {query}])
	await queryCache.prefetchQuery(['bookSearch', {query}], () =>
	client(`books?query=${encodeURIComponent(query)}`, {
		token: user.token,
	}).then(data => data?.books))
}

export { useBook, useBookSearch, setQueryDataForBook, refetchBookSearchQuery }