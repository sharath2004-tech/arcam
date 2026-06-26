import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.arcam.app',
  appName: 'ARCam',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
}

export default config
