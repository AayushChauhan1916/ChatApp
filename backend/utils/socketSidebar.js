const { Conversation } = require("../model/conversation");

const sideBarConversation = async (userId) => {
  // console.log(userId)
  try {
    if (userId) {
      const findExistingconversation = await Conversation.find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
        .sort({ updatedAt: -1 })
        .populate([
          { path: "message" },
          { path: "sender", select: "-password" },
          { path: "receiver", select: "-password" },
        ]);

      const conversation = findExistingconversation.map((conv) => {
        const unseenMsgCount = conv?.message?.reduce((prev, curr) => {
          if(curr.sender != userId){
            return prev + (curr.seen ? 0 : 1);
          }    
          return prev
        }, 0);
        return {
          _id: conv?._id,
          sender: conv?.sender,
          receiver: conv?.receiver,
          unSeen: unseenMsgCount,
          lstMsg: conv.message[conv?.message?.length - 1],
        };
      });

      return conversation;
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = sideBarConversation;
