import React, { useState, useEffect } from 'react';
import {
    useJoin,
    useLocalMicrophoneTrack,
    usePublish,
    useRemoteUsers,
    useRTCClient
} from "agora-rtc-react";
import { Box, Button, Typography, Avatar, Tooltip, Badge } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetIcon from '@mui/icons-material/Headset';
import StopIcon from '@mui/icons-material/Stop';

export const VoiceChatControls = ({ projectId, isParentActive, onToggle }) => {
    // We only use the hooks IF isParentActive is true, to avoid errors when not joined
    // Actually, 'useJoin' automatically joins if 'appid' etc are present. 
    // It's better to Wrap this in a component that only renders when "active".

    // Instead, we will handle the "Active" state in the parent or a wrapper. 
    // But for this simple version, let's assume this component is rendered ONLY when we want to be connected.

    const [appid, setAppId] = useState('');
    const [token, setToken] = useState('');
    const [channel, setChannel] = useState('');
    const [ready, setReady] = useState(false);

    // Fetch token on mount
    useEffect(() => {
        const fetchToken = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            try {
                const response = await fetch(`http://localhost:5000/api/agora/token?channelName=${projectId}`, {
                    headers: { Authorization: `Bearer ${storedUser.token}` },
                });
                const data = await response.json();
                if (data.token) {
                    setAppId(data.appId); // Ensure backend sends appId too, or use env
                    setToken(data.token);
                    setChannel(projectId);
                    setReady(true);
                }
            } catch (error) {
                console.error("Failed to fetch Agora token", error);
            }
        };
        fetchToken();
    }, [projectId]);

    return (
        <Box sx={{ p: 2, bgcolor: '#1E2538', borderRadius: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: '#aaa', mr: 2 }}>Voice Chat</Typography>

            {ready ? (
                <ConnectedVoiceSession
                    appid={appid}
                    token={token}
                    channel={channel}
                    onLeave={onToggle}
                />
            ) : (
                <Typography variant="caption" color="text.secondary">Initializing...</Typography>
            )}
        </Box>
    );
};

const ConnectedVoiceSession = ({ appid, token, channel, onLeave }) => {
    // Join the channel
    useJoin({ appid, token, channel, uid: null });

    // Local Mic
    const { localMicrophoneTrack } = useLocalMicrophoneTrack();
    const [micOn, setMicOn] = useState(true);

    // Publish local mic
    usePublish([localMicrophoneTrack]);

    const remoteUsers = useRemoteUsers();

    const toggleMic = () => {
        if (localMicrophoneTrack) {
            localMicrophoneTrack.setEnabled(!micOn);
            setMicOn(!micOn);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title={micOn ? "Mute" : "Unmute"}>
                <Button
                    variant={micOn ? "contained" : "outlined"}
                    color={micOn ? "primary" : "error"}
                    onClick={toggleMic}
                    sx={{ minWidth: 40, width: 40, height: 40, borderRadius: '50%', p: 0 }}
                >
                    {micOn ? <MicIcon /> : <MicOffIcon />}
                </Button>
            </Tooltip>

            <Tooltip title="Leave Voice">
                <Button
                    variant="outlined"
                    color="error"
                    onClick={onLeave}
                    sx={{ minWidth: 40, width: 40, height: 40, borderRadius: '50%', p: 0 }}
                >
                    <StopIcon />
                </Button>
            </Tooltip>

            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, gap: 1 }}>
                <Badge badgeContent={remoteUsers.length} color="success">
                    <HeadsetIcon sx={{ color: '#fff' }} />
                </Badge>
                <Typography variant="caption" sx={{ color: '#aaa' }}>
                    {remoteUsers.length} online
                </Typography>
            </Box>
        </Box>
    );
};
