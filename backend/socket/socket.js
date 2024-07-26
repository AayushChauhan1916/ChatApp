const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const userDetails = require("../controller/userAuth/userDetails");
const validateToken = require("../utils/validateToken");
const User = require("../model/user");
const { Conversation, Message } = require("../model/conversation");
const sideBarConversation = require("../utils/socketSidebar");
const mongoose = require("mongoose");
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://chatapp-by-aayush-chauhan.onrender.com',
    methods: ['GET', 'POST'],
    credentials: true
}

});

app.use(cors({
  origin: 'https://chatapp-by-aayush-chauhan.onrender.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const onlineUser = new Set();

io.on("connection", async (socket) => {
  try {
    console.log("connect user", socket.id);

    const token = socket.handshake.auth.token;
    // console.log("token",token)

    let user;
    let result;
    if (token != null) {
      result = await validateToken(token);
      user = result.user;
    }

    if (result.success == true) {
      socket.join(user?._id.toString());

      // online User set
      if (token!= null && user && !onlineUser.has(user._id)) {
        onlineUser.add(user._id);
      }

      io.emit("onlineUser", Array.from(onlineUser));

      // message page user info
      socket.on("message-page", async (data) => {
        try {
          if (data.receiver) {
            const user = await User.findById(data.receiver).select("-password");
            if (!user) {
              return socket.emit("invalid-User", {
                message: "Invalid User or Path does not exist",
              });
            }
            if (user) {
              socket.emit("message-user", user);
              const previousConversation = await Conversation.findOne({
                $or: [
                  { sender: data.sender, receiver: data.receiver },
                  { receiver: data.sender, sender: data.receiver },
                ],
              }).populate("message");
              if (!previousConversation) {
                socket.emit("previousMessage", []);
              } else {
                socket.emit("previousMessage", previousConversation.message);
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      });

      // send and recieve message

      socket.on("send-message", async (data) => {
        // console.log(data)

        const isConversation = await Conversation.findOne({
          // first check is conversation exist or not
          $or: [
            { sender: data.sender, receiver: data.receiver },
            { sender: data.receiver, receiver: data.sender },
          ],
        }).populate("message");

        if (!isConversation) {
          // if not then create a new One
          const newConversation = new Conversation({
            sender: data.sender,
            receiver: data.receiver,
          });

          // creating message
          const newMessage = new Message({
            text: data?.text,
            imageUrl: data?.imageUrl,
            videoUrl: data?.videoUrl,
            sender: data?.sender,
            receiver: data?.receiver,
          });

          const message = await newMessage.save();

          newConversation.message.push(message);
          const saveConversation = await newConversation.save();

          const conversation = await Conversation.findById(
            saveConversation._id
          ).populate("message");

          // console.log(conversation)
          io.to(data?.sender).emit("messages", conversation.message);
          io.to(data?.receiver).emit("messages", conversation.message);

          const sidebarConversationSender = await sideBarConversation(
            data?.sender
          );
          const sidebarConversationreceiver = await sideBarConversation(
            data?.receiver
          );

          io.to(data?.sender).emit(
            "sidebarConversation",
            sidebarConversationSender
          );

          io.to(data?.receiver).emit(
            "sidebarConversation",
            sidebarConversationreceiver
          );
        } else {
          // if present push message in existing one

          const newMessage = new Message({
            text: data?.text,
            imageUrl: data?.imageUrl,
            videoUrl: data?.videoUrl,
            sender: data?.sender,
            receiver: data?.receiver,
          });

          const message = await newMessage.save();

          const conversation = await Conversation.findByIdAndUpdate(
            isConversation._id,
            {
              $push: { message: message?._id },
            },
            { new: true }
          ).populate("message");

          io.to(data?.sender).emit("messages", conversation.message);
          io.to(data?.receiver).emit("messages", conversation.message);

          const sidebarConversationSender = await sideBarConversation(
            data?.sender
          );
          const sidebarConversationreceiver = await sideBarConversation(
            data?.receiver
          );

          io.to(data?.sender).emit(
            "sidebarConversation",
            sidebarConversationSender
          );

          io.to(data?.receiver).emit(
            "sidebarConversation",
            sidebarConversationreceiver
          );
        }
      });

      // show chat on sidebar

      socket.on("sidebar", async (userId) => {
        const conversation = await sideBarConversation(userId);
        socket.emit("sidebarConversation", conversation);
      });

      // seen messages

      socket.on("seen", async (toWhomMsg) => {
        const conversation = await Conversation.findOne({
          $or: [
            { sender: user._id.toString(), receiver: toWhomMsg },
            { receiver: user._id.toString(), sender: toWhomMsg },
          ],
        });

        if (conversation) {
          const conversationMsgId = conversation.message || [];

          const updateMessages = await Message.updateMany(
            { _id: { $in: conversationMsgId }, sender: toWhomMsg },
            { $set: { seen: true } }
          );

          const sidebarConversationSender = await sideBarConversation(
            user?._id.toString()
          );
          const sidebarConversationreceiver = await sideBarConversation(
            toWhomMsg
          );

          io.to(user?._id.toString()).emit(
            "sidebarConversation",
            sidebarConversationSender
          );

          io.to(toWhomMsg).emit(
            "sidebarConversation",
            sidebarConversationreceiver
          );
        }
      });

      socket.on("disconnect", () => {
        // remove disconnect User from online set
        onlineUser.delete(user?._id);
        io.emit("onlineUser", Array.from(onlineUser));
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  app,
  server,
};
