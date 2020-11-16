import React, { Component } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import { setWsHeartbeat } from "ws-heartbeat/client";

const URL = 'ws://localhost:3030'

class Chat extends Component {
    state = {
        name: this.props.name,
        messages: [],
        status: "",
        interval: undefined
    }

    ws = new WebSocket(URL)
    
    componentDidMount() {

        setWsHeartbeat(this.ws, '{"kind":"ping"}', {
            pingTimeout: 10000, // in 60 seconds, if no message accepted from server, close the connection.
            pingInterval: 5000, // every 25 seconds, send a ping message to the server.
        });
        
        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console  
            console.log('connected')
        }

        this.ws.onmessage = evt => {
            // on receiving a message, add it to the list of messages
            console.log("retorno ---", evt.data)
            const message = JSON.parse(evt.data)
            this.addMessage(message)
        }

        this.ws.onclose = () => {
            console.log('disconnected')

            // automatically try to reconnect on connection loss
            // this.setState({
            //     ws: new WebSocket(URL),
            //  })
        }

        if (this.ws.readyState != 0){
            this.setState({
                status: "OCUPADO"
            })
        }
    }

    componentWillUnmount(){
        this.ws.close()
        this.ws = null;
    }

    addMessage = message =>
        this.setState(state => ({ messages: [message, ...state.messages], status: message.status }))

    submitMessage = messageString => {
        // on submitting the ChatInput form, send the message, add it to the list and reset the input
        try {
    
                const message = { name: this.state.name, message: messageString }
                console.log(this.ws.readyState)
                if (this.ws.readyState != 1){
                    this.setState({
                        status: "OCUPADO"
                    })
                } else {
                    this.ws.send(JSON.stringify(message))
                    this.addMessage(message)
                   var objDiv = document.getElementById("scroll-chat");
                   objDiv.scrollTop = objDiv.scrollHeight;
                }
            
        } catch (e) {
            this.setState({
                status: "OCUPADO"
            })
        }
    }

    render() {
        console.log("status --> ", this.state.status)
        return (
            <div style={this.props.style}>
                <div>
                    <label style={{ fontFamily: 'Playfair Display', fontWeight: 'bold' }} htmlFor="name">
                        {this.state.status === "OCUPADO" ? "Estamos Ocupadas no momento, Tente novamente mais tarde!" : this.props.titulo || "Estamos online!"}
                    </label>
                </div>
                <label style={{ fontSize: 12, fontFamily: 'Playfair Display', }} htmlFor="name">
                    {this.state.status === "OCUPADO" ? "Você também pode enviar um e-mail para atendimento@revivarq.com.br que responderemos o mais breve possivel ;)" : this.props.descricao || "Responderemos você assim que possível ;)"}
                </label>
                <div id={"scroll-chat"} style={this.props.chatBodySize || { height: '200px', overflow: "scroll", overflowX: "hidden" }}>
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
                    {this.state.status !== "OCUPADO" &&
                        <ChatInput
                            ws={this.ws}
                            onSubmitMessage={messageString => this.submitMessage(messageString)}
                        />}
                </div>
            </div>
        )
    }
}

export default Chat