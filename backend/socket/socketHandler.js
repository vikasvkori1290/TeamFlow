const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join-room', (projectId) => {
            if (!projectId) return;
            const roomName = `project-${projectId}`;
            socket.join(roomName);

            // Broadcast member count
            const room = io.sockets.adapter.rooms.get(roomName);
            const count = room ? room.size : 0;
            io.to(roomName).emit('room-count', count);

            console.log(`Socket ${socket.id} joined room ${roomName} (Count: ${count})`);
        });

        socket.on('whiteboard-change', ({ projectId, elements, appState }) => {
            const roomName = `project-${projectId}`;
            // Broadcast to everyone ELSE in the room
            socket.to(roomName).emit('whiteboard-update', { elements, appState });
        });

        socket.on('disconnecting', () => {
            const rooms = socket.rooms;
            rooms.forEach(roomName => {
                if (roomName.startsWith('project-')) {
                    // The socket is still in the room, so size includes it. 
                    // After disconnect, it will decrease.
                    // But we want to notify "remaining".
                    // io.sockets.adapter.rooms.get(roomName).size includes the disconnecting socket.
                    const room = io.sockets.adapter.rooms.get(roomName);
                    const count = (room ? room.size : 1) - 1;
                    socket.to(roomName).emit('room-count', count);
                }
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

module.exports = socketHandler;
