import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import SearchScreen from './SearchScreen';
import FavoriteScreen from './FavoriteScreen';
import SettingsScreen from './SettingsScreen';
import ProfileScreenTourist from './ProfileScreenTourist';

const Tab = createBottomTabNavigator();

export default function HomePage() {
    const route = useRoute(); // Use route to get the params
    const tourist = route.params?.tourist; // Retrieve the passed tourist data

    console.log('Logged-in tourist data:', tourist); // For debugging purposes

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Search') {
                        iconName = 'search';
                    } else if (route.name === 'Favorites') {
                        iconName = 'heart';
                    } else if (route.name === 'Settings') {
                        iconName = 'cog';
                    } else if (route.name === 'Profile') {
                        iconName = 'user';
                    }
                    return <Icon name={iconName} size={size} color={color} style={styles.iconShadow} />;
                },
                tabBarLabel: ({ focused }) => {
                    let label;
                    if (route.name === 'Search') {
                        label = 'Search';
                    } else if (route.name === 'Favorites') {
                        label = 'Favorites';
                    } else if (route.name === 'Settings') {
                        label = 'Settings';
                    } else if (route.name === 'Profile') {
                        label = 'Profile';
                    }
                    return (
                        <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
                            {label}
                        </Text>
                    );
                },
            })}
            tabBarOptions={{
                activeTintColor: '#FF6F61',
                inactiveTintColor: '#7A7A7A',
                style: {
                    height: 70,
                    backgroundColor: '#fff',
                    borderTopWidth: 0,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 10 },
                    shadowRadius: 20,
                    elevation: 5,
                },
            }}
        >
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Favorites" component={FavoriteScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
            <Tab.Screen
                name="Profile"
                component={ProfileScreenTourist}
                initialParams={{ tourist }} // Pass tourist data to ProfileScreenTourist
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    iconShadow: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 5,
        elevation: 3,
    },
    tabLabel: {
        fontSize: 12,
        fontFamily: 'Avenir-Roman', // Use a welcoming font
        color: '#7A7A7A',
    },
    tabLabelFocused: {
        color: '#FF6F61',
        fontFamily: 'Avenir-Heavy', // Slightly bold for focus
    },
});
