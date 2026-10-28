import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Network } from '@capacitor/network';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export interface MobileBridgeOptions {
  onBackPress?: () => boolean; // return true if handled (e.g. closed a modal)
  onNetworkChange?: (connected: boolean) => void;
}

export const isNative = Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform(); // 'android' | 'ios' | 'web'

/**
 * Initializes mobile environment (Status Bar, Splash Screen, App Listeners)
 */
export async function initializeMobilePlatform(options?: MobileBridgeOptions) {
  if (!isNative) return () => {};

  try {
    // 1. Configure Status Bar
    if (Capacitor.isPluginAvailable('StatusBar')) {
      await StatusBar.setStyle({ style: Style.Dark });
      if (Capacitor.getPlatform() === 'android') {
        await StatusBar.setBackgroundColor({ color: '#0F172A' });
      }
    }
  } catch (err) {
    console.warn('[MobileBridge] StatusBar init error:', err);
  }

  try {
    // 2. Hide Splash Screen after brief transition
    if (Capacitor.isPluginAvailable('SplashScreen')) {
      setTimeout(async () => {
        try {
          await SplashScreen.hide({ fadeOutDuration: 300 });
        } catch (e) {
          // ignore
        }
      }, 200);
    }
  } catch (err) {
    console.warn('[MobileBridge] SplashScreen hide error:', err);
  }

  // 3. Network listener
  let networkListenerCleanup = () => {};
  try {
    if (Capacitor.isPluginAvailable('Network')) {
      const handle = await Network.addListener('networkStatusChange', (status) => {
        if (options?.onNetworkChange) {
          options.onNetworkChange(status.connected);
        }
      });
      networkListenerCleanup = () => handle.remove();
    }
  } catch (err) {
    console.warn('[MobileBridge] Network listener error:', err);
  }

  // 4. Android Hardware Back Button listener
  let backListenerCleanup = () => {};
  try {
    if (Capacitor.isPluginAvailable('App')) {
      const handle = await CapApp.addListener('backButton', ({ canGoBack }) => {
        // First priority: check if active modal/drawer handled the back press
        if (options?.onBackPress && options.onBackPress()) {
          return;
        }

        // Second priority: browser/router history navigation
        if (window.location.pathname !== '/' && window.history.length > 1) {
          window.history.back();
        } else {
          // At home page with nothing to close: exit application
          CapApp.exitApp();
        }
      });
      backListenerCleanup = () => handle.remove();
    }
  } catch (err) {
    console.warn('[MobileBridge] BackButton listener error:', err);
  }

  return () => {
    networkListenerCleanup();
    backListenerCleanup();
  };
}

/**
 * Triggers native haptic feedback (vibration)
 */
export async function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light') {
  if (!isNative || !Capacitor.isPluginAvailable('Haptics')) return;

  try {
    if (type === 'light') {
      await Haptics.impact({ style: ImpactStyle.Light });
    } else if (type === 'medium') {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } else if (type === 'heavy') {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } else if (type === 'success') {
      await Haptics.notification({ type: NotificationType.Success });
    } else if (type === 'warning') {
      await Haptics.notification({ type: NotificationType.Warning });
    }
  } catch (e) {
    // silently ignore if unsupported
  }
}

/**
 * Native Camera & Photo picker helper
 */
export async function takeMobilePhoto(): Promise<string | null> {
  if (!isNative || !Capacitor.isPluginAvailable('Camera')) {
    return null;
  }

  try {
    const photo = await Camera.getPhoto({
      quality: 85,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    return photo.dataUrl || null;
  } catch (err) {
    console.warn('[MobileBridge] Camera capture error/cancelled:', err);
    return null;
  }
}

