module.exports.chatSockets = function (socketServer) {
  let io = require("socket.io")(socketServer);

  io.sockets.on("connection", function (socket) {
    console.log("new connection received", socket.id);

    socket.on("disconnect", function () {
      console.log("socket disconnected!");
    });

    //responsing to request by user to join the chatroom
    socket.on("join_room", function(data){
        console.log("joining request received", data);
        //joining to chatroom that is codeial
        socket.join(data.chatroom);
        //emitting the notification i chatroom
        io.in(data.chatroom).emit("user_joined", data);
    });

    socket.on("send_message",function(data){
        io.in(data.chatroom).emit("receive_message", data);
    })
  });
};
