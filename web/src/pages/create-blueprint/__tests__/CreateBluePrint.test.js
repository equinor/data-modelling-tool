import React from 'react'
import ReactDOM from 'react-dom'
import CreateBluePrintContainer from '../CreateBluePrintContainer'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<CreateBluePrintContainer />, div)
  ReactDOM.unmountComponentAtNode(div)
})
