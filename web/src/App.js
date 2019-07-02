import React from 'react';
import PackageExplorer from './PackageExplorer';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Package from './pages/Package';

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function App() {
  return (
    <Router>
        <div>
          <PackageExplorer />
          <Route exact path="/" component={Home} />
          <Route path="/package" component={Package} />
        </div>
    </Router>
  );
}

export default App
