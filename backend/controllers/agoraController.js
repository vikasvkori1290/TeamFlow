const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const generateToken = (req, res) => {
    const { channelName } = req.query;
    if (!channelName) {
        return res.status(400).json({ error: 'channelName is required' });
    }

    // Get credentials from Environment Variables
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
        return res.status(500).json({ error: 'Agora credentials not configured in server' });
    }

    const uid = 0; // 0 means let Agora assign a UID for the client, or use user ID if preferred which must be int
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600; // 1 hr
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    try {
        const token = RtcTokenBuilder.buildTokenWithUid(
            appId,
            appCertificate,
            channelName,
            uid,
            role,
            privilegeExpiredTs
        );
        res.json({ token, appId });
    } catch (error) {
        console.error("Agora Token Generation Error:", error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
};

module.exports = { generateToken };
