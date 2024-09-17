// App.js
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './screens/HomePage';
import GuideRegister from './screens/GuideRegister';
import TouristRegister from './screens/TouristRegister';
import GuideSignUp from './screens/GuideSignUp';
import TouristSignUp from './screens/TouristSignUp';
import HomePageGuide from './screens/HomePageGuide';
import FavoriteScreen from './screens/FavoriteScreen';
import { FavoritesProvider } from './FavoritesContext';
import ProfileScreen from './screens/ProfileScreen';
import ProfileScreenTourist from './screens/ProfileScreenTourist';
import AdminPage from './screens/AdminPage';

const Stack = createStackNavigator();

function MainScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HomePage')}
      >
        <Text style={styles.buttonText}>Go to Home Page</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('GuideRegister')}
      >
        <Text style={styles.buttonText}>Guide Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TouristRegister')}
      >
        <Text style={styles.buttonText}>Tourist Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HomePageGuide')}
      >
        <Text style={styles.buttonText}>Guide Home Page</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AdminPage')}
      >
        <Text style={styles.buttonText}>Admin Page</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen name="GuideRegister" component={GuideRegister} />
          <Stack.Screen name="TouristRegister" component={TouristRegister} />
          <Stack.Screen name="GuideSignUp" component={GuideSignUp} />
          <Stack.Screen name="TouristSignUp" component={TouristSignUp} />
          <Stack.Screen name="HomePageGuide" component={HomePageGuide} />
          <Stack.Screen name="FavoriteScreen" component={FavoriteScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="ProfileScreenTourist" component={ProfileScreenTourist} />
          <Stack.Screen name="AdminPage" component={AdminPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF', // Light blue for a welcoming background
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FF6F61', // Warm vibrant color for the title
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Add subtle shadow for depth
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  button: {
    backgroundColor: '#FF6F61', // Coral color to make buttons pop
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25, // Rounded buttons for a friendlier look
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5, // Elevation for Android shadow
  },
  buttonText: {
    color: '#FFF', // White text for high contrast
    fontSize: 16,
    fontWeight: '600', // Make the text more readable
    textAlign: 'center',
  },
});
