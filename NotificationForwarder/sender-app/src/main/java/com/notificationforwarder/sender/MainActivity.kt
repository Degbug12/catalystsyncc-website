package com.notificationforwarder.sender

import android.content.ComponentName
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.provider.Settings
import android.text.TextUtils
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.notificationforwarder.sender.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var sharedPreferences: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sharedPreferences = getSharedPreferences("notification_forwarder", MODE_PRIVATE)

        setupUI()
        checkPermissions()
    }

    private fun setupUI() {
        binding.btnEnableNotifications.setOnClickListener {
            openNotificationSettings()
        }

        binding.btnSaveSettings.setOnClickListener {
            saveSettings()
        }

        binding.switchWhatsapp.isChecked = sharedPreferences.getBoolean("whatsapp_enabled", true)
        binding.switchInstagram.isChecked = sharedPreferences.getBoolean("instagram_enabled", true)
        binding.etServerUrl.setText(sharedPreferences.getString("server_url", ""))
        binding.etDeviceId.setText(sharedPreferences.getString("device_id", ""))
    }

    private fun checkPermissions() {
        val isEnabled = isNotificationServiceEnabled()
        binding.tvStatus.text = if (isEnabled) {
            "✅ Notification access granted"
        } else {
            "❌ Notification access required"
        }
        
        binding.btnEnableNotifications.isEnabled = !isEnabled
    }

    private fun isNotificationServiceEnabled(): Boolean {
        val pkgName = packageName
        val flat = Settings.Secure.getString(
            contentResolver,
            "enabled_notification_listeners"
        )
        if (!TextUtils.isEmpty(flat)) {
            val names = flat.split(":".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()
            for (name in names) {
                val componentName = ComponentName.unflattenFromString(name)
                val nameMatch = TextUtils.equals(pkgName, componentName?.packageName)
                if (nameMatch) {
                    return true
                }
            }
        }
        return false
    }

    private fun openNotificationSettings() {
        val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
        startActivity(intent)
    }

    private fun saveSettings() {
        val editor = sharedPreferences.edit()
        editor.putBoolean("whatsapp_enabled", binding.switchWhatsapp.isChecked)
        editor.putBoolean("instagram_enabled", binding.switchInstagram.isChecked)
        editor.putString("server_url", binding.etServerUrl.text.toString())
        editor.putString("device_id", binding.etDeviceId.text.toString())
        editor.apply()

        Toast.makeText(this, "Settings saved", Toast.LENGTH_SHORT).show()
    }

    override fun onResume() {
        super.onResume()
        checkPermissions()
    }
}
