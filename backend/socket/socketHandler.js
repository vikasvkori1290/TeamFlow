const socketHandler = (io) => {
    // Keep track of room states in memory (e.g., { "project-123": { collaborationOpen: false } })
    const roomStates = {};

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

            // Send current collaboration state to the joining user
            const currentState = roomStates[roomName] || { collaborationOpen: false };
            socket.emit('collaboration-state', currentState.collaborationOpen);

            console.log(`Socket ${socket.id} joined room ${roomName} (Count: ${count})`);
        });

        socket.on('toggle-collaboration', ({ projectId, isOpen }) => {
            const roomName = `project-${projectId}`;
            // Update state
            if (!roomStates[roomName]) roomStates[roomName] = {};
            roomStates[roomName].collaborationOpen = isOpen;

            // Broadcast to room
            io.to(roomName).emit('collaboration-state', isOpen);
            console.log(`Room ${roomName} collaboration set to ${isOpen}`);
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
