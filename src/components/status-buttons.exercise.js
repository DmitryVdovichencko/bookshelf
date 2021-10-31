/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
  FaTimesCircle,
} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'
import {useAsync} from 'utils/hooks'
import * as colors from 'styles/colors'
import {CircleButton, Spinner} from './lib'

function TooltipButton({label, highlight, onClick, icon, ...rest}) {
  const {isLoading, isError, error, run} = useAsync()

  function handleClick() {
    run(onClick())
  }

  return (
    <Tooltip label={isError ? error.message : label}>
      <CircleButton
        css={{
          backgroundColor: 'white',
          ':hover,:focus': {
            color: isLoading
              ? colors.gray80
              : isError
              ? colors.danger
              : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isError ? error.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  )
}

function StatusButtons({user, book}) {

  // 🐨 call useQuery here to get the listItem (if it exists)
  // queryKey should be 'list-items'
  // queryFn should call the list-items endpoint
	const { isLoading, isError, data, error } = useQuery('list-items', async () => await client('list-items', {token: user.token}));
  // 🐨 search through the listItems you got from react-query and find the
  // one with the right bookId.
  const listItem = data?.listItems?.filter((itemBook) => itemBook.bookId === book.id)[0] || null;
  // 💰 for all the mutations below, if you want to get the list-items cache
  // updated after this query finishes the use the `onSettled` config option
  // to queryCache.invalidateQueries('list-items')
	
	const [update] = useMutation(async (data) => {
		await client(`list-items/${listItem.id}`, {data, method:"PUT", token: user.token})
	}, {
		onSettled:() => queryCache.invalidateQueries('list-items')
	})
	const [remove] = useMutation( async () => {
		await client(`list-items/${listItem.id}`, {method:"DELETE", token: user.token})
	},{
		onSettled:() => queryCache.invalidateQueries('list-items')
	})
	const [create] = useMutation( async () => {
		await client(`list-items`, { data:{bookId:book.id}, method:"POST", token: user.token })
	},{
		onSettled:() => queryCache.invalidateQueries('list-items')
	})
  // 🐨 call useMutation here and assign the mutate function to "update"
  // the mutate function should call the list-items/:listItemId endpoint with a PUT
  //   and the updates as data. The mutate function will be called with the updates
  //   you can pass as data.

  // 🐨 call useMutation here and assign the mutate function to "remove"
  // the mutate function should call the list-items/:listItemId endpoint with a DELETE

  // 🐨 call useMutation here and assign the mutate function to "create"
  // the mutate function should call the list-items endpoint with a POST
  // and the bookId the listItem is being created for.
  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            label="Unmark as read"
            highlight={colors.yellow}
						onClick={() => update({id: listItem.bookId, finishDate: null})}
            // 🐨 add an onClick here that calls update with the data we want to update
            // 💰 to mark a list item as unread, set the finishDate to null
            // {id: listItem.id, finishDate: null}
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
						onClick={() => update({id: listItem.id, finishDate: Date.now()})}
            // 🐨 add an onClick here that calls update with the data we want to update
            // 💰 to mark a list item as read, set the finishDate
            // {id: listItem.id, finishDate: Date.now()}
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          // 🐨 add an onClick here that calls remove
					onClick={remove}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          // 🐨 add an onClick here that calls create
					onClick={create}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  )
}

export {StatusButtons}
