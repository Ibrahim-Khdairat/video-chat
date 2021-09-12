'use strict';


console.log("connected");
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
const showChat = document.querySelector("#showChat");
const backButton = document.querySelector(".icon");
myVideo.muted = true;

backButton.addEventListener("click" , ()=>{
    document.querySelector(".main_left").style.display = "flex";
    document.querySelector(".main_left").style.flex = "1";
    document.querySelector(".main_right").style.display = "none";
    document.querySelector(".icon").style.display = "none";
});

showChat.addEventListener("click" , ()=>{
    document.querySelector(".main_right").style.display = "flex";
    document.querySelector(".main_right").style.flex = "1";
    document.querySelector(".main_left").style.display = "none";
    document.querySelector(".icon").style.display = "block";
});


// const user =  prompt("Enter Your Name ...");
const user =  "hema";


var peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: '3002'
  });

// var peer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})


peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
  });

//   console.log("Peer >>>>>>>>>" , peer.on('open', function(id) {
//     console.log('My peer ID is: ' + id);
//   }));



let myVideoStream ;

const addVideoStream = (video,stream)=>{
    video.srcObject = stream;
    console.log("video?>>>>>>>>>>>>" , video);

    video.addEventListener('loadedmetadata',()=>{
        video.play();
        videoGrid.append(video);
    });
};

navigator.mediaDevices
.getUserMedia({
    audio: true,
    video:true
})
.then((stream)=>{
    myVideoStream = stream;

    addVideoStream(myVideo,stream);
    console.log("addVideoStream >>>>>>>>>>." , addVideoStream(myVideo,stream));

    peer.on('call' , (call)=>{
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream' , (userVideoStream)=>{
            addVideoStream(video , userVideoStream);
        });
    });

    socket.on('user-connected' , (userId)=>{
        connectToNewUser(userId , stream);
    });
});

  

const connectToNewUser = (userId , stream) =>{
    const call = peer.call(userId , stream);
    const video = document.createElement('video');
    call.on('stream' , (userVideoStream)=>{
        addVideoStream(video , userVideoStream);
    });
};

peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id, user);
  });

// const addVideoStream = (video,stream)=>{
//     console.log(video);
//     video.srcObject = stream;
//     video.addEventListener('loadedmetadata',()=>{
//         video.play();
//         videoGrid.append(video);
//     });
// };

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener('click',(e)=>{
    // console.log(text.value);
    if(text.value.length !== 0){
        socket.emit('message' , text.value);
        text.value = "";   
    }
})

text.addEventListener('keydown' , (e)=>{
    // console.log(text.value);
    if(e.key ==="Enter" && text.value.length !==0){
        socket.emit('message' , text.value);
        text.value ="";
    }
})

const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");

muteButton.addEventListener('click',()=>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
   
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
      let  html = `<i class="fas fa-microphone-slash"></i>`;
        muteButton.classList.toggle('background__red');
        muteButton.innerHTML = html;
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
      let html = `<i class="fas fa-microphone"></i>`;
        muteButton.classList.toggle('background__red');
        muteButton.innerHTML = html;
    }
});

stopVideo.addEventListener('click' , ()=>{
  const enabled =  myVideoStream.getVideoTracks()[0].enabled;

    if(enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
       let html = `<i class="fas fa-video-slash"></i>`;
        stopVideo.classList.toggle('background__red');
        stopVideo.innerHTML = html;
    } else {
        myVideoStream.getVideoTracks()[0].enabled = true;
       let html = `<i class="fas fa-video"></i>`;
        stopVideo.classList.toggle('background__red');
        stopVideo.innerHTML = html;
    }
});

inviteButton.addEventListener('click' , (e)=>{
    prompt ("Copy This Invitation Link ", window.location.href);
})


socket.on("createMessage", (message, userName) => {
    messages.innerHTML =
      messages.innerHTML +
      `<div class="message">
          <b><i class="far fa-user-circle"></i> <span> ${
            userName === user ? "me" : userName
          }</span> </b>
          <span>${message}</span>
      </div>`;
    //   console.log('>>>>>>>>>',messages.innerHTML);
  });


// const socket = io("/");
// const videoGrid = document.getElementById("video-grid");
// const myVideo = document.createElement("video");
// const showChat = document.querySelector("#showChat");
// const backBtn = document.querySelector(".header__back");
// myVideo.muted = true;

