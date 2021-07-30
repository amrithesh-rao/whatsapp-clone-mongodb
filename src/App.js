import './App.css';
import { useEffect,useState } from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Pusher from 'pusher-js';
import axios from './axios';
function App() {
  const [messages,setMessages] = useState([]);
  useEffect(()=>{
    axios.get("/messages/sync")
    .then((response)=>{
      console.log(response.data);
      setMessages(response.data);
    })
  },[]);
  useEffect(() => {
    const pusher = new Pusher('848960ca4f19dc60fb87', {
      cluster: 'us2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage)=> {
      setMessages([...messages,newMessage]);
    });
    return ()=>{
      pusher.unbind_all();
      pusher.unsubscribe();
    };
  }, [messages]);
  console.log(messages);
  return (
    <div className="app">
    <div className="app_body"> 
    <Sidebar />
    <Chat messages={messages}/>
    </div>
    </div>
  );
}

export default App;
