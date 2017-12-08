import { AppRegistry, StyleSheet } from 'react-native';
import App from './App';
import NativeTachyons from 'react-native-style-tachyons';

NativeTachyons.build({
    /* REM parameter is optional, default is 16 */
    rem: 16,
}, StyleSheet);

AppRegistry.registerComponent('MywellCollect', () => App);
