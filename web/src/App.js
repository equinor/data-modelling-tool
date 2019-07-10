import React from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import CreateBluePrintContainer from './pages/create-blueprint/CreateBluePrintContainer'

const NavWrapper = styled.div`
  display: flex;
  margin: 5px 30px 30px;
`

const NavLink = styled.div`
  display: inline-flex;
  margin: 0 20px;
`

function App() {
  return (
    <Router>
      <NavWrapper>
        <NavLink>
          <Link to="/create-blueprint">Create new blueprint</Link>
        </NavLink>
      </NavWrapper>

      <Route path="/create-blueprint" component={CreateBluePrintContainer} />
    </Router>
  )
}

export default App
