# Google Play Store Release — Master To-Do Checklist & Commands

A step-by-step, sequential guide with exact terminal commands and console configurations to publish all 3 apps (**Student**, **Client**, and **Admin**) to the **Google Play Store**.

---

## 📋 Overview of Apps to Publish

| Application | App Name on Play Store | Package Name | Target Track |
| :--- | :--- | :--- | :--- |
| **Student App** | `Upskill: Learn & Earn Projects` | `com.upskill.student` | Production / Open Beta |
| **Client App** | `Upskill for Clients: Hire Talent` | `com.upskill.client` | Production / Open Beta |
| **Admin App** | `Upskill Admin Console` | `com.upskill.admin` | Internal / Closed Track |

---

## 🛠️ Step 1: Generate Dedicated Production Keystores

Run these commands in your terminal from the root folder `/Users/sudhir/Documents/Projects/5Upskill`:

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
  -dname "CN=Upskill Student, OU=Mobile, O=Upskill, L=Bengaluru, ST=Karnataka, C=IN"

# 2. Client App Keystore
keytool -genkeypair -v \
  -keystore apps/client/android/app/client-release-key.keystore \
  -alias client-release-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "YOUR_SECURE_PASSWORD" \
  -keypass "YOUR_SECURE_PASSWORD" \
  -dname "CN=Upskill Client, OU=Mobile, O=Upskill, L=Bengaluru, ST=Karnataka, C=IN"

# 3. Admin App Keystore
keytool -genkeypair -v \
  -keystore apps/admin/android/app/admin-release-key.keystore \
  -alias admin-release-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "YOUR_SECURE_PASSWORD" \
  -keypass "YOUR_SECURE_PASSWORD" \
  -dname "CN=Upskill Admin, OU=Mobile, O=Upskill, L=Bengaluru, ST=Karnataka, C=IN"
```

---

## 📦 Step 2: Build Production Android App Bundles (.aab)

Google Play Store **requires `.aab` (Android App Bundle)** files for all new releases.

Run the monorepo build script from root:

```bash
# Set environment
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH=$HOME/.nvm/versions/node/v24.18.0/bin:$PATH

# Bundle all 3 apps in one command:
yarn build:aab:all
```

Or build individually:
```bash
# Student AAB
cd apps/student/android && ./gradlew clean && ./gradlew bundleRelease && cd ../../..

# Client AAB
cd apps/client/android && ./gradlew clean && ./gradlew bundleRelease && cd ../../..

# Admin AAB
cd apps/admin/android && ./gradlew clean && ./gradlew bundleRelease && cd ../../..
```

### 📍 Generated Output File Locations:
- `apps/student/android/app/build/outputs/bundle/release/app-release.aab`
- `apps/client/android/app/build/outputs/bundle/release/app-release.aab`
- `apps/admin/android/app/build/outputs/bundle/release/app-release.aab`

---

## 🌐 Step 3: Google Play Console — Create 3 App Listings

1. Open **[Google Play Console](https://play.google.com/console)**.
2. Click **Create app** (top right) 3 times:

### 🔹 App 1 (Student)
- **App name**: `Upskill: Learn & Earn Projects`
- **Default language**: English (United States / India)
- **App or game**: App
- **Free or paid**: Free
- **Declarations**: Accept Developer Program Policies and US export laws.

### 🔹 App 2 (Client)
- **App name**: `Upskill for Clients: Hire Talent`
- **Default language**: English
- **App or game**: App
- **Free or paid**: Free

### 🔹 App 3 (Admin)
- **App name**: `Upskill Admin Console`
- **Default language**: English
- **App or game**: App
- **Free or paid**: Free (Will be restricted to Internal / Closed testing)

---

## 📝 Step 4: Complete Mandatory Policy & Content Declarations

Navigate to **Policy and programs** -> **App content** for each app:

- [ ] **Privacy Policy**:
  - Enter URL: `https://upskill.com/privacy` (Text provided in [`PRIVACY_POLICY.md`](file:///Users/sudhir/Documents/Projects/5Upskill/PRIVACY_POLICY.md))
- [ ] **App Access (Reviewer Credentials)**:
  - Select **"All or some functionality is restricted"**
  - Add test instructions:
    - **Phone**: `+91 9900000001`
    - **OTP**: `123456`
    - **Note**: "Enter test phone number and OTP to access verified role features."
