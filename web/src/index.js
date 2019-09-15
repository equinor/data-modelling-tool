import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'react-notifications/lib/notifications.css'
import App from './App'
import { ThemeProvider } from 'styled-components'

const theme = {
  flexboxgrid: {
    gutterWidth: 0, // rem
    outerMargin: 0, // rem
  },
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
)
