import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { Excalidraw } from "@excalidraw/excalidraw";
import io from 'socket.io-client';

// Only connect if we are likely to need it, or handle in component
const socket = io('http://localhost:5000', { autoConnect: false });

const CollabBoard = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);

    const isOffline = projectId === 'local';

    useEffect(() => {
        if (isOffline) {
            console.log("Offline Mode: Sockets disabled");
            return;
        }

        socket.connect();
        socket.emit('join-room', projectId);

        const handleUpdate = ({ elements }) => {
            if (excalidrawAPI && elements) {
                excalidrawAPI.updateScene({ elements });
            }
        };

        socket.on('whiteboard-update', handleUpdate);

        return () => {
            socket.off('whiteboard-update', handleUpdate);
            socket.disconnect();
        };
    }, [projectId, excalidrawAPI, isOffline]);

    const onChange = (elements, appState) => {
        if (isOffline || !elements || elements.length === 0) return;
        socket.emit('whiteboard-change', { projectId, elements, appState });
    };

    return (
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#121212" }}>
            {/* Header */}
            <div style={{
                height: "60px",
                backgroundColor: "#1E2538",
                borderBottom: "1px solid #333",
                display: "flex",
                alignItems: "center",
                padding: "0 20px",
                justifyContent: "space-between",
                color: "#fff",
                zIndex: 20,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Button onClick={() => navigate(-1)} style={{ color: "#fff" }}>← Back</Button>
                    <Typography variant="h6">
                        {isOffline ? "Personal Whiteboard (Offline)" : `TeamFlow Collab: ${projectId}`}
                    </Typography>
                </div>
                <Typography variant="caption" style={{ color: isOffline ? "#FF9800" : "#00E5FF" }}>
                    {isOffline ? "Changes saved locally only" : "Live Sync Active"}
                </Typography>
            </div>

            {/* Canvas Container */}
            <div style={{
                position: "absolute",
                top: "60px",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10
            }}>
                <Excalidraw
                    theme="dark"
                    excalidrawAPI={(api) => setExcalidrawAPI(api)}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default CollabBoard;
