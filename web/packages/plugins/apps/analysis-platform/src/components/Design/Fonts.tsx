import React from 'react'
import { Typography } from '@equinor/eds-core-react'

/**
 *
 * @param props An object with the attributes described below
 * @param props.variant: A variant of a heading, e.g. h1
 * @param props.text: The text to display
 * @param props.tokens: An object containing the tokens used to customize the style
 * token={{
 *   color: 'purple',
 *   fontFamily: 'Arial',
 *   fontSize: '1.875rem',
 *   fontWeight: 900,
 *   lineHeight: '1.714em',
 *   textTransform: 'uppercase',
 * }}
 * @constructor
 */
export const Heading = (props: {
  variant?: string
  text: string
  tokens?: any
}): JSX.Element => {
  const { variant, text, tokens } = props
  return (
    <Typography variant={variant || 'h1'} tokens={tokens}>
      {text}
    </Typography>
  )
}

export const Meta = (props: { text: string }) => {
  const { text } = props
  return <Typography variant="meta">{text}</Typography>
}
