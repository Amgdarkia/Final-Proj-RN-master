import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';

const HomePageGuide = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const guide = route.params?.guide;

    // Use useEffect to handle redirection if guide data is missing
    useEffect(() => {
        if (!guide) {
            console.error("Guide data is missing");
            navigation.navigate('GuideRegister'); // Redirect if guide data is missing
        }
    }, [guide, navigation]);

    // If guide is still null or undefined, return nothing to prevent rendering
    if (!guide) {
        return null;
    }

    const trips = [
        { id: 1, title: 'Settings', subtitle: 'Pakistan', iconName: 'cog' },
        { id: 2, title: 'Profile', subtitle: 'England', iconName: 'user' },
        { id: 3, title: 'Reviews', subtitle: 'America', iconName: 'star' },
        { id: 4, title: 'Trips', subtitle: 'America', iconName: 'map' },
    ];

    const handleProfilePress = () => {
        navigation.navigate('ProfileScreen', { guide }); // Pass the guide data
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Expensify</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('GuideRegister')}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <Icon
                name="briefcase"
                size={100}
                color="#333"
                style={styles.mainIcon}
            />
            <View style={styles.recentTripsHeader}>
                <Text style={styles.recentTripsTitle}>Recent Trips</Text>
                <TouchableOpacity style={styles.addTripButton} onPress={() => navigation.navigate('AddTrip')}>
                    <Text style={styles.addTripButtonText}>Add Trip</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.tripsContainer}>
                {trips.map(trip => (
                    <TouchableOpacity
                        key={trip.id}
                        style={styles.tripCard}
                        onPress={trip.title === 'Profile' ? handleProfilePress : () => { }}>
                        <Icon name={trip.iconName} size={50} color="#333" style={styles.tripIcon} />
                        <Text style={styles.tripTitle}>{trip.title}</Text>
                        <Text style={styles.tripSubtitle}>{trip.subtitle}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        backgroundColor: '#FF1493',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    mainIcon: {
        width: '100%',
        height: 200,
        textAlign: 'center',
        marginBottom: 20,
    },
    recentTripsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    recentTripsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    addTripButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    addTripButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    tripsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    tripCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        width: '48%',
        marginBottom: 20,
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
    },
    tripIcon: {
        marginBottom: 10,
    },
    tripTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    tripSubtitle: {
        fontSize: 14,
        color: '#666',
    },
});

export default HomePageGuide;
