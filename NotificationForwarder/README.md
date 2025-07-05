# Notification Forwarder

A legitimate Android app to forward notifications from one device to another.

## Features
- Captures system notifications using NotificationListenerService
- Forwards notifications securely between your devices
- Filters notifications by app (WhatsApp, Instagram, etc.)
- Simple setup and configuration

## Components
1. **Sender App** - Installed on old phone to capture notifications
2. **Receiver App** - Installed on new phone to receive notifications
3. **Backend Service** - Simple relay server (optional - can use Firebase)

## Requirements
- Android 5.0+ (API 21)
- Notification Access Permission
- Internet connection

## Privacy & Security
- Only accesses notification metadata (title, text, app name)
- No message content interception
- Data encrypted in transit
- Works only with your own devices

## Setup Instructions
1. Build and install both apps
2. Grant notification access permission on sender device
3. Configure device pairing
4. Start forwarding notifications

## Legal Notice
This app is designed for legitimate personal use only. Users are responsible for ensuring compliance with local laws and platform terms of service.
