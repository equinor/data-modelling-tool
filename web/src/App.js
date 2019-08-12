import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import BluePrintPage from './pages/blueprint/BluePrintPage'
import { ALMOST_BLACK, PRIMARY_COLOR } from './components/styles'
import { H1 } from './components/Headers'

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0 auto 25px;
    max-width: 1600px;
    font-family: Equinor-Regular, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    max-width: 1600px;
  }
`

const AppHeader = styled.header`
  display: flex;
  flex-direction: row;
  color: ${ALMOST_BLACK};
  min-height: 80px;
  margin-bottom: 20px;
  padding-top: 20px;
`

const AppTitle = styled(H1)`
  margin: 0;
  font-size: 24px;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
`

const HeaderLink = styled(({ right, ...props }) => <NavLink {...props} />)`
  text-decoration: none;
  color: inherit;
  ${props => (props.right ? 'margin-left: 25px' : 'margin-right: 25px')};
  outline: none;
  padding-bottom: 5px;

  &:hover {
    color: ${PRIMARY_COLOR};
    text-decoration: none;
  }

  &:focus {
    text-decoration: none;
  }
`

const HeaderLinks = styled.div`
  margin-left: auto;

  .active {
    border-bottom: 2px solid ${PRIMARY_COLOR};
  }
`

const InnerHeader = styled.div`
  display: flex;
  align-items: flex-end;
`

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppHeader>
        <InnerHeader>
          <AppTitle>
            <HeaderLink to="/">Data Modelling Tool</HeaderLink>
          </AppTitle>
          <HeaderLinks>
            <HeaderLink right exact to="/blueprints">
              Blueprints
            </HeaderLink>
            <HeaderLink right exact to="/entities">
              Entities
            </HeaderLink>
          </HeaderLinks>
        </InnerHeader>
      </AppHeader>

      <Route path="/blueprints" component={BluePrintPage} />
    </Router>
  )
}

export default App