- [ ] **Ads**:
  - Select **"No, my app does not contain ads"**.
- [ ] **Content Ratings**:
  - Start questionnaire -> Select **Utility, Productivity, Communication, or Other**.
  - Fill answers (all violence/substance questions = No).
  - Rating will be **Everyone / PEGI 3 / 3+**.
- [ ] **Target Audience & Content**:
  - Target age group: **18 and over**.
  - Appeal to children: **No**.
- [ ] **Data Safety Questionnaire**:
  - Does your app collect data? **Yes**
  - Data encrypted in transit? **Yes**
  - Can users request account deletion? **Yes** (Enter `https://upskill.com/delete-account`)
  - **Data types collected**:
    1. **Name & Phone Number**: For Account Management & Authentication.
    2. **Photos & Files** (Optional): For project deliverables / portfolio attachments.
    3. **Crash logs & Diagnostics**: For app performance and reliability.
- [ ] **Financial Features**: Select **None**.
- [ ] **Government Apps**: Select **No**.

---

## 🎨 Step 5: Store Listing Graphic Assets

For each app, upload to **Grow** -> **Store presence** -> **Main store listing**:

| Asset | Specifications | Description |
| :--- | :--- | :--- |
| **App Icon** | `512 x 512 px` (PNG 32-bit with alpha) | App logo with high contrast |
| **Feature Graphic** | `1024 x 500 px` (PNG / JPEG, no alpha) | Dark branded banner with tagline |
| **Phone Screenshots** | Min 4 screenshots (e.g. `1080 x 2400` or `1440 x 3040`) | Live screens (Dark mode + vector SVG icons) |
| **Short Description** | Max 80 characters | e.g. *"Work on real-world projects, learn high-income skills & earn."* |
| **Full Description** | Max 4000 characters | Core features, security, escrow, and verified certificates. |

---

## 🚀 Step 6: Upload AAB to Internal Testing Track

1. Go to **Testing** -> **Internal testing**.
2. Click **Create new release**.
3. Drag & drop the `.aab` file:
   - For Student: `apps/student/android/app/build/outputs/bundle/release/app-release.aab`
   - For Client: `apps/client/android/app/build/outputs/bundle/release/app-release.aab`
   - For Admin: `apps/admin/android/app/build/outputs/bundle/release/app-release.aab`
4. Set **Release Name**: `1.0.0 (1)`
5. Enter **Release Notes**:
   ```
   Initial production release of Upskill with 100% vector SVG icons, dark mode, and verified role access.
   ```
6. Click **Next** -> **Save** -> **Start rollout to Internal testing**.

---

## 🔑 Step 7: Sync Play App Signing Fingerprints with Firebase (CRITICAL)

> [!CAUTION]
> When you upload to Google Play, Google signs your app with **Google Play App Signing**. If you do not add this key to Firebase, **Phone Auth SMS will fail** on downloaded Play Store builds!

1. In Play Console -> Go to **Setup** -> **App integrity** -> **App Signing**.
2. Under **App signing key certificate**, copy:
   - `SHA-1 certificate fingerprint`
   - `SHA-256 certificate fingerprint`
3. Go to **[Firebase Console](https://console.firebase.google.com/)** -> **Project Settings** -> **Your Apps** -> Select the app.
4. Click **Add fingerprint** and paste both SHA-1 and SHA-256.

---

## 🏁 Step 8: Promote to Production Track

1. Once internal testers verify the build on their devices:
2. Go to **Testing** -> **Internal testing** -> Click **Promote release** -> **Production**.
3. Review warnings (if any) and click **Start rollout to Production**.
4. Google will review the app (usually 24–48 hours for new accounts).

---

## 🔄 Step 9: Post-Launch Updates & Remote Version Lock

When releasing future updates (e.g., version `1.1.0`):
1. In `android/app/build.gradle`, increment `versionCode 2` and `versionName "1.1.0"`.
2. Run `yarn build:aab:all`.
3. Upload new `.aab` to Play Console.
4. Update `system_config/app_versions` in Firestore using:
   ```bash
   node scripts/seed-production-config.js
   ```
   *(Outdated user devices will automatically show the non-dismissible `<ForceUpdateScreen />` redirecting to Google Play).*
