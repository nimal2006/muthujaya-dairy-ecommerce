import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.muthujaya.dairy",
  appName: "Muthujaya Dairy",
  webDir: "dist",
  server: {
    androidScheme: "https",
    iosScheme: "https",
    // For development, use your local IP
    // url: 'http://192.168.1.100:5173',
    // cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#10B981",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#FFFFFF",
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#10B981",
    },
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true,
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon",
      iconColor: "#10B981",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  ios: {
    contentInset: "automatic",
  },
};

export default config;
