import React from 'react'

export default ({ name, message }) =>
  <p style={{fontSize: 14, wordWrap: 'break-word',  textAlign: 'left'}}>
    <strong>{name}</strong> <em>{message}</em>
  </p>