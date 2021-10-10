/** @jsx jsx */
import {jsx} from '@emotion/core'
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './bootstrap'
import Tooltip from '@reach/tooltip'
import {FaSearch} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from './components/lib'
import {BookRow} from './components/book-row'
import { client } from './utils/api-client'
import * as colors from  'styles/colors'
import {useAsync} from 'utils/hooks'

function DiscoverBooksScreen() {
	const {data, error, run, isLoading, isError, isSuccess} = useAsync()
	const [ queried, setQueried ] = useState(false);
	// const [ status, setStatus ] = useState('idle');
	const [ query, setQuery ] = useState(null);
	// const [ error, setError ] = useState(null);
	// const [ data, setData ] = useState(null);

	useEffect(() => {
		if (!queried) return;
		run(client(`books?query=${encodeURIComponent(query)}`))
		// .then((bookData)=>{
		// 	console.log({bookData})
		// 	setStatus('success')
		// 	setData(bookData)
		// }, errorData => {
		// 	setError(errorData);
		// 	setStatus('failed');
		// 	console.log({errorData})
			
		// });
		
	}, [queried, query, run])

  // const isLoading = status === 'loading'
  // const isSuccess = status === 'success'
	// const isError = status === 'failed'

  function handleSearchSubmit(event) {
		event.preventDefault();
		setQueried(true)
		const { value } = event.target.elements.search;
		setQuery(value)
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? <Spinner /> : isError ? <FaTimes aria-label="error" css={{color: colors.danger}} /> :  <FaSearch aria-label="search" />}
            </button>
          </label>
        </Tooltip>
      </form>
  { isError ? (
    <div css={{color: colors.danger}}>
      <p>There was an error:</p>
      <pre>{error.message}</pre>
    </div>
  ) : null
}
      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}

export {DiscoverBooksScreen}
