const body = document.querySelector("body");
body.style.background = "grey";

// import { formatDistanceToNow, addSuffix} from 'date-fns'

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  serverTimestamp,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWdpfImR6WXtmqcPg6v5_rMB4sxZt1OEU",
  authDomain: "modern-javascript-b8397.firebaseapp.com",
  projectId: "modern-javascript-b8397",
  storageBucket: "modern-javascript-b8397.appspot.com",
  messagingSenderId: "583807993788",
  appId: "1:583807993788:web:1541df963b89448ac8cdb9",
  measurementId: "G-MN56E0Z0N3",
};

initializeApp(firebaseConfig);

//init service
const db = getFirestore();

//collection ref
const collect = collection(db, "Chat app");

//collection ref
getDocs(collect).then((snapshot) => {
  console.log(snapshot.docs);
});

// adding new chat document
//setting up a real-time listener to get new chats
//updating the username
//updating the room

class Chatroom {
  constructor(room, username) {
    this.room = room;
    this.username = username;
    this.chats = collection(db, "Chat app");
    this.unsub;
  }

  async addChat(message) {
    // format a chat object
    const now = new Date();
    const chat = {
      message,
      username: this.username,
      room: this.room,
      created_at: Timestamp.fromDate(now),
    };
    // save the chat document
    const response = await addDoc(this.chats, chat);
    return response;
  }

  getChat(callbackfunc) {
    this.unsub = onSnapshot(
      query(this.chats, where("room", "==", this.room), orderBy("created_at")),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added")
            //update the ui
            console.log(change.doc.data());
          callbackfunc(change.doc.data()); //data passed into the call back function
        });
      }
    );
  }
  async updateName(username) {
    this.username = username;
    localStorage.setItem("username", username);
  }

  updateRoom(room) {
    this.room = room;
    console.log("room unsubcribed");
    if (this.unsub) {
      this.unsub();
    }
  }
}

// DOM queries
const newChat = document.querySelector(".new-chat");

newChat.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = newChat.message.value.trim();
  console.log(message);

  chatroom
    .addChat(message)
    .then(() => {
      newChat.reset();
    })
    .catch((err) => console.log(err));
});

// update username
const newName = document.querySelector(".new-name");
const updateMessg = document.querySelector(".update-mssg");

newName.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = newName.name.value.trim();
  // console.log(name);

  chatroom
    .updateName(name)
    .then(() => {
      newName.reset();
    })
    .then(() => {
      updateMessg.innerHTML = `Username Updated: ${name}`;
      setTimeout(() => (updateMessg.innerHTML = ""), 3000);
    })
    .catch((err) => console.log(err));
});

// update chat room
const rooMS = document.querySelector(".chat-rooms");
console.log(rooMS);

rooMS.addEventListener("click", (e) => {
  // console.log(e);
  if (e.target.tagName === "BUTTON") {
    chatUI.clear();
    chatroom.updateRoom(e.target.getAttribute("id"));
    chatroom.getChat((data) => {
      console.log(data);
      chatUI.render(data);
    });
  }
});

// Check local storage
const getUsername = localStorage.username ? localStorage.username : "anon";

// chat instance
const chatroom = new Chatroom("friends", getUsername);

//get chats and render
chatroom.getChat((data) => {
  chatUI.render(data);
});
