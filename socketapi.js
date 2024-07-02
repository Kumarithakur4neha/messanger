const io = require( "socket.io" )();
const socketapi = {
    io: io
};
const messageModel=require('./models/message')
const userModel = require('./models/schema')

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    console.log( "A user connected" );

    socket.on('join', async username => {
        await userModel.findOneAndUpdate({
            username
        }, {
            socketId: socket.id
        })    })

        socket.on('disconnect', async () => {

            await userModel.findOneAndUpdate({
                socketId: socket.id //in data base it diiconnect the user who is not currently online in the data base
            }, {
                socketId: ""
            })
    
        })

        socket.on("sony",async messagObject =>{   //4 recive

            await  messageModel.create({
               receiver:messagObject.receiver,
               sender:messagObject.sender,
               text: messagObject.text
            })   

            const sender=await userModel.findOne({
                username:messagObject.sender
            })

            const receiver=await userModel.findOne({
                username:messagObject.receiver
            })
            
            const messagePacket={
                sender:sender,
                receiver:receiver,
                text:messagObject.text   //two send msg from  backend to front end
            }

            socket.to(receiver.socketId).emit('max',messagePacket)  //5)receiver recieve
        })

});
// end of socket.io logic



module.exports = socketapi;


//https://cdnjs.com/libraries/axios