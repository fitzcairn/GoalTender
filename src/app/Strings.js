/**
 * String handling for localization.
 *
 * @author Steve Martin
 *
 * @flow
 */

import ReactNative from 'react-native';
import I18n from 'react-native-i18n';

// Import all locales
import en from '../locales/en.json';

// Tthe app falls back to English if user locale doesn't exists.
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en,
};

const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL = (
  currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0
);

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// Get a localized string.
export default function Localized(name:string, params:Object = {}): string {
  return I18n.t(name, params);
};
