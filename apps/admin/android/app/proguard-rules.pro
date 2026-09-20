# ─── 5Upskill React Native ProGuard Rules ───

# React Native Core & JNI Bindings
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }

# React Native SVG
-keep class com.horcrux.svg.** { *; }
-keepclassmembers class com.horcrux.svg.** { *; }

# React Native Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }
-keepclassmembers class com.th3rdwave.safeareacontext.** { *; }

# Firebase Core & Modules
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# AndroidX Core
-keep class androidx.appcompat.widget.** { *; }
-keep class androidx.core.view.** { *; }

# Keep Annotations, Generics & Enum members
-keepattributes *Annotation*, InnerClasses, EnclosingMethod, Signature, Exceptions
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
