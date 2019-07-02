import React from 'react'
import PackageExplorer from './PackageExplorer'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Package from './pages/Package'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'

function Home() {
  return (
    <Grid>
      <Row>
        <Col xs={12} md={4}>
          <PackageExplorer />
        </Col>
        <Col xs={12} md={8}>
          Something else....
        </Col>
      </Row>
    </Grid>
  )
}

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route path="/package" component={Package} />
    </Router>
  )
}

export default App
