package com.notificationforwarder.sender

import android.content.Intent
import android.content.SharedPreferences
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

class NotificationListenerService : NotificationListenerService() {
    private lateinit var sharedPreferences: SharedPreferences
    private val TAG = "NotificationListener"

    override fun onCreate() {
        super.onCreate()
        sharedPreferences = getSharedPreferences("notification_forwarder", MODE_PRIVATE)
        Log.d(TAG, "Notification Listener Service created")
    }

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        super.onNotificationPosted(sbn)
        
        val packageName = sbn.packageName
        val notification = sbn.notification
        
        // Check if we should forward this notification
        if (!shouldForwardNotification(packageName)) {
            return
        }

        // Extract notification data
        val title = notification.extras.getString("android.title") ?: ""
        val text = notification.extras.getString("android.text") ?: ""
        val appName = getAppName(packageName)
        
        Log.d(TAG, "Notification from $appName: $title - $text")
        
        // Create notification data object
        val notificationData = NotificationData(
            appName = appName,
            packageName = packageName,
            title = title,
            text = text,
            timestamp = System.currentTimeMillis()
        )
        
        // Forward the notification
        forwardNotification(notificationData)
    }

    private fun shouldForwardNotification(packageName: String): Boolean {
        return when (packageName) {
            "com.whatsapp" -> sharedPreferences.getBoolean("whatsapp_enabled", true)
            "com.instagram.android" -> sharedPreferences.getBoolean("instagram_enabled", true)
            else -> false
        }
    }

    private fun getAppName(packageName: String): String {
        return when (packageName) {
            "com.whatsapp" -> "WhatsApp"
            "com.instagram.android" -> "Instagram"
            else -> packageName
        }
    }

    private fun forwardNotification(notificationData: NotificationData) {
        val intent = Intent(this, NotificationForwardingService::class.java)
        intent.putExtra("notification_data", notificationData)
        startService(intent)
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        super.onNotificationRemoved(sbn)
        // Handle notification removal if needed
    }
}
