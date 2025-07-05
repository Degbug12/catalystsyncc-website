package com.notificationforwarder.sender

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class NotificationData(
    val appName: String,
    val packageName: String,
    val title: String,
    val text: String,
    val timestamp: Long
) : Parcelable
