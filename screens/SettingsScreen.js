import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Switch, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { List } from 'react-native-paper';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

const requestPermissions = async () => {
    try {
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        console.log(`Foreground status: ${foregroundStatus}`);
        console.log(`Foreground status: ${foregroundStatus}`);
        if (foregroundStatus === 'granted') {
            console.log(`Foreground status: ${foregroundStatus}`);
            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync(); //here
            console.log(`Background status: ${backgroundStatus}`);
            if (backgroundStatus === 'granted') {
                await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                    accuracy: Location.Accuracy.Balanced,
                });
                console.log('Background location tracking enabled.');
            } else {
                console.log('Background location permission not granted.');
            }
        } else {
            console.log('Foreground location permission not granted.');
        }

        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync(location.coords);
        console.log(`Location: ${JSON.stringify(address[0])}`);
    } catch (error) {
        console.error(`Error getting location: ${error}`);
    }
};

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
        console.error(error);
        return;
    }
    if (data) {
        const { locations } = data;
        console.log('Received new locations:', locations);
    }
});

export default function SettingsScreen() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isEmailNotifications, setIsEmailNotifications] = useState(true);
    const [isPushNotifications, setIsPushNotifications] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: 'https://placekitten.com/200/200' }}
                    style={styles.profileImage}
                />
                <Text style={styles.profileName}>John Doe</Text>
                <Text style={styles.profileAddress}>123 Maple Street, Anytown, PA 17101</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>PREFERENCES</Text>
                <List.Item
                    title="Language"
                    left={() => <Icon name="language-outline" size={24} color="#000" />}
                    right={() => <Icon name="chevron-forward-outline" size={24} color="#000" />}
                    onPress={() => { }}
                />
                <List.Item
                    title="Dark Mode"
                    left={() => <Icon name="moon-outline" size={24} color="#000" />}
                    right={() => (
                        <Switch
                            value={isDarkMode}
                            onValueChange={setIsDarkMode}
                        />
                    )}
                />
                <List.Item
                    title="Location"
                    left={() => <Icon name="location-outline" size={24} color="#000" />}
                    right={() => (
                        <TouchableOpacity onPress={requestPermissions}>
                            <Text style={styles.enableText}>Enable</Text>
                        </TouchableOpacity>
                    )}
                />
                <List.Item
                    title="Email Notifications"
                    left={() => <Icon name="mail-outline" size={24} color="#000" />}
                    right={() => (
                        <Switch
                            value={isEmailNotifications}
                            onValueChange={setIsEmailNotifications}
                        />
                    )}
                />
                <List.Item
                    title="Push Notifications"
                    left={() => <Icon name="notifications-outline" size={24} color="#000" />}
                    right={() => (
                        <Switch
                            value={isPushNotifications}
                            onValueChange={setIsPushNotifications}
                        />
                    )}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>RESOURCES</Text>
                <List.Item
                    title="Report Bug"
                    left={() => <Icon name="bug-outline" size={24} color="#000" />}
                    right={() => <Icon name="chevron-forward-outline" size={24} color="#000" />}
                    onPress={() => { }}
                />
                <List.Item
                    title="Contact Us"
                    left={() => <Icon name="call-outline" size={24} color="#000" />}
                    right={() => <Icon name="chevron-forward-outline" size={24} color="#000" />}
                    onPress={() => { }}
                />
                <List.Item
                    title="Rate in App Store"
                    left={() => <Icon name="star-outline" size={24} color="#000" />}
                    right={() => <Icon name="chevron-forward-outline" size={24} color="#000" />}
                    onPress={() => { }}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileAddress: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    enableText: {
        color: '#007bff',
        fontSize: 16,
    },
});
