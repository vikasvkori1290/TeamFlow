import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { Excalidraw } from "@excalidraw/excalidraw";
import io from 'socket.io-client';
import { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VoiceChatControls } from "../components/VoiceChatControls";

// Only connect if we are likely to need it, or handle in component
const socket = io('http://localhost:5000', { autoConnect: false });

const CollabBoard = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);
    const isRemoteUpdate = useRef(false);

    // Voice Chat State
    const [voiceActive, setVoiceActive] = useState(false);
    // Initialize Agora Client
    const agoraClient = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));

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
                // Set flag to ignore the subsequent onChange event
                isRemoteUpdate.current = true;
                excalidrawAPI.updateScene({ elements });
                // Reset flag explicitly
                isRemoteUpdate.current = false;
            }
        };

        socket.on('whiteboard-update', handleUpdate);

        return () => {
            socket.off('whiteboard-update', handleUpdate);
            socket.disconnect();
        };
    }, [projectId, excalidrawAPI, isOffline]);

    const onChange = (elements, appState) => {
        if (isOffline) return;

        // Block echo/remote updates
        // If this change was triggered by our own updateScene call, ignore it.
        if (isRemoteUpdate.current) {
            return;
        }

        if (!elements || elements.length === 0) return;
        socket.emit('whiteboard-change', { projectId, elements, appState });
    };

    return (
        <AgoraRTCProvider client={agoraClient}>
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
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        {/* Voice Chat Toggle */}
                        {!isOffline && (
                            <>
                                {!voiceActive ? (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={() => setVoiceActive(true)}
                                        sx={{ borderRadius: 20 }}
                                    >
                                        Join Voice 🎙️
                                    </Button>
                                ) : (
                                    <VoiceChatControls
                                        projectId={projectId}
                                        onToggle={() => setVoiceActive(false)}
                                    />
                                )}
                            </>
                        )}

                        {!isOffline && (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={async () => {
                                    try {
                                        const storedUser = JSON.parse(localStorage.getItem('user'));
                                        const res = await fetch(`http://localhost:5000/api/projects/${projectId}/notify`, {
                                            method: 'POST',
                                            headers: { Authorization: `Bearer ${storedUser.token}` }
                                        });
                                        if (res.ok) alert("Team Notified!");
                                        else alert("Failed to notify");
                                    } catch (e) {
                                        console.error(e);
                                        alert("Error notifying team");
                                    }
                                }}
                                sx={{ color: '#00E5FF', borderColor: 'rgba(0, 229, 255, 0.5)' }}
                            >
                                Notify Team 🔔
                            </Button>
                        )}
                        <Typography variant="caption" style={{ color: isOffline ? "#FF9800" : "#00E5FF" }}>
                            {isOffline ? "Changes saved locally only" : "Live Sync Active"}
                        </Typography>
                    </div>
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
        </AgoraRTCProvider>
    );
};

export default CollabBoard;
