// @ts-ignore
// @ts-ignore
import { Link, useLocation } from 'react-router-dom'
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
  const location = useLocation()
  return (
    <>
      <h4>Data Modelling Tool</h4>
      <Link to={'/'}>
        <TabStyled isSelected={location.pathname === '/'}>Blueprints</TabStyled>
      </Link>
      <Link to={'/entities'}>
        <TabStyled isSelected={location.pathname === '/entities'}>
          Entities
        </TabStyled>
      </Link>
      <Link to={'/search'}>
        <TabStyled isSelected={location.pathname === '/search'}>
          Search
        </TabStyled>
      </Link>
    </>
  )
}
