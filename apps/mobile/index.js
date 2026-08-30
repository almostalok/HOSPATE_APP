import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It ensures that whether loaded in Expo Go, Web, or Native build, the environment is set up appropriately.
registerRootComponent(App);
