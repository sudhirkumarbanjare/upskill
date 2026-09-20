# 5Upskill — End-to-End Production Launch Playbook

An exhaustive, sequence-by-sequence production deployment checklist and command-line guide for all 3 apps (**Student**, **Client**, and **Admin**) across **Keystore Signing**, **Firebase**, **Google Cloud Platform (GCP)**, and the **Google Play Console**.

---

## 📋 Table of Contents
1. [Phase 1: Production Keystore Generation & Fingerprint Extraction](#phase-1-production-keystore-generation--fingerprint-extraction)
2. [Phase 2: Firebase & GCP Project Provisioning](#phase-2-firebase--gcp-project-provisioning)
3. [Phase 3: Deploying Firestore Rules, Indexes & Storage Security](#phase-3-deploying-firestore-rules-indexes--storage-security)
4. [Phase 4: Android Release Gradle & Proguard / R8 Configuration](#phase-4-android-release-gradle--proguard--r8-configuration)
5. [Phase 5: Building Production Android App Bundles (.aab)](#phase-5-building-production-android-app-bundles-aab)
6. [Phase 6: Google Play Console Configuration & Compliance](#phase-6-google-play-console-configuration--compliance)
7. [Phase 7: Internal Testing & Live Device Sanity Checks](#phase-7-internal-testing--live-device-sanity-checks)
8. [Phase 8: Production Rollout & Remote Version Control](#phase-8-production-rollout--remote-version-control)

---

## Phase 1: Production Keystore Generation & Fingerprint Extraction

> [!IMPORTANT]
> Never commit `.keystore` or `.jks` files or their passwords to version control. Keep backups in a secure password manager or secret vault.

### 1.1 Generate Dedicated Production Release Keystores

Run the following commands to generate dedicated 2048-bit RSA release keystores for each app:

```bash
# 1. Student App Keystore
keytool -genkeypair -v \
  -keystore apps/student/android/app/student-release-key.keystore \
  -alias student-release-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "YOUR_SECURE_PASSWORD" \
  -keypass "YOUR_SECURE_PASSWORD" \
  -dname "CN=5Upskill Student, OU=Mobile, O=5Upskill, L=Bengaluru, ST=Karnataka, C=IN"

# 2. Client App Keystore
keytool -genkeypair -v \
  -keystore apps/client/android/app/client-release-key.keystore \
  -alias client-release-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "YOUR_SECURE_PASSWORD" \
  -keypass "YOUR_SECURE_PASSWORD" \
  -dname "CN=5Upskill Client, OU=Mobile, O=5Upskill, L=Bengaluru, ST=Karnataka, C=IN"

# 3. Admin App Keystore
keytool -genkeypair -v \
  -keystore apps/admin/android/app/admin-release-key.keystore \
  -alias admin-release-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "YOUR_SECURE_PASSWORD" \
  -keypass "YOUR_SECURE_PASSWORD" \
  -dname "CN=5Upskill Admin, OU=Mobile, O=5Upskill, L=Bengaluru, ST=Karnataka, C=IN"
```

### 1.2 Extract SHA-1 & SHA-256 Fingerprints for Firebase Phone Auth

Firebase Phone Authentication and Google Play Integrity require the exact SHA-1 and SHA-256 certificate fingerprints:

```bash
# Student App Fingerprints
keytool -list -v -keystore apps/student/android/app/student-release-key.keystore -alias student-release-key -storepass "YOUR_SECURE_PASSWORD"

# Client App Fingerprints
keytool -list -v -keystore apps/client/android/app/client-release-key.keystore -alias client-release-key -storepass "YOUR_SECURE_PASSWORD"

# Admin App Fingerprints
keytool -list -v -keystore apps/admin/android/app/admin-release-key.keystore -alias admin-release-key -storepass "YOUR_SECURE_PASSWORD"
```

*Note down the SHA-1 and SHA-256 fingerprints for each app.*

---

## Phase 2: Firebase & GCP Project Provisioning

### 2.1 Authenticate Firebase CLI

```bash
# Login to your production Firebase / Google Cloud account
npx -y firebase-tools@latest login

# Verify active project
npx -y firebase-tools@latest projects:list
```

### 2.2 Create & Configure the 3 Android Apps in Firebase Console

1. Navigate to **[Firebase Console](https://console.firebase.google.com/)** -> Select or Create Project `upskill-prod` (or your project ID).
2. Go to **Project Settings** -> **General** -> **Your Apps** -> Click **Add App (Android)**.
3. Register the 3 package names:
   - **Student App**: `com.upskill.student`
   - **Client App**: `com.upskill.client`
   - **Admin App**: `com.upskill.admin`
4. Add the **SHA-1** and **SHA-256** release fingerprints extracted in Phase 1 (as well as your debug fingerprints for local testing).
5. Download each respective `google-services.json` file and place them in their respective android app directories:
   - `apps/student/android/app/google-services.json`
   - `apps/client/android/app/google-services.json`
   - `apps/admin/android/app/google-services.json`

### 2.3 Enable Firebase Authentication & SMS Phone Provider

1. Go to **Firebase Console** -> **Build** -> **Authentication** -> **Sign-in method**.
2. Enable **Phone** authentication.
3. In **Settings** -> **Authorized domains**, ensure your web endpoints and domains are whitelisted.
4. *(Optional for Testing)* Add test phone numbers (e.g. `+91 9900000001` with OTP `123456`) under **Phone numbers for testing** so you don't exhaust SMS quotas during Play Store review.

### 2.4 Enable Google Cloud APIs

Navigate to **[Google Cloud Console](https://console.cloud.google.com/)** for your Firebase project and ensure the following APIs are enabled:

```bash
gcloud services enable \
  identitytoolkit.googleapis.com \
  firestore.googleapis.com \
  firebasestorage.googleapis.com \
  fcm.googleapis.com \
  playintegrity.googleapis.com \
  androidpublisher.googleapis.com \
  --project="YOUR_FIREBASE_PROJECT_ID"
```

---

## Phase 3: Deploying Firestore Rules, Indexes & Storage Security

Deploy the production-grade rules and composite indexes already configured in the repo:

```bash
# 1. Switch to production Firebase project
npx -y firebase-tools@latest use <YOUR_FIREBASE_PROJECT_ID>

# 2. Deploy Firestore security rules
npx -y firebase-tools@latest deploy --only firestore:rules

# 3. Deploy Firestore composite indexes
npx -y firebase-tools@latest deploy --only firestore:indexes

# 4. Deploy Cloud Storage security rules
npx -y firebase-tools@latest deploy --only storage
```

### 3.1 Initialize System Version Config in Firestore

Seed the `system_config/app_versions` document required for remote force-update management:

```bash
# You can execute via Firebase Console Firestore GUI or via Node script:
# Document Path: system_config/app_versions
# Data:
{
  "student": {
    "minVersion": "1.0.0",
    "latestVersion": "1.0.0",
    "forceUpdate": false,
    "storeUrl": "https://play.google.com/store/apps/details?id=com.upskill.student",
    "releaseNotes": "Initial production release."
  },
  "client": {
    "minVersion": "1.0.0",
    "latestVersion": "1.0.0",
    "forceUpdate": false,
    "storeUrl": "https://play.google.com/store/apps/details?id=com.upskill.client",
    "releaseNotes": "Initial production release."
  },
  "admin": {
    "minVersion": "1.0.0",
    "latestVersion": "1.0.0",
    "forceUpdate": false,
    "storeUrl": "https://play.google.com/store/apps/details?id=com.upskill.admin",
    "releaseNotes": "Initial production release."
  }
}
```

---

## Phase 4: Android Release Gradle & Proguard / R8 Configuration

Configure environment variables or `~/.gradle/gradle.properties` on your build machine:

### 4.1 Global Gradle Properties (`~/.gradle/gradle.properties`)

```properties
UPSKILL_RELEASE_STORE_PASSWORD=YOUR_SECURE_PASSWORD
UPSKILL_RELEASE_KEY_PASSWORD=YOUR_SECURE_PASSWORD
```

### 4.2 Update `android/app/build.gradle` for Each App

Ensure each app's `android/app/build.gradle` defines the release signing configuration:

```groovy
signingConfigs {
    debug {
        storeFile file('debug.keystore')
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
    release {
        if (project.hasProperty('UPSKILL_RELEASE_STORE_PASSWORD')) {
            storeFile file('student-release-key.keystore') // or client-release-key / admin-release-key
            storePassword project.property('UPSKILL_RELEASE_STORE_PASSWORD')
            keyAlias 'student-release-key'                 // or client-release-key / admin-release-key
            keyPassword project.property('UPSKILL_RELEASE_KEY_PASSWORD')
        }
    }
}
buildTypes {
    debug {
        signingConfig signingConfigs.debug
    }
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
    }
}
```

---

## Phase 5: Building Production Android App Bundles (.aab)

> [!NOTE]
> Google Play requires Android App Bundles (`.aab`) rather than standalone APKs for all new app submissions.

### 5.1 Clean & Build Student App Bundle

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH=$HOME/.nvm/versions/node/v24.18.0/bin:$PATH

cd apps/student/android
./gradlew clean
./gradlew bundleRelease

# Output bundle:
# apps/student/android/app/build/outputs/bundle/release/app-release.aab
cd ../../..
```

### 5.2 Clean & Build Client App Bundle

```bash
cd apps/client/android
./gradlew clean
./gradlew bundleRelease

# Output bundle:
# apps/client/android/app/build/outputs/bundle/release/app-release.aab
cd ../../..
```

### 5.3 Clean & Build Admin App Bundle

```bash
cd apps/admin/android
./gradlew clean
./gradlew bundleRelease

# Output bundle:
# apps/admin/android/app/build/outputs/bundle/release/app-release.aab
cd ../../..
```

---

## Phase 6: Google Play Console Configuration & Compliance

### 6.1 Create 3 Applications in Play Console
1. Go to **[Google Play Console](https://play.google.com/console)**.
2. Click **Create app** for each:
   - **App 1**: `5Upskill: Learn & Earn Projects` (Package: `com.upskill.student`, Category: Education / Business)
   - **App 2**: `5Upskill for Clients: Hire Talent` (Package: `com.upskill.client`, Category: Business)
   - **App 3**: `5Upskill Admin Console` (Package: `com.upskill.admin`, Category: Business, Access: Restricted Internal)

### 6.2 App Content & Policy Checklist
For each app, complete all mandatory questionnaire sections:
- [ ] **Privacy Policy**: Host a valid URL (e.g. `https://5upskill.com/privacy`).
- [ ] **App Access**: Provide demo credentials / test phone numbers (`+91 9900000001` with OTP `123456`).
- [ ] **Ads**: Declare whether the app contains ads (Select "No").
- [ ] **Content Ratings**: Complete the IARC questionnaire.
- [ ] **Target Audience & Content**: Specify age 18+ (Education & Employment).
- [ ] **Data Safety Form**:
  - Personal info collected: Name, Phone number, Email (for Account Management & Auth).
  - Storage / Photos: Optional file upload for project demo / deliverables.
  - Data encrypted in transit: Yes (HTTPS / TLS).
  - Account deletion request mechanism: Provide URL (e.g. `https://5upskill.com/delete-account`).
- [ ] **Financial Features / Government Apps**: Declare non-government.

### 6.3 Store Listing Graphic Assets
Prepare and upload high-resolution graphical assets for each app:
- **App Icon**: 512 x 512 px PNG (32-bit with alpha).
- **Feature Graphic**: 1024 x 500 px JPEG or 24-bit PNG (no alpha).
- **Phone Screenshots**: Minimum 4 screenshots (1080 x 2400 px or 1440 x 3040 px) showcasing dark mode UI, SVG icons, and core workflows.
- **Short Description**: Max 80 characters.
- **Full Description**: Max 4000 characters.

---

## Phase 7: Internal Testing & Live Device Sanity Checks

### 7.1 Upload AAB to Internal Testing Track
1. Navigate to **Testing** -> **Internal testing** in Play Console.
2. Click **Create new release**.
3. Upload `app-release.aab`.
4. Add release notes.
5. Create an **Email List** of internal testers and share the join link.

### 7.2 Play App Signing SHA Fingerprints in Firebase
Google Play re-signs your app with the **Google Play App Signing Key**:
1. In Play Console -> **Setup** -> **App Integrity** -> **App Signing**.
2. Copy the **SHA-1** and **SHA-256** certificate fingerprints of the *App signing key*.
3. Add these fingerprints to the Firebase Console project settings for each app. *(Crucial: Without this, Phone Auth & SafetyNet will fail on builds downloaded from Google Play!)*

### 7.3 Device Sanity Testing via ADB (Bundletool)

To verify the release bundle on a connected device before Play Store deployment:

```bash
# Install bundletool if not present:
brew install bundletool

# Generate universal APK set from AAB:
bundletool build-apks \
  --bundle=apps/student/android/app/build/outputs/bundle/release/app-release.aab \
  --output=apps/student/student-release.apks \
  --ks=apps/student/android/app/student-release-key.keystore \
  --ks-pass=pass:YOUR_SECURE_PASSWORD \
  --ks-key-alias=student-release-key \
  --key-pass=pass:YOUR_SECURE_PASSWORD

# Install onto connected physical device:
bundletool install-apks --apks=apps/student/student-release.apks --device-id=RZ8M83Q8C4Y
```

---

## Phase 8: Production Rollout & Remote Version Control

### 8.1 Promote to Production Track
1. After validating Internal / Closed Beta tracks, navigate to **Production** -> **Create new release**.
2. Select the validated release bundle.
3. Configure **Staged Rollout** (Recommended: Start with 10% -> 25% -> 50% -> 100%).
4. Submit for Google Review.

### 8.2 Force Update Protocol
When introducing breaking changes or mandatory security patches:
1. Update `versionCode` and `versionName` in `android/app/build.gradle`.
2. Build and release new AAB on Google Play Store.
3. Update `system_config/app_versions` via Admin Console (or Firebase Console) with `minVersion: "X.Y.Z"` and `forceUpdate: true`.
4. Outdated clients will automatically display the non-dismissible `<ForceUpdateScreen />` redirecting users to the Google Play Store.

---

## 🛠️ Quick Reference Cheat Sheet

| Action | Target Package / Command |
| :--- | :--- |
| **Student Package** | `com.upskill.student` |
| **Client Package** | `com.upskill.client` |
| **Admin Package** | `com.upskill.admin` |
| **Deploy Firebase Rules** | `npx -y firebase-tools deploy --only firestore:rules,storage,firestore:indexes` |
| **Build Student AAB** | `cd apps/student/android && ./gradlew bundleRelease` |
| **Build Client AAB** | `cd apps/client/android && ./gradlew bundleRelease` |
| **Build Admin AAB** | `cd apps/admin/android && ./gradlew bundleRelease` |
| **ADB Install APK** | `adb -s <deviceId> install -r <apk-path>` |
