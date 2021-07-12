import React from 'react'

const Prompt = (props: any) => {
  const { title, content, onSubmit, buttonText } = props
  return (
    <div>
      <h4>{title}</h4>
      {content}
      <div style={{ textAlign: 'center', paddingTop: '10px' }}>
        <button onClick={() => onSubmit()}>{buttonText}</button>
      </div>
    </div>
  )
}

export default Prompt
