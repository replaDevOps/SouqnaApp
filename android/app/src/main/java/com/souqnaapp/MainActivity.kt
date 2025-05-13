package com.souqnaapp

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "SouqnaApp"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
        /**
   * Override onCreate method to handle deep link.
   */
  override fun onCreate(savedInstanceState: android.os.Bundle?) {
    super.onCreate(savedInstanceState)
    
    // Handle deep link
    val data: Uri? = intent.data
    if (data != null && data.scheme == "myapp" && data.host == "product") {
        // Extract the product ID from the deep link (e.g., myapp://product/a05c69da-97d8-41e9-a365-9b2ac098b911)
        val productId = data.lastPathSegment
        
        // Pass the productId to React Native via the intent
        val intent = Intent(this, MainActivity::class.java)
        intent.putExtra("productId", productId)
        startActivity(intent)
    }
  }
}
