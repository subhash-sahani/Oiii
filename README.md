**Note**: This project is still under development.

# Oiii - WhatsApp Notification Visualizer

Oiii is a React Native application built on Linux (Ubuntu) that hooks into native Android system events to detect and parse incoming WhatsApp notifications. This project serves as the foundational data pipeline for a responsive, context-aware character animation engine (currently in progress).

---

## 🚀 Project Status: Work In Progress (WIP)
- [x] **Notification Listener Service:** Successfully intercepts and extracts incoming WhatsApp notifications.
- [ ] **Character Animation Engine:** Designing interactive visual components that respond to notification text and metadata *(In Progress)*.

---

## 🛠️ Tech Stack & Environment

- **Framework:** React Native (JavaScript)
- **Build System:** Gradle (Targeting SDK 34 / NDK 25+)
- **Development OS:** Ubuntu Linux
- **Target Device:** Android (Tested on clean, stock Android hardware)

---

## 📋 Prerequisites & Local Setup

To compile and run this project locally, ensure your development environment is mapped out correctly.

### 1. Java Development Kit (JDK)
The Android build pipeline requires JDK 17. Configure your path variables:
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

## 2. Isolated Android SDK Environment
This project uses a clean, user-level Android SDK path instead of global system packages to manage licenses and dependencies safely:

Bash
# Set your SDK home directory
export ANDROID_HOME=$HOME/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
📦 Installation
Clone the Repository:

```Bash
git clone [https://github.com/subhash-sahani/Oiii.git](https://github.com/subhash-sahani/Oiii.git)
cd Oiii
```
Install JavaScript Dependencies:

```Bash
npm install
```
Configure Android Build Properties:
Create a local.properties file inside the android folder to explicitly point Gradle to your local SDK:

```Bash
echo "sdk.dir=/home/$USER/android-sdk" > android/local.properties
```
Prepare Your Stock Test Device:

Go to Settings > About Phone and tap Build Number 7 times to unlock Developer Options.

Navigate to System > Developer Options and enable USB Debugging.

Connect the device to your computer via USB and accept the RSA debugging prompt on the phone screen.

## 🏃‍♂️ Running the App
Navigate to the native Android directory, grant execution permissions to the build wrapper, clear previous caches, and launch the installer:

```Bash
# Move to the native layer
cd android
```
### Grant execution rights to the Gradle wrapper
chmod +x gradlew

### Clean old compilation artifacts
./gradlew clean

### Build and flash the debug APK to your device
```
cd ..
npx react-native run-android
```
## 📂 Project Architecture
Oiii/
├── android/               # Native Android configuration & build scripts
│   ├── app/               # Main application package wrapper
│   └── build.gradle       # Defines NDK and SDK parameters
├── src/                   # Core JavaScript application logic
│   └── services/          # Active notification background listener logic
├── App.js                 # Application entry point
└── package.json           # Node modules and dependency scripts
## 🤝 Contributing
Feel free to open an issue or submit a pull request if you want to help optimize the background notification listener or collaborate on the upcoming animation rendering state machine.
