import React from 'react'
import styled from 'styled-components'

const BreadcrumbSeparatorStyled = styled.li`
  color: #333;
  margin: auto 6px;
  user-select: none;
`

const List = styled.ol`
  list-style: none;
  display: flex;
  align-items: center;
`

const Wrapper = styled.div`
  margin-top: 30px;
`

const BreadcrumbItem = (props: any) => {
  const { children } = props
  return (
    <li className="breadcrumb-item" {...props}>
      {children}
    </li>
  )
}

const BreadcrumbSeparator = (props: any) => {
  const { children } = props
  return (
    <BreadcrumbSeparatorStyled {...props}>{children}</BreadcrumbSeparatorStyled>
  )
}

const Breadcrumb = (props: any) => {
  const { separator = '/' } = props
  const items = React.Children.toArray(props.children).map((child, index) => (
    <BreadcrumbItem key={`breadcrumb_item${index}`}>{child}</BreadcrumbItem>
  ))

  const lastIndex = items.length - 1

  const children = items.reduce((acc, child, index) => {
    const notLast = index < lastIndex
    if (notLast) {
      acc.push(
        // @ts-ignore
        child,
        <BreadcrumbSeparator key={`breadcrumb_sep${index}`}>
          {separator}
        </BreadcrumbSeparator>
      )
    } else {
      // @ts-ignore
      acc.push(child)
    }
    return acc
  }, [])

  return (
    <Wrapper>
      <List>{children}</List>
    </Wrapper>
  )
}

export default Breadcrumb
