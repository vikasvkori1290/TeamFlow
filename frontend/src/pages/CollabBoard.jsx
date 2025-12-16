import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, IconButton, Tooltip } from '@mui/material'; // Added IconButton, Tooltip
import { Excalidraw } from "@excalidraw/excalidraw";
import io from 'socket.io-client';
import { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Lock, LockOpen } from '@mui/icons-material'; // Added Icons
import { VoiceChatControls } from "../components/VoiceChatControls";
import API_BASE_URL from '../config';

// Only connect if we are likely to need it, or handle in component
const socket = io(API_BASE_URL, { autoConnect: false });

const CollabBoard = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);
    const isRemoteUpdate = useRef(false);

    // Permissions State
    const [isLeader, setIsLeader] = useState(false);
    const [collaborationOpen, setCollaborationOpen] = useState(false);

    // Member Count

    // Member Count
    const [memberCount, setMemberCount] = useState(0);

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

        const handleCount = (count) => {
            setMemberCount(count);
        };

        const handleCollabState = (isOpen) => {
            setCollaborationOpen(isOpen);
        };

        socket.on('whiteboard-update', handleUpdate);
        socket.on('room-count', handleCount);
        socket.on('collaboration-state', handleCollabState);

        // Fetch Project Details to check if leader
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${storedUser.token}` }
            })
                .then(res => res.json())
                .then(data => {
                    const userId = storedUser._id || storedUser.id;
                    const managerId = data.manager?._id || data.manager;
                    // Check logic: Manager or Creator is Leader
                    if (userId === managerId || userId === data.createdBy) {
                        setIsLeader(true);
                    }

                    // Load saved board if exists
                    if (data.whiteboardData && excalidrawAPI) {
                        excalidrawAPI.updateScene({
                            elements: data.whiteboardData.elements,
                            appState: data.whiteboardData.appState
                        });
                        console.log("Loaded saved whiteboard data");
                    }
                })
                .catch(console.error);
        }

        return () => {
            socket.off('whiteboard-update', handleUpdate);
            socket.off('room-count', handleCount);
            socket.off('collaboration-state', handleCollabState);
            socket.disconnect();
        };

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
                            {isOffline ? "Personal Whiteboard" : `TeamFlow: ${projectId}`}
                        </Typography>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        {/* Leader Controls */}
                        {!isOffline && isLeader && (
                            <Tooltip title={collaborationOpen ? "Lock Drawing (Leader Only)" : "Unlock Drawing for All"}>
                                <Button
                                    variant="contained"
                                    color={collaborationOpen ? "warning" : "success"}
                                    size="small"
                                    startIcon={collaborationOpen ? <LockOpen /> : <Lock />}
                                    onClick={() => {
                                        const newState = !collaborationOpen;
                                        setCollaborationOpen(newState);
                                        socket.emit('toggle-collaboration', { projectId, isOpen: newState });
                                    }}
                                >
                                    {collaborationOpen ? "Unlocked" : "Locked"}
                                </Button>
                            </Tooltip>
                        )}

                        {/* Status for Non-Leaders */}
                        {!isOffline && !isLeader && (
                            <Typography variant="caption" sx={{ color: collaborationOpen ? '#00E676' : '#FF5252', border: '1px solid', borderColor: collaborationOpen ? '#00E676' : '#FF5252', px: 1, borderRadius: 1 }}>
                                {collaborationOpen ? "Drawing Enabled" : "View Only Mode"}
                            </Typography>
                        )}

                        {/* Member Count Badge */}
                        {!isOffline && (
                            <div style={{
                                padding: "4px 10px",
                                backgroundColor: "rgba(255,255,255,0.1)",
                                borderRadius: "15px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                fontSize: "0.8rem"
                            }}>
                                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#00E676" }}></span>
                                {memberCount} Online
                            </div>
                        )}
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
                            <>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={async () => {
                                        if (!excalidrawAPI) return;
                                        const elements = excalidrawAPI.getSceneElements();
                                        const appState = excalidrawAPI.getAppState();
                                        const whiteboardData = { elements, appState };

                                        try {
                                            const storedUser = JSON.parse(localStorage.getItem('user'));
                                            const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/whiteboard`, {
                                                method: 'PUT',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    Authorization: `Bearer ${storedUser.token}`
                                                },
                                                body: JSON.stringify({ whiteboardData })
                                            });
                                            if (res.ok) alert("Board Saved successfully!");
                                            else alert("Failed to save board");
                                        } catch (e) {
                                            console.error(e);
                                            alert("Error saving board");
                                        }
                                    }}
                                    sx={{ color: '#00E676', borderColor: 'rgba(0, 230, 118, 0.5)', mr: 1 }}
                                >
                                    Save Board 💾
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={async () => {
                                        try {
                                            const storedUser = JSON.parse(localStorage.getItem('user'));
                                            const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/notify`, {
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
                            </>
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
                        viewModeEnabled={!isOffline && !isLeader && !collaborationOpen}
                        gridModeEnabled={true}
                    />
                </div>
            </div>
        </AgoraRTCProvider>
    );
};

export default CollabBoard;
