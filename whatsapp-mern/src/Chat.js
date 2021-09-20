import { Avatar, IconButton } from '@material-ui/core'
import React, { useState } from 'react'
import {SearchOutlined,Mic , AttachFile, MoreVert, InsertEmoticon} from '@material-ui/icons/';
import './Chat.css'
import axios from './axios';

function Chat({messages}) {
    const sendMessage = async (e) => {
        e.preventDefault()
        await axios.post('/messages/new', {
            message : input,
            name : 'DEMO APP',
            timestamp : 'just now',
            recived : false
        })
        setInput('')
    }

    const [input, setInput] = useState('')
    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar />
                <div className="chat__headerInfo">
                    <h3>Room name</h3>
                    <p>Last seen at...</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">
                {messages.map((message, index) => (
                    <p key={index} className={`chat__message ${message.recived && 'chat__reciver'}`}>
                        <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">
                            {message.timestamp}
                        </span>
                    </p> 
                ))}
              
               
            </div>

            <div className="chat__footer">
                <InsertEmoticon />
                <form>
                    <input 
                        type="text" 
                        placeholder="Type a message"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <button onClick={sendMessage} type="submit">
                        Send a message
                    </button>
                </form>
                <Mic/>
            </div>
        </div>
    )
}

export default Chat
