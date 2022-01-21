import React, { ChangeEvent, useContext, useState } from 'react'
import styled from 'styled-components'
import { TComment } from '../Types'
import { colorFromString } from '../utils/colorFromString'
import { Button, Progress, TextField } from '@equinor/eds-core-react'
import { AuthContext } from '@dmt/common'
import { DEFAULT_DATASOURCE_ID } from '../const'
import { Blueprints } from '../Enums'
import { IconWrapper } from './Other'
import { getUsername } from '../utils/auth'
import { useDocument } from '@dmt/common'
const CommentHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

type CommentWrapperProps = {
  color?: any
  leftAdjusted?: any
}

const CommentWrapper = styled.div<CommentWrapperProps>`
  display: flex;
  width: fit-content;
  min-width: 150px;
  max-width: 350px;
  font-size: 16px;
  background: rgb(250, 250, 250);
  flex-direction: column;
  padding: 7px;

  border: ${(props: CommentWrapperProps) => props.color} 1px solid;
  border-radius: 5px;
  margin: 5px 10px;
  align-self: ${(props: CommentWrapperProps) => {
    if (props.leftAdjusted) return 'flex-start'
    return 'flex-end'
  }};
`
const CompactCommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 7px;
  border: darkgrey 1px solid;
  border-radius: 5px;
  margin: 5px;
  margin-bottom: 10px;
`

const CompactMessageWrapper = styled.div`
  max-height: 100px;
  overflow: auto;
`

export const CompactCommentView = (props: { comment: TComment }) => {
  const { comment } = props
  return (
    <CompactCommentWrapper>
      <CommentHeaderWrapper>
        <IconWrapper color={colorFromString(comment.author)}>
          &#9679;
        </IconWrapper>
        <b>{comment.author}</b>
      </CommentHeaderWrapper>
      <b style={{ width: 'fit-content', paddingBottom: '5px' }}>
        {new Date(comment.date).toLocaleString(navigator.language)}
      </b>
      <div style={{ borderBottom: 'black 1px solid', width: 'fit-content' }}>
        {comment.operation}
      </div>
      <CompactMessageWrapper>{comment.message}</CompactMessageWrapper>
    </CompactCommentWrapper>
  )
}

export const CommentView = (props: {
  comment: TComment
  leftAdjusted: boolean
}) => {
  const { comment, leftAdjusted } = props
  const uniqueAuthorColor = colorFromString(comment.author)
  return (
    <CommentWrapper color={uniqueAuthorColor} leftAdjusted={leftAdjusted}>
      <CommentHeaderWrapper>
        <IconWrapper color={uniqueAuthorColor}>&#9679;</IconWrapper>
        <b>{comment.author}</b>
      </CommentHeaderWrapper>
      <b style={{ width: 'fit-content' }}>
        {new Date(comment.date).toLocaleString(navigator.language)}
      </b>
      <div style={{ borderBottom: 'black 1px solid', width: 'fit-content' }}>
        {comment.operation}
      </div>
      <div>{comment.message}</div>
    </CommentWrapper>
  )
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px;
`
export const CommentInput = (props: {
  commentsId: string
  handleNewComment: Function
}) => {
  const { commentsId, handleNewComment } = props
  const [message, setMessage] = useState<string>('')
  const { tokenData } = useContext(AuthContext)
  const [commentsDocument, loading, updateComments, error] = useDocument(
    DEFAULT_DATASOURCE_ID,
    commentsId
  )

  function handlePost() {
    const newComment = {
      type: Blueprints.Comment,
      author: getUsername(tokenData),
      date: new Date().toISOString(),
      message: message,
    }
    commentsDocument.comments.push(newComment)
    updateComments(commentsDocument)
    handleNewComment(newComment)
    setMessage('')
  }

  return (
    <>
      <InputWrapper>
        <TextField
          id="comment-input"
          placeholder="Leave a comment"
          multiline
          style={{ borderRadius: '5px' }}
          rows={5}
          value={message}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setMessage(event.target.value)
          }
        />
        <div
          style={{
            justifyContent: 'space-around',
            display: 'flex',
            paddingTop: '10px',
          }}
        >
          <Button color="danger" onClick={() => setMessage('')}>
            Cancel
          </Button>
          <Button disabled={message === ''} onClick={() => handlePost()}>
            {(loading && <Progress.Dots color="neutral" />) || 'Comment'}
          </Button>
        </div>
      </InputWrapper>
    </>
  )
}
