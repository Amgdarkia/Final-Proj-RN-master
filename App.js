import React, { useState } from 'react';
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
  const [showOptions, setShowOptions] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.adminButton}
        onPress={() => navigation.navigate('AdminPage')}
      >
        <Text style={styles.adminButtonText}>Admin Page</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Welcome! Please select your role</Text>
      <TouchableOpacity
        style={styles.welcomeButton}
        onPress={() => setShowOptions(!showOptions)}
      >
        <Text style={styles.welcomeButtonText}>Choose</Text>
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => navigation.navigate('GuideRegister')}
          >
            <Text style={styles.roleButtonText}>Guide</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => navigation.navigate('TouristRegister')}
          >
            <Text style={styles.roleButtonText}>Tourist</Text>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: '#F0F4F8',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
  welcomeButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10,
  },
  welcomeButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  roleButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10,
  },
  roleButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  adminButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 20,
  },
  adminButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
