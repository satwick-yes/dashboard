const { spawn } = require('child_process');

console.log("==========================================");
console.log("   GUSTOSA FOOD WHATSAPP DASHBOARD START");
console.log("==========================================\n");

// Start Next.js
console.log("🚀 Starting Next.js server...");
const nextjs = spawn('npm', ['run', 'dev'], { shell: true, stdio: 'pipe' });

nextjs.stdout.on('data', (data) => {
    if (data.toString().includes('Ready in') || data.toString().includes('started server') || data.toString().includes('Local:')) {
        console.log("✅ Next.js is running at http://localhost:3000");
    }
});
nextjs.stderr.on('data', (data) => {}); // Ignore Next.js stderr to keep console clean

// Start Cloudflare Tunnel
console.log("🌐 Starting Cloudflare Tunnel (Please wait 5-10 seconds)...");
const cloudflared = spawn('npx', ['--yes', 'cloudflared', 'tunnel', '--url', 'http://localhost:3000'], { shell: true, stdio: 'pipe' });

cloudflared.stderr.on('data', (data) => {
    const output = data.toString();
    const urlMatch = output.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (urlMatch) {
        console.log("\n=======================================================");
        console.log("🎉 ALL SYSTEMS ONLINE! COPY THESE TO META DASHBOARD:");
        console.log("=======================================================");
        console.log(`\nWebhook URL:  ${urlMatch[0]}/api/whatsapp`);
        console.log(`Verify Token: gustosa_secret_webhook_verify_token_2026`);
        console.log("\n👉 Your dashboard is live at: http://localhost:3000");
        console.log("=======================================================\n");
        console.log("Press Ctrl+C to stop both servers when you are done.");
    }
});
cloudflared.stdout.on('data', (data) => {}); // cloudflared outputs to stderr

process.on('SIGINT', () => {
    nextjs.kill();
    cloudflared.kill();
    process.exit();
});
