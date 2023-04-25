// Client side for socket.io
const socket=io(`https://ping-pong-chat-app.onrender.com`);

// Required html elements
const form=document.getElementById("send-container");
const messageInput=document.getElementById("messageInput");
const messageContainer=document.querySelector(".container");
const audio1=new Audio("public/assets/tone1.wav");
const audio2=new Audio("public/assets/tone2.wav");

// To append a new message in the container
const append=(message,position)=>{
    const messageEl=document.createElement("div");
    messageEl.innerText=message;
    messageEl.classList.add("message")
    messageEl.classList.add(position);
    messageContainer.append(messageEl);
    if(position=="left"){
        audio2.play();
    }
    else if(position=="center"){
        audio1.play();
    }
}

// Find the users who are online
const findCount=(users)=>{
    const onlineCount=document.querySelector(".online-count span");
    const length = Object.keys(users).length;
    onlineCount.innerText=length;
}

// To handle when a new message is submitted in the form
form.addEventListener("submit",(event)=>{
    event.preventDefault();
    const message=messageInput.value
    append(`${message}`,"right");
    socket.emit("send",message);
    messageInput.value="";
})

// For new users's name
let username=prompt("Enter your name");

// In case new user joins
socket.emit("new-user-joined",username);
socket.on("user-joined",data=>{
    append(`${data.name} joined the chat`,"center");
    findCount(data.totalUsers);
})
// In case a new message is received
socket.on("receive",data=>{
    append(`${data.name}: ${data.message}`,"left");
})
// In case users lefts
socket.on("leave",data=>{
    findCount(data.totalUsers);
    append(`${data.name} left the chat`,"center");
})