// backBtn.addEventListener("click", () => {
//   document.querySelector(".main__left").style.display = "flex";
//   document.querySelector(".main__left").style.flex = "1";
//   document.querySelector(".main__right").style.display = "none";
//   document.querySelector(".header__back").style.display = "none";
// });

// showChat.addEventListener("click", () => {
//   document.querySelector(".main__right").style.display = "flex";
//   document.querySelector(".main__right").style.flex = "1";
//   document.querySelector(".main__left").style.display = "none";
//   document.querySelector(".header__back").style.display = "block";
// });

// const user = prompt("Enter your name");

// var peer = new Peer(undefined, {
//   path: "/peerjs",
//   host: "/",
//   port: "443",
// });

// let myVideoStream;
// navigator.mediaDevices
//   .getUserMedia({
//     audio: true,
//     video: true,
//   })
//   .then((stream) => {
//     myVideoStream = stream;
//     addVideoStream(myVideo, stream);

//     peer.on("call", (call) => {
//       call.answer(stream);
//       const video = document.createElement("video");
//       call.on("stream", (userVideoStream) => {
//         addVideoStream(video, userVideoStream);
//       });
//     });

//     socket.on("user-connected", (userId) => {
//       connectToNewUser(userId, stream);
//     });
//   });

// const connectToNewUser = (userId, stream) => {
//   const call = peer.call(userId, stream);
//   const video = document.createElement("video");
//   call.on("stream", (userVideoStream) => {
//     addVideoStream(video, userVideoStream);
//   });
// };

// peer.on("open", (id) => {
//   socket.emit("join-room", ROOM_ID, id, user);
// });

// const addVideoStream = (video, stream) => {
//   video.srcObject = stream;
//   video.addEventListener("loadedmetadata", () => {
//     video.play();
//     videoGrid.append(video);
//   });
// };

// let text = document.querySelector("#chat_message");
// let send = document.getElementById("send");
// let messages = document.querySelector(".messages");

// send.addEventListener("click", (e) => {
//   if (text.value.length !== 0) {
//     socket.emit("message", text.value);
//     text.value = "";
//   }
// });

// text.addEventListener("keydown", (e) => {
//   if (e.key === "Enter" && text.value.length !== 0) {
//     socket.emit("message", text.value);
//     text.value = "";
//   }
// });

// const inviteButton = document.querySelector("#inviteButton");
// const muteButton = document.querySelector("#muteButton");
// const stopVideo = document.querySelector("#stopVideo");
// muteButton.addEventListener("click", () => {
//   const enabled = myVideoStream.getAudioTracks()[0].enabled;
//   if (enabled) {
//     myVideoStream.getAudioTracks()[0].enabled = false;
//     html = `<i class="fas fa-microphone-slash"></i>`;
//     muteButton.classList.toggle("background__red");
//     muteButton.innerHTML = html;
//   } else {
//     myVideoStream.getAudioTracks()[0].enabled = true;
//     html = `<i class="fas fa-microphone"></i>`;
//     muteButton.classList.toggle("background__red");
//     muteButton.innerHTML = html;
//   }
// });

// stopVideo.addEventListener("click", () => {
//   const enabled = myVideoStream.getVideoTracks()[0].enabled;
//   if (enabled) {
//     myVideoStream.getVideoTracks()[0].enabled = false;
//     html = `<i class="fas fa-video-slash"></i>`;
//     stopVideo.classList.toggle("background__red");
//     stopVideo.innerHTML = html;
//   } else {
//     myVideoStream.getVideoTracks()[0].enabled = true;
//     html = `<i class="fas fa-video"></i>`;
//     stopVideo.classList.toggle("background__red");
//     stopVideo.innerHTML = html;
//   }
// });

// inviteButton.addEventListener("click", (e) => {
//   prompt(
//     "Copy this link and send it to people you want to meet with",
//     window.location.href
//   );
// });

// socket.on("createMessage", (message, userName) => {
//   messages.innerHTML =
//     messages.innerHTML +
//     `<div class="message">
//         <b><i class="far fa-user-circle"></i> <span> ${
//           userName === user ? "me" : userName
//         }</span> </b>
//         <span>${message}</span>
//     </div>`;
// });
