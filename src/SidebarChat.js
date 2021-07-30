import React from "react";
import "./SidebarChat.css";
import { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
function SidebarChat() {
  const [seed, setSeed] = useState("");
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);
  return (
    <div className="sidebarChat">
      <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
      <div className="sidebarChat__info">
        <h2>Hola</h2>
        <p>Hello</p>
      </div>
    </div>
  );
}

export default SidebarChat;
