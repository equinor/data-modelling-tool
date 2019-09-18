import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import BlueprintsPage from './pages/blueprints/BlueprintsPage'
import { ALMOST_BLACK, PRIMARY_COLOR } from './components/styles'
import { H1 } from './components/Headers'
import { NotificationContainer } from 'react-notifications'
import EntitiesPage from './pages/entities/EntitiesPage'
import DocumentEditorPage from './pages/DocumentEditorPage'
import { Switch } from 'react-router'

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    // margin: 0 auto 25px;
    // max-width: 1600px;
    font-family: Equinor-Regular, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    // max-width: 1600px;
  }
`

// commented out because its dead code with false && flag in the Router component children block.
// const AppHeader = styled.header`
//   display: flex;
//   flex-direction: row;
//   color: ${ALMOST_BLACK};
//   min-height: 5px;
//   margin-bottom: 5px;
//   padding-top: 5px;
// `
//
// const AppTitle = styled(H1)`
//   margin: 0;
//   font-size: 24px;
//   -webkit-user-select: none; /* Safari */
//   -moz-user-select: none; /* Firefox */
//   -ms-user-select: none; /* IE10+/Edge */
//   user-select: none; /* Standard */
// `

// const HeaderLink = styled(({ right, ...props }) => <NavLink {...props} />)`
//   text-decoration: none;
//   color: inherit;
//   ${props => (props.right ? 'margin-left: 25px' : 'margin-right: 25px')};
//   outline: none;
//   padding-bottom: 5px;
//
//   &:hover {
//     color: ${PRIMARY_COLOR};
//     text-decoration: none;
//   }
//
//   &:focus {
//     text-decoration: none;
//   }
// `

// const HeaderLinks = styled.div`
//   margin-left: auto;
//
//   .active {
//     border-bottom: 2px solid ${PRIMARY_COLOR};
//   }
// `

// const InnerHeader = styled.div`
//   display: flex;
//   align-items: flex-end;
// `

function App() {
  return (
    <Router>
      <GlobalStyle />
      {/*{false && (*/}
      {/*  <AppHeader>*/}
      {/*    <InnerHeader>*/}
      {/*      <AppTitle>*/}
      {/*        <HeaderLink to="/">Data Modelling Tool</HeaderLink>*/}
      {/*      </AppTitle>*/}
      {/*      <HeaderLinks>*/}
      {/*        <HeaderLink right exact to="/blueprints">*/}
      {/*          Blueprints*/}
      {/*        </HeaderLink>*/}
      {/*        <HeaderLink right exact to="/entities">*/}
      {/*          Entities*/}
      {/*        </HeaderLink>*/}
      {/*      </HeaderLinks>*/}
      {/*    </InnerHeader>*/}
      {/*  </AppHeader>*/}
      {/*)}*/}

      <NotificationContainer />

      <Switch>
        <Route path="/blueprints" component={BlueprintsPage} />
        <Route path="/entities" component={EntitiesPage} />
        <Route exact path="/" component={DocumentEditorPage} />
      </Switch>
    </Router>
  )
}

export default App
