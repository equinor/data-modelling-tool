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
export const Heading = (props: { text: string }): JSX.Element => {
  const { text } = props
  return <Typography variant={'h1'}>{text}</Typography>
}

export const Meta = (props: { text: string }) => {
  const { text } = props
  return <Typography variant="meta">{text}</Typography>
}
