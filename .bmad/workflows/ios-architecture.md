# iOS Technical Architecture Blueprint: Hybrid Monk
**Owner:** Architect Agent (`.bmad/agents/architect.md`)  
**Sprint:** Sprint-2-iOS-Native-Parity  
**Target:** iOS 16.0+ (iPhone & Dynamic Island)

---

## 1. Executive Summary & iOS Paradigm
Building Hybrid Monk for iOS requires adapting Android-centric background execution patterns to Apple's strict sandboxed ecosystem and Human Interface Guidelines (HIG). This blueprint details how the 4 pillars achieve native parity on iOS.

```
                      ┌─────────────────────────────────┐
                      │    HYBRID MONK iOS TOPOLOGY     │
                      └────────────────┬────────────────┘
                                       │
     ┌───────────────────┬─────────────┴─────────────┬───────────────────┐
     ▼                   ▼                           ▼                   ▼
[CORE MOTION]     [AUDIO & NOTIF]             [APPLE HAPTICS]     [SCREEN TIME]
• CMMotionManager • UIBackgroundModes:audio   • UIImpactFeedback  • FamilyControls
• 20Hz Sampling   • UNNotificationRequest     • UINotification    • ManagedSettings
• Gait Peak Debounce (TimeSensitive Alarm)    • Tactile Spine     • ShieldConfiguration
```

---

## 2. Pillar Parity Specifications

### A. ROUTINE: iOS Action Alarms & Motion Gate
* **Challenge:** iOS forbids persistent arbitrary background daemons or `SYSTEM_ALERT_WINDOW` floating overlays.
* **Solution:**
  1. **Notification Layer:** Uses `UNNotificationRequest` with `UNNotificationInterruptionLevelTimeSensitive` (or `CriticalAlert` with Apple entitlement), delivering custom sound looping for the morning alarm.
  2. **CoreMotion Gait Sensing:** Binds to Apple's `CMMotionManager` via `expo-sensors/Accelerometer`. CoreMotion measures in units of $g$; we multiply by $9.80665\,\text{m/s}^2$ to feed the **Genuine Motion Tracker** with gravity cancellation.
  3. **Photo Gate:** In-memory AVFoundation camera capture proving wakefulness without cloud upload, fulfilling Apple's Privacy Manifest requirements.

### B. ROUTINE: Focus Protection ("Door, Not a Wall")
* **Challenge:** Android's `UsageStatsManager` / overlay does not exist on iOS.
* **Apple Native Solution:** **Screen Time API** (`FamilyControls`, `ManagedSettings`, and `DeviceActivityMonitor`).
  - `DeviceActivitySchedule`: Arms the monk focus window.
  - `ManagedSettingsStore.shield.applications`: Shields distracting bundle IDs (Instagram, TikTok, YouTube).
  - `ShieldConfigurationDataSource`: Customizes the iOS Shield screen with Hybrid Monk's monastic dark design and direct redirect triggers into the app.

### C. SADHNA: 33-Vertebra Tactile Spine & Breath Engine
* **Haptic Feedback:** Apple's Taptic Engine provides sensory immersion:
  - **Inhale Phase:** `UIImpactFeedbackGenerator(style: .light)` for gentle expansion.
  - **Hold Phase:** `UISelectionFeedbackGenerator` micro-tick.
  - **Exhale Phase:** `UIImpactFeedbackGenerator(style: .medium)` for grounding descent.
  - **Vertebra Ascension:** `UINotificationFeedbackGenerator(type: .success)` when completing a 90s sitting.
* **Background Audio:** Enabled `UIBackgroundModes: ["audio"]` in `Info.plist` to allow continuous acoustic bell/gong decay (VBT Verse 41) even if the screen turns off.

### D. MANOVIGYAN: Post-Session Drift Inquiry
* **Form & Interaction:** Native iOS bottom sheet modal with smooth spring curves matching iOS HIG.
* **Persistence:** Instant local write to `@react-native-async-storage/async-storage` followed by outbox enqueue to Supabase PostgREST.

---

## 3. iOS Bundle & Capabilities Checklist
* **Bundle ID:** `com.thehybridmonk.app`
* **Target OS:** iOS 16.0+
* **Info.plist Strings Added:**
  - `NSCameraUsageDescription`: *"Hybrid Monk uses the camera for waking action missions to verify wakefulness without cloud upload."*
  - `NSMotionUsageDescription`: *"Hybrid Monk uses motion sensors to detect genuine ambulatory steps for the morning action alarm."*
* **Background Modes:** `audio`, `fetch`, `remote-notification`
* **User Interface Style:** Locked to `dark` (`#0D0D0D`)
