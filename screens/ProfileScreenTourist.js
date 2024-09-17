import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Dialog from 'react-native-dialog';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ProfileScreenTourist() {
    const route = useRoute();
    const navigation = useNavigation();
    const tourist = route.params?.tourist || {}; // Fallback to an empty object if tourist is undefined

    const [touristInfo, setTouristInfo] = useState({
        id: tourist.touristId,
        first_name: tourist.firstName,
        last_name: tourist.lastName,
        email: tourist.email,
        phone_number: tourist.phoneNumber || '',
        country: tourist.country || '',
    });

    const [visible, setVisible] = useState(false);
    const [updatedTourist, setUpdatedTourist] = useState({ ...touristInfo });
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        console.log("Tourist Params: ", tourist);
        fetchBookings();
    }, [tourist]);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`http://guides.somee.com/api/Tourists/bookings`);
            const text = await response.text();
            console.log("Raw response:", text);
            const data = JSON.parse(text);
            if (response.ok) {
                const detailedBookings = await Promise.all(data.filter(booking => booking.touristId === tourist.touristId).map(async (booking) => {
                    try {
                        const guideName = await fetchGuideName(booking.guideId);
                        const routeName = await fetchRouteName(booking.routeId);
                        return {
                            ...booking,
                            guideName,
                            routeName
                        };
                    } catch (error) {
                        console.error("Error fetching additional booking details:", error);
                        return {
                            ...booking,
                            guideName: "Error fetching guide",
                            routeName: "Error fetching route"
                        };
                    }
                }));
                setBookings(detailedBookings);
            } else {
                throw new Error('Failed to fetch bookings');
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };
    
    const fetchGuideName = async (guideId) => {
        try {
            const response = await fetch(`http://guides.somee.com/api/GuidesRW/${guideId}`);
            if (!response.ok) throw new Error('Failed to fetch guide');
            const guide = await response.json();
            return guide.firstName || "No guide name";
        } catch (error) {
            console.error("Fetch guide error:", error);
            return "Error fetching guide";
        }
    };
    
    const fetchRouteName = async (routeId) => {
        try {
            const response = await fetch(`http://guides.somee.com/api/GuidesRW/routes/${routeId}`);
            if (!response.ok) throw new Error('Failed to fetch route');
            const route = await response.json();
            return route.description || "No route description";
        } catch (error) {
            console.error("Fetch route error:", error);
            return "Error fetching route";
        }
    };
    

    const handleUpdatePress = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleUpdate = async () => {
        setVisible(false);

        console.log("Updating tourist with data:", updatedTourist);

        try {
            const response = await fetch(`http://guides.somee.com/api/Tourists/${tourist.touristId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTourist),
            });

            if (response.ok) {
                console.log("Tourist successfully updated");
                Alert.alert("Success", "Your information has been updated.");
                setTouristInfo(updatedTourist); // Update the tourist info after a successful update
            } else {
                console.log("Failed to update tourist");
                Alert.alert("Error", "There was a problem updating your information.");
            }
        } catch (error) {
            console.error("Error updating tourist:", error);
            Alert.alert("Error", "There was a problem updating your information.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={require('../assets/searchscreen2.jpeg')} style={styles.profileImage} />
            <Text style={styles.title}>Hello {touristInfo.first_name}</Text>
            <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>First Name: {touristInfo.first_name}</Text>
                <Text style={styles.detailLabel}>Last Name: {touristInfo.last_name}</Text>
                <Text style={styles.detailLabel}>Email: {touristInfo.email}</Text>
                <Text style={styles.detailLabel}>Phone: {touristInfo.phone_number}</Text>
                <Text style={styles.detailLabel}>Country: {touristInfo.country}</Text>
            </View>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePress}>
                <Text style={styles.updateButtonText}>Update Information</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Bookings</Text>
            {bookings.map((booking, index) => (
                <View key={index} style={styles.bookingContainer}>
                    <Text style={styles.bookingDetail}>Booking ID: {booking.bookingId}</Text>
                    <Text style={styles.bookingDetail}>Guide: {booking.guideName}</Text>
                    <Text style={styles.bookingDetail}>Route: {booking.routeName}</Text>
                    <Text style={styles.bookingDetail}>Date: {booking.tourDate}</Text>
                    <Text style={styles.bookingDetail}>Status: {booking.bookingStatus}</Text>
                    <Text style={styles.bookingDetail}>Special Requests: {booking.specialRequests}</Text>
                </View>
            ))}
            <Dialog.Container visible={visible}>
                <Dialog.Title>Update Information</Dialog.Title>
                <Dialog.Input
                    label="First Name"
                    value={updatedTourist.first_name}
                    onChangeText={(text) => setUpdatedTourist({ ...updatedTourist, first_name: text })}
                />
                <Dialog.Input
                    label="Last Name"
                    value={updatedTourist.last_name}
                    onChangeText={(text) => setUpdatedTourist({ ...updatedTourist, last_name: text })}
                />
                <Dialog.Input
                    label="Email"
                    value={updatedTourist.email}
                    onChangeText={(text) => setUpdatedTourist({ ...updatedTourist, email: text })}
                />
                <Dialog.Input
                    label="Phone Number"
                    value={updatedTourist.phone_number}
                    onChangeText={(text) => setUpdatedTourist({ ...updatedTourist, phone_number: text })}
                />
                <Dialog.Input
                    label="Country"
                    value={updatedTourist.country}
                    onChangeText={(text) => setUpdatedTourist({ ...updatedTourist, country: text })}
                />
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="Update" onPress={handleUpdate} />
            </Dialog.Container>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0f7fa', // Soft light blue
        padding: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        borderWidth: 4,
        borderColor: '#4dd0e1', // Aqua border
        shadowColor: '#000', // Shadow effect for depth
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Elevation for Android shadow
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00796b', // Dark teal
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.2)', // Subtle shadow for text
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
    },
    detailsContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8, // Elevation for Android shadow
    },
    detailLabel: {
        fontSize: 18,
        color: '#00796b', // Dark teal
        marginBottom: 12,
    },
    updateButton: {
        width: '100%',
        backgroundColor: 'linear-gradient(45deg, #29b6f6, #4caf50)', // Gradient button
        padding: 15,
        borderRadius: 50, // Rounded pill shape
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
        marginTop: 20,
    },
    updateButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase', // Uppercase for a stronger call to action
        letterSpacing: 1.5,
    },
    bookingContainer: {
        marginBottom: 10,
        padding: 15,
        backgroundColor: '#e3f2fd', // Light blue background for bookings
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
    },
    bookingDetail: {
        fontSize: 16,
        color: '#424242',
        marginBottom: 8,
    },
});