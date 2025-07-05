package com.notificationforwarder.sender

import android.app.Service
import android.content.Intent
import android.content.SharedPreferences
import android.os.IBinder
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.Path

class NotificationForwardingService : Service() {
    private lateinit var sharedPreferences: SharedPreferences
    private val TAG = "ForwardingService"
    private val serviceScope = CoroutineScope(Dispatchers.IO)

    interface NotificationAPI {
        @POST("forward/{deviceId}")
        suspend fun forwardNotification(
            @Path("deviceId") deviceId: String,
            @Body notification: NotificationData
        ): retrofit2.Response<Void>
    }

    override fun onCreate() {
        super.onCreate()
        sharedPreferences = getSharedPreferences("notification_forwarder", MODE_PRIVATE)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notificationData = intent?.getParcelableExtra<NotificationData>("notification_data")
        
        if (notificationData != null) {
            forwardNotification(notificationData)
        }
        
        return START_NOT_STICKY
    }

    private fun forwardNotification(notificationData: NotificationData) {
        val serverUrl = sharedPreferences.getString("server_url", "")
        val deviceId = sharedPreferences.getString("device_id", "")
        
        if (serverUrl.isNullOrEmpty() || deviceId.isNullOrEmpty()) {
            Log.e(TAG, "Server URL or Device ID not configured")
            return
        }

        serviceScope.launch {
            try {
                val retrofit = Retrofit.Builder()
                    .baseUrl(serverUrl)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build()

                val api = retrofit.create(NotificationAPI::class.java)
                val response = api.forwardNotification(deviceId, notificationData)
                
                if (response.isSuccessful) {
                    Log.d(TAG, "Notification forwarded successfully")
                } else {
                    Log.e(TAG, "Failed to forward notification: ${response.code()}")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error forwarding notification", e)
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
}
