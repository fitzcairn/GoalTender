import { AppRegistry } from 'react-native';
import App from './App';

// Courtesy of https://github.com/react-navigation/react-navigation/issues/3956.
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

AppRegistry.registerComponent('GoalTender', () => App);
