import { CapacitorConfig } from '@capacitor/cli';
 const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'photoBook',
  webDir: 'www',
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SplashScreen: {
      launchShowDuration: 0,
    }
  },
};
export default config;
