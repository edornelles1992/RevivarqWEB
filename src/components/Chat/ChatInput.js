import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ChatInput extends Component {
  static propTypes = {
    onSubmitMessage: PropTypes.func.isRequired,
  }
  state = {
    message: '',
  }

  render() {
    return (
      <form
        action="."
        onSubmit={e => {
          e.preventDefault()
          if (!!this.state.message) { 
          this.props.onSubmitMessage(this.state.message)
          this.setState({ message: '' })
          }
        }}
      >
        <input
          type="text"
          placeholder={'Escreva sua mensagem...'}
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
        />
        <input style={{ marginTop: 30, fontFamily: 'Playfair Display', backgroundColor:'rgb(255,255,255)'}}type="submit" value={'Enviar'} />
      </form>
    )
  }
}

export default ChatInput