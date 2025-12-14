const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
console.log("Checking .env at:", envPath);

if (fs.existsSync(envPath)) {
    console.log(".env file EXISTS");
    const envConfig = dotenv.parse(fs.readFileSync(envPath));

    // Check keys in the file directly (bypassing process.env for a moment)
    console.log("Direct File Read:");
    console.log("AGORA_APP_ID present:", !!envConfig.AGORA_APP_ID);
    console.log("AGORA_APP_ID length:", envConfig.AGORA_APP_ID ? envConfig.AGORA_APP_ID.length : 0);
    console.log("AGORA_APP_CERTIFICATE present:", !!envConfig.AGORA_APP_CERTIFICATE);
    console.log("AGORA_APP_CERTIFICATE length:", envConfig.AGORA_APP_CERTIFICATE ? envConfig.AGORA_APP_CERTIFICATE.length : 0);

} else {
    console.log(".env file does NOT exist");
}
