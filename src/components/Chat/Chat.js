import React, { Component } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

const URL = 'ws://localhost:3030'

class Chat extends Component {
    state = {
        name: this.props.name,
        messages: [],
    }

    ws = new WebSocket(URL)

    componentDidMount() {
        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected')
        }

        this.ws.onmessage = evt => {
            // on receiving a message, add it to the list of messages
            const message = JSON.parse(evt.data)
            this.addMessage(message)
        }

        this.ws.onclose = () => {
            console.log('disconnected')
            // automatically try to reconnect on connection loss
            this.setState({
                ws: new WebSocket(URL),
            })
        }
    }

    addMessage = message =>
        this.setState(state => ({ messages: [message, ...state.messages] }))

    submitMessage = messageString => {
        // on submitting the ChatInput form, send the message, add it to the list and reset the input
        const message = { name: this.state.name, message: messageString }
        this.ws.send(JSON.stringify(message))
        this.addMessage(message)
        var objDiv = document.getElementById("scroll-chat");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    render() {
        return (
            <div style={this.props.style}>
                <div>
                    <label style={{ fontFamily: 'Playfair Display', fontWeight: 'bold' }} htmlFor="name">
                        {this.props.titulo || "Estamos online!"}
        </label>
                </div>
                <label style={{ fontSize: 12, fontFamily: 'Playfair Display', }} htmlFor="name">
                    {this.props.descricao ||"Responderemos você assim que possível ;)"}
        </label>
        <div id={"scroll-chat"}style={this.props.chatBodySize || { height: '220px', overflow: "scroll" , overflowX: "hidden"}}>
            <div >
                {this.state.messages.map((message, index) =>
                    <ChatMessage
                        key={index}
                        message={message.message}
                        name={message.name}
                    />,
                ).reverse()}
                </div>
                </div>
                <div>
                <ChatInput
                    ws={this.ws}
                    onSubmitMessage={messageString => this.submitMessage(messageString)}
                />
                 </div>
            </div>
        )
    }
}

export default Chat