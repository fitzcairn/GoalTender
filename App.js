/**
 * GoalTender
 * A simple react native application to take this framework for a spin.
 * Steve Martin
 * steve@stevezero.com
 *
 * @flow
 */

import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image
} from 'react-native';

import {
  createStackNavigator,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';


// TODO: understand "type Props"??
type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

// Opening Screen
export class HomeScreen extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to GoalTender!
        </Text>
        <Text style={styles.instructions}>
          This is a tiny app to help you track simple daily goals.
        </Text>
        <Button
          title="Get Started!"
          onPress={() => this.props.navigation.navigate('Settings')}
        />
      </View>
    );
  }
}

// App Settings
export class SettingsScreen extends Component<Props> {
  render() {
    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={pic} style={{width: 193, height: 110}}/>
        <Text>Details Screen</Text>
        <Button
          title="Go to Settings... again"
          onPress={() => this.props.navigation.push('Settings')}
        />
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="Goals"
          onPress={() => this.props.navigation.navigate('Daily')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}


// Daily Goals Screen
export class DailyScreen extends Component<Props> {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Daily Goals Screen</Text>
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    );
  }
}

// Stats Screen
export class StatsScreen extends Component<Props> {
  constructor(props: Object) {
    super(props);
    this.state = { text: ''};
  }

  render() {
    return (
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to translate!"
          onChangeText={(text) => this.setState({text})}
        />
        <Text style={{padding: 10, fontSize: 42}}>
          {this.state.text.split(' ').map((word) => word && '🍕').join(' ')}
        </Text>
      </View>
    );
  }
}

// Define my screens.
// TODO: Design the app :)
const GoalTender = createStackNavigator({
  Home: {
    screen: HomeScreen,
    // Optional: When deep linking or using react-navigation in a web app, this path is used:
    path: 'home',
    // Optional: Override the `navigationOptions` for the screen
    //navigationOptions: ({ navigation }) => ({
    //  title: `${navigation.state.params.name}'s Profile'`,
    //}),
  },
  Settings: {
    screen: SettingsScreen,
    // Optional: When deep linking or using react-navigation in a web app, this path is used:
    path: 'settings',
    // Optional: Override the `navigationOptions` for the screen
    //navigationOptions: ({ navigation }) => ({
    //  title: `${navigation.state.params.name}'s Profile'`,
    //}),
  },
  Daily: {
    screen: DailyScreen,
    // Optional: When deep linking or using react-navigation in a web app, this path is used:
    path: 'daily',
    // Optional: Override the `navigationOptions` for the screen
    //navigationOptions: ({ navigation }) => ({
    //  title: `${navigation.state.params.name}'s Profile'`,
    //}),
  },
  Stats: {
    screen: StatsScreen,
    // Optional: When deep linking or using react-navigation in a web app, this path is used:
    path: 'stats',
    // Optional: Override the `navigationOptions` for the screen
    //navigationOptions: ({ navigation }) => ({
    //  title: `${navigation.state.params.name}'s Profile'`,
    //}),
  }
},
{
  initialRouteName: 'Home',
});

// The main app class.
export default class App extends Component<Props> {
  render() {
    return <GoalTender />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
