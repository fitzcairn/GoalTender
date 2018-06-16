/*
 * From:
 * https://github.com/AlexanderZaytsev/react-native-i18n/blob/master/example/src/__mocks__/react-native-i18n.js
 */

// @flow

import I18nJs from 'i18n-js';

I18nJs.locale = 'en'; // a locale from your available translations
export const getLanguages = (): Promise<string[]> => Promise.resolve(['en']);
export default I18nJs;
