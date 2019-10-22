import React, { useState } from 'react'
import './progress-bar.css'

// Ref: https://www.ilonacodes.com/blog/progress-bar-with-react-hooks/

const Range = (props: any) => {
  return <div className="range" style={{ width: `${props.percentRange}%` }} />
}

const ProgressBar = (props: any) => {
  return (
    <div className="progress-bar">
      <Range percentRange={props.percentRange} />
    </div>
  )
}

export const ProgressBarContainer = (props: any) => {
  const { children } = props
  let [percentRange, setProgress] = useState(-1)

  return (
    <div className="container">
      {percentRange > 0 ? <ProgressBar percentRange={percentRange} /> : null}
      {children(setProgress)}
    </div>
  )
}
