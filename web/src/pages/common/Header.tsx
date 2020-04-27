// @ts-ignore
import { useHistory, useLocation } from 'react-router-dom'
import React from 'react'
import styled from 'styled-components'

const TabStyled: any = styled.div`
  color: ${(props: any) => (props.isSelected ? 'black' : 'black')};
  padding: 10px 15px;
  display: inline-block;
  margin-bottom: 20px;
  cursor: pointer;
  border-bottom-color: ${(props: any) =>
    props.isSelected ? 'black' : 'white'};
  border-bottom-style: solid;
  border-bottom-width: ${(props: any) => (props.isSelected ? '2px' : '0px')};

  &:hover {
    color: ${(props: any) => (props.isSelected ? 'black' : 'gray')};
  }
`

export default () => {
  const history = useHistory()
  const location = useLocation()
  return (
    <>
      <h4>Data Modelling Tool</h4>
      <TabStyled
        isSelected={location.pathname === '/'}
        onClick={() => history.push('/')}
      >
        Browse/Edit
      </TabStyled>
      <TabStyled
        isSelected={location.pathname === '/search'}
        onClick={() => history.push('/search')}
      >
        Search
      </TabStyled>
    </>
  )
}
