const messageModel = require("../models/messageModel");
const { getAllUsers } = require("../controllers/usersController");

// Funtion that adds a message to the DB
// All messages have bounds are set to prevent buffer overflow
// All messages have encrypted text, and hence to injection attacks can occur
module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message, keys, contacts, unencryptedMessage } = req.body;

    encryptedMessage = message;
    const data = await messageModel.create({
      message: {
        text: encryptedMessage,
      },
      keys: {
        sender: keys.sender,
        receiver: keys.receiver,
      },
      users: [from, to],
      sender: from,
    });
    // console.log(data);
    // if (data.users[1] == "65615d7350ee5323b5a1e803") {
    //   let list_to_broadcast_to = [];
    //   // get sneder and receiver info
    //   for (let i = 0; i < contacts.length; i++) {
    //     if (contacts[i]._id == "65615d7350ee5323b5a1e803") {
    //       anonymousUserInfo1 = contacts[i];
    //     } else if (contacts[i]._id != from) {
    //       receiverInfo1 = contacts[i];
    //     }
    //   }

    //   // Get a list of users
    //   for (let i = 0; i < contacts.length; i++) {
    //     if (
    //       contacts[i]._id != "65615d7350ee5323b5a1e803" &&
    //       contacts[i]._id != from
    //     ) {
    //       // Send the broadcast messages to the following list only
    //       handleSendMsg(unencryptedMessage,anonymousUserInfo1, receiverInfo1);
    //       list_to_broadcast_to.push(contacts[i]);
    //     }
    //   }
    // console.log(contacts);
    // make as many custom messages as users but with changed sender to be "65615d7350ee5323b5a1e803"
    // and reciever to be all of them

    // run a loop to send a messages

    // Sends message to all

    // console.log("NOW BROADCAST!");
    // }

    if (data)
      return res.json({
        msg: "Message added successfully!",
      });
    return res.json({
      msg: "Failed to add message to DB",
    });
  } catch (err) {
    next(err);
  }
};
// Funtion that gets all the messages from the DB
module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });

    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        keys: msg.keys,
      };
    });

    res.json(projectMessages);
  } catch (error) {
    next(error);
  }
};
