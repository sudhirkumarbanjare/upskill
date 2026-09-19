import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

try {
  const App = require('./App').default;
  AppRegistry.registerComponent(appName, () => App);
} catch (e) {
  const React = require('react');
  const { View, Text } = require('react-native');
  const ErrorFallback = () => (
    <View style={{flex: 1, backgroundColor: '#0A0D14', justifyContent: 'center', alignItems: 'center', padding: 24}}>
      <Text style={{color: '#FF4D4D', fontSize: 18, fontWeight: 'bold'}}>Module Load Error</Text>
      <Text style={{color: '#FFFFFF', marginTop: 12, fontSize: 14}}>{e ? e.message : 'Unknown'}</Text>
      <Text style={{color: '#888888', marginTop: 8, fontSize: 11}}>{e ? e.stack : ''}</Text>
    </View>
  );
  AppRegistry.registerComponent(appName, () => ErrorFallback);
}
