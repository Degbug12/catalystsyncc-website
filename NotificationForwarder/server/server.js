const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Store connected devices
const connectedDevices = new Map();

// WebSocket connection handling
wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'register') {
                const deviceId = data.deviceId;
                connectedDevices.set(deviceId, ws);
                console.log(`Device registered: ${deviceId}`);
                
                ws.send(JSON.stringify({
                    type: 'registered',
                    deviceId: deviceId
                }));
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });
    
    ws.on('close', () => {
        // Remove device from connected devices
        for (const [deviceId, socket] of connectedDevices) {
            if (socket === ws) {
                connectedDevices.delete(deviceId);
                console.log(`Device disconnected: ${deviceId}`);
                break;
            }
        }
    });
});

// API endpoint to forward notifications
app.post('/api/forward/:deviceId', (req, res) => {
    const targetDeviceId = req.params.deviceId;
    const notificationData = req.body;
    
    console.log(`Forwarding notification to device: ${targetDeviceId}`);
    console.log('Notification data:', notificationData);
    
    const targetSocket = connectedDevices.get(targetDeviceId);
    
    if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
        targetSocket.send(JSON.stringify({
            type: 'notification',
            data: notificationData
        }));
        
        res.status(200).json({ message: 'Notification forwarded successfully' });
    } else {
        console.log(`Device ${targetDeviceId} not connected`);
        res.status(404).json({ error: 'Target device not connected' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        connectedDevices: connectedDevices.size,
        timestamp: new Date().toISOString()
    });
});

// Get connected devices
app.get('/api/devices', (req, res) => {
    const devices = Array.from(connectedDevices.keys());
    res.json({ devices });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Notification Forwarder Server running on port ${PORT}`);
    console.log(`WebSocket server ready for connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
