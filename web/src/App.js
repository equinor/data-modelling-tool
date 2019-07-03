import React from 'react'
import styled from 'styled-components'
import PackageExplorer from './PackageExplorer'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Package from './pages/Package'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'
import CreateBluePrintContainer from './pages/create-blueprint/CreateBluePrintContainer'

function Home() {
  return (
    <Grid>
      <Row>
        <Col xs={12} md={4}>
          <PackageExplorer />
        </Col>
        <Col xs={12} md={8}>
          Something else....
          <Link to="/create-blueprint">Create Blueprint</Link>
        </Col>
      </Row>
    </Grid>
  )
}

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
          <Link to="/">Home</Link>
        </NavLink>
        <NavLink>
          <Link to="/package">Package</Link>
        </NavLink>
        <NavLink>
          <Link to="/create-blueprint">Create new blueprint</Link>
        </NavLink>
      </NavWrapper>

      <Route exact path="/" component={Home} />
      <Route path="/package" component={Package} />
      <Route path="/create-blueprint" component={CreateBluePrintContainer} />
    </Router>
  )
}

export default App
