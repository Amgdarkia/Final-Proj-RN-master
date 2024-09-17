import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Dialog from 'react-native-dialog';
import { useRoute } from '@react-navigation/native';

export default function ProfileScreen() {
    const route = useRoute();
    const { guide } = route.params || {}; // Fallback to an empty object if guide is undefined
    const [reviews, setReviews] = useState([]);

    if (!guide) {
        return (
            <View style={styles.container}>
                <Text>Error: Guide information is missing</Text>
            </View>
        );
    }

    const [guideInfo, setGuideInfo] = useState({
        id: guide.id,
        FirstName: guide.firstName || '',
        LastName: guide.lastName || '',
        Email: guide.email || '',
        Languages: guide.languages || '',
        Bio: guide.bio || '',
        Country: guide.country || '',
        PhoneNumber: guide.phoneNumber || '',
        HasCar: guide.hasCar || false,
        AverageRating: guide.averageRating || null
    });
    
    console.log("Updated guideInfo state:", guideInfo);

    const [visible, setVisible] = useState(false);
    const [updatedGuide, setUpdatedGuide] = useState({ ...guideInfo });
    console.log("Fetched guide details:", guideInfo);
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        const fetchGuideDetails = async () => {
            try {
                console.log("Fetching guide details for ID:", guideInfo.id);
                const response = await fetch(`http://guides.somee.com/api/GuidesRW/${guideInfo.id}`);
        
                if (response.ok) {
                    const result = await response.json();
                    console.log("Fetched guide details:", result);
                    setGuideInfo({
                        id: result.id,
                        FirstName: result.firstName,
                        LastName: result.lastName,
                        Email: result.email,
                        Languages: result.languages,
                        Bio: result.bio,
                        Country: result.country,
                        PhoneNumber: result.phoneNumber,
                        HasCar: result.hasCar,
                        AverageRating: result.averageRating
                    });
                    setUpdatedGuide({
                        id: result.id,
                        FirstName: result.firstName,
                        LastName: result.lastName,
                        Email: result.email,
                        Languages: result.languages,
                        Bio: result.bio,
                        Country: result.country,
                        PhoneNumber: result.phoneNumber,
                        HasCar: result.hasCar,
                        AverageRating: result.averageRating
                    });
                } else {
                    Alert.alert("Error", "There was a problem fetching guide details.");
                }
            } catch (error) {
                console.error("Error fetching guide details:", error);
                Alert.alert("Error", "There was a problem fetching guide details.");
            }
        };
        

        const fetchRoutes = async () => {
            try {
                console.log("Attempting to fetch routes for guide ID:", guideInfo.id); // Ensure ID is captured
                const response = await fetch(`http://guides.somee.com/api/GuidesRW/${guideInfo.id}/routes`);
                console.log("Response status for routes fetch:", response.status); // Check the HTTP response status
        
                if (response.ok) {
                    const result = await response.json();
                    console.log("Fetched routes:", result);
                    setRoutes(result || []); // Safeguard against null response for routes
                } else {
                    console.log("Response for fetching routes was not ok:", response.status);
                    Alert.alert("Error", "There was a problem fetching routes.");
                }
            } catch (error) {
                console.error("Exception when fetching routes:", error);
                Alert.alert("Error", "There was a problem fetching routes.");
            }
        };
        const fetchReviews = async () => {
            try {
                console.log("Fetching reviews for guide ID:", guideInfo.id);
                const response = await fetch(`http://guides.somee.com/api/GuidesRW/${guideInfo.id}/reviews`);
                if (response.ok) {
                    const result = await response.json();
                    console.log("Fetched reviews:", result);
                    setReviews(result);
                } else {
                    console.log("Failed to fetch reviews, response status:", response.status);
                    Alert.alert("Error", "There was a problem fetching reviews.");
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
                Alert.alert("Error", "There was a problem fetching reviews.");
            }
        };
        

        fetchGuideDetails();
        fetchRoutes();
        fetchReviews();
    }, [guideInfo.id]);

    const handleUpdatePress = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleUpdate = async () => {
        setVisible(false);

        console.log("Updating guide with data:", updatedGuide);

        try {
            const response = await fetch(`http://guides.somee.com/api/GuidesRW/${guideInfo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedGuide),
            });

            if (response.ok) {
                console.log("Guide successfully updated");
                fetchGuideDetails(); // Call the function to fetch updated guide details
                Alert.alert("Success", "Your information has been updated.");
            } else {
                Alert.alert("Error", "There was a problem updating your information.");
            }
        } catch (error) {
            Alert.alert("Error", "There was a problem updating your information.");
        }
    };

    if (!guideInfo) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            
             <Image source={require('../assets/searchscreen2.jpeg')} style={styles.profileImage} />
            <Text style={styles.title}>Good Morning {guideInfo.FirstName}</Text>
            <View style={styles.tripSection}>
                <TouchableOpacity style={styles.tripButton}>
                    <Text style={styles.tripButtonText}>My current Trip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tripButton}>
                    <Text style={styles.tripButtonText}>My Next Trip</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.sectionButton}>
                <Text style={styles.sectionButtonText}>My Trips</Text>
            </TouchableOpacity>
            <View style={styles.tripsList}>
                {routes.length > 0 ? (
                    routes.map((route, index) => (
                        <Text key={index} style={styles.tripText}>{route.description}</Text>
                    ))
                ) : (
                    <Text style={styles.tripText}>No routes available</Text>
                )}
            </View>
            <TouchableOpacity style={styles.sectionButton}>
                <Text style={styles.sectionButtonText}>Add Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionButton}>
                <Text style={styles.sectionButtonText}>My Reviews</Text>
            </TouchableOpacity>
            <View style={styles.reviewsList}>
        {reviews.length > 0 ? (
        reviews.map((review, index) => (
            <Text key={index} style={styles.reviewText}>
                {`Rating: ${review.rating}, Comment: ${review.comment}`}
            </Text>
        ))
    ) : (
        <Text style={styles.reviewText}>No reviews available</Text>
    )}
</View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePress}>
                <Text style={styles.updateButtonText}>Update Information</Text>
            </TouchableOpacity>

            <Dialog.Container visible={visible}>
    <Dialog.Title>Update Information</Dialog.Title>
    <Dialog.Input
        label="First Name"
        value={updatedGuide.FirstName}
        onChangeText={(text) => setUpdatedGuide(prev => ({ ...prev, FirstName: text }))}
    />
    <Dialog.Input
        label="Last Name"
        value={updatedGuide.LastName}
        onChangeText={(text) => setUpdatedGuide(prev => ({ ...prev, LastName: text }))}
    />
    <Dialog.Input
        label="Bio"
        value={updatedGuide.Bio}
        onChangeText={(text) => setUpdatedGuide(prev => ({ ...prev, Bio: text }))}
    />
    <Dialog.Input
        label="Country"
        value={updatedGuide.Country}
        onChangeText={(text) => setUpdatedGuide(prev => ({ ...prev, Country: text }))}
    />
    <Dialog.Input
        label="Phone Number"
        value={updatedGuide.PhoneNumber}
        onChangeText={(text) => setUpdatedGuide(prev => ({ ...prev, PhoneNumber: text }))}
    />
    <Dialog.Input
        label="Email"
        value={updatedGuide.Email}
        onChangeText={(text) => setUpdatedGuide(prev => ({ ...prev, Email: text }))}
    />
    <Dialog.Input
        label="Languages (comma separated)"
        value={updatedGuide.Languages}
        onChangeText={(text) => setUpdatedGuide(prev => ({ ...prev, Languages: text }))}
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
        backgroundColor: '#f0f0f5', // Slightly softer background for more appeal
        padding: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#FF6F61',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#333',
        marginBottom: 20,
    },
    tripSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    tripButton: {
        flex: 1,
        backgroundColor: '#FF6F61', // Use warm colors for buttons
        padding: 15,
        margin: 5,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 2, height: 4 },
        elevation: 5,
    },
    tripButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    sectionButton: {
        width: '100%',
        backgroundColor: '#4CAF50',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 2, height: 4 },
        elevation: 5,
    },
    sectionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    tripsList: {
        width: '100%',
        backgroundColor: '#E3F2FD', // Light blue for the list background
        padding: 10,
        marginBottom: 20,
        borderRadius: 10,
    },
    tripText: {
        color: '#333',
        fontSize: 16,
        marginVertical: 2,
    },
    reviewsList: {
        width: '100%',
        backgroundColor: '#FFF3E0', // Light orange for review background
        padding: 10,
        marginBottom: 20,
        borderRadius: 10,
    },
    reviewText: {
        color: '#333',
        fontSize: 16,
        marginVertical: 2,
    },
    updateButton: {
        width: '100%',
        backgroundColor: '#0288D1', // Vibrant blue for update button
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 2, height: 4 },
        elevation: 5,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});