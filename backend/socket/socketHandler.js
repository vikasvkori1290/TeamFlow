module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join-room', (projectId) => {
            if (!projectId) return;
            const roomName = `project-${projectId}`;
            socket.join(roomName);
            console.log(`Socket ${socket.id} joined room ${roomName}`);
        });

        socket.on('whiteboard-change', ({ projectId, elements, appState }) => {
            const roomName = `project-${projectId}`;
            // Broadcast to everyone ELSE in the room
            socket.to(roomName).emit('whiteboard-update', { elements, appState });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
