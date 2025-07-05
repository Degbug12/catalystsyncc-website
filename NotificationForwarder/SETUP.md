# Notification Forwarder Setup Guide

## Overview
This project creates a legitimate notification forwarding system between two Android devices using:
- **Sender App**: Captures notifications on your old device
- **Receiver App**: Receives notifications on your new device  
- **Server**: Relays notifications between devices

## Prerequisites
- Android Studio (latest version)
- Node.js (v14+)
- Two Android devices (API 21+)
- Internet connection on both devices

## Server Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   Server runs on port 3000 by default.

3. **For development (auto-restart):**
   ```bash
   npm run dev
   ```

4. **Deploy to cloud (optional):**
   - Deploy to Heroku, Railway, or similar service
   - Update server URL in both apps

## Android Apps Setup

### Building the Apps

1. **Open Android Studio**
2. **Import sender-app project**
3. **Build and install on old device**
4. **Import receiver-app project** 
5. **Build and install on new device**

### Sender App Configuration

1. **Grant notification access:**
   - Open app on old device
   - Tap "Enable Notification Access"
   - Find app in settings and enable

2. **Configure settings:**
   - Enter server URL (e.g., `http://your-server.com/api/`)
   - Set unique device ID (e.g., `receiver-device-1`)
   - Enable WhatsApp/Instagram forwarding
   - Save settings

### Receiver App Configuration

1. **Connect to server:**
   - Enter same server URL
   - Use same device ID as configured in sender
   - Tap "Connect"

## Usage

1. **Start both apps**
2. **Ensure both devices have internet**
3. **Notifications from WhatsApp/Instagram on old device will appear on new device**

## Security Notes

- Only notification metadata is forwarded (no message content)
- Use HTTPS in production
- Consider adding authentication for server
- Data is encrypted in transit

## Troubleshooting

### Notifications not forwarding:
- Check notification access permission
- Verify server URL and device ID match
- Check internet connection
- Look at app logs

### Server connection issues:
- Ensure server is running
- Check firewall settings
- Verify URL format

### Permission denied:
- Re-grant notification access
- Restart sender app
- Check Android security settings

## Customization

### Adding more apps:
Edit `NotificationListenerService.kt`:
```kotlin
private fun shouldForwardNotification(packageName: String): Boolean {
    return when (packageName) {
        "com.whatsapp" -> sharedPreferences.getBoolean("whatsapp_enabled", true)
        "com.instagram.android" -> sharedPreferences.getBoolean("instagram_enabled", true)
        "com.telegram" -> sharedPreferences.getBoolean("telegram_enabled", true) // Add this
        else -> false
    }
}
```

### Changing notification format:
Modify the `NotificationData` class and server handling.

## Legal Compliance

- ✅ Uses official Android NotificationListenerService API
- ✅ Only accesses notification metadata, not content
- ✅ Requires explicit user permission
- ✅ Works only with user's own devices
- ✅ No third-party app reverse engineering

## Support

For issues or questions:
1. Check logs in Android Studio
2. Test server connectivity
3. Verify permissions are granted
4. Review setup steps
