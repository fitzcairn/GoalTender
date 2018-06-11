import Reactotron from 'reactotron-react-native'

//$FlowFixMe
Reactotron
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect!
