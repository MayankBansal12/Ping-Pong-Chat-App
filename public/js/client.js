const socket=io("http://localhost:8000");
const form=document.getElementById("send-container");
const messageInput=document.getElementById("messageInput");
const messageContainer=document.querySelector(".container");
const audio1=new Audio("public/assets/tone1.wav");
const audio2=new Audio("public/assets/tone2.wav");

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
form.addEventListener("submit",(event)=>{
    event.preventDefault();
    const message=messageInput.value
    append(`${message}`,"right");
    socket.emit("send",message);
    messageInput.value="";
})

let username=prompt("Enter your name");
socket.emit("new-user-joined",username);
socket.on("user-joined",username=>{
    append(`${username} joined the chat`,"center");
})

socket.on("receive",data=>{
    append(`${data.name}: ${data.message}`,"left");
})

socket.on("leave",username=>{
    append(`${username} left the chat`,"center");
})