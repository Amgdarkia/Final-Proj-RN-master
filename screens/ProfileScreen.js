import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Dialog from 'react-native-dialog';
import { useRoute } from '@react-navigation/native';

export default function ProfileScreen() {
    const route = useRoute();
    const { guide } = route.params || {}; // Fallback to an empty object if guide is undefined
    const [reviews, setReviews] = useState([]);
    const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);


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
    
    // console.log("Updated guideInfo state:", guideInfo);
    const [routeDialogVisible, setRouteDialogVisible] = useState(false);
    const [newRoute, setNewRoute] = useState({
        description: '',
        duration: '',
        difficultyLevel: '',
        startPoint: '',
        endPoint: '',
        routeType: ''
    });
    
    const [visible, setVisible] = useState(false);
    const [updatedGuide, setUpdatedGuide] = useState({ ...guideInfo });
    // console.log("Fetched guide details:", guideInfo);
    const [routes, setRoutes] = useState([]);
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        const fetchGuideDetails = async () => {
            try {
                // console.log("Fetching guide details for ID:", guideInfo.id);
                const response = await fetch(`http://guides.somee.com/api/GuidesRW/${guideInfo.id}`);
        
                if (response.ok) {
                    const result = await response.json();
                    // console.log("Fetched guide details:", result);
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
                // console.log("Attempting to fetch routes for guide ID:", guideInfo.id); // Ensure ID is captured
                const response = await fetch(`http://guides.somee.com/api/GuidesRW/${guideInfo.id}/routes`);
                // console.log("Response status for routes fetch:", response.status); // Check the HTTP response status
        
                if (response.ok) {
                    const result = await response.json();
                    // console.log("Fetched routes:", result);
                    setRoutes(result || []);
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
                // console.log("Fetching reviews for guide ID:", guideInfo.id);
                const response = await fetch(`http://guides.somee.com/api/GuidesRW/${guideInfo.id}/reviews`);
                if (response.ok) {
                    const result = await response.json();
                    // console.log("Fetched reviews:", result);
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
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(`http://guides.somee.com/api/GuidesRW/${guideInfo.id}/bookings`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched booking data:", data);  // Check what the data looks like
                    setBookings(data.filter(booking => booking.bookingStatus && booking.bookingStatus.toLowerCase() === "pending"));
                } else {
                    console.error("Failed to fetch bookings");
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };
        
    
        fetchBookings();
    }, [guideInfo.id]);

    const handleUpdatePress = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };
    const handleAddRoute = async () => {
        setRouteDialogVisible(false);
    
        try {
            const response = await fetch(`http://guides.somee.com/api/GuidesRW/${guideInfo.id}/routes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRoute),
            });
    
            if (response.ok) {
                Alert.alert("Success", "New route has been added.");
                setNewRoute({
                    description: '',
                    duration: '',
                    difficultyLevel: '',
                    startPoint: '',
                    endPoint: '',
                    routeType: ''
                });
                fetchRoutes(); // Refresh the list of routes
            } else {
                Alert.alert("Error", "There was a problem adding the route.");
            }
        } catch (error) {
            Alert.alert("Error", "There was a problem adding the route.");
        }
    };
    
    const updateBookingStatus = async (bookingId, newStatus) => {
        try {
            console.log("Fetching all bookings to find booking with ID:", bookingId);
            
            // Fetch all bookings
            const fetchResponse = await fetch(`http://guides.somee.com/api/Tourists/bookings`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
    
            let allBookings;
            if (fetchResponse.ok) {
                allBookings = await fetchResponse.json();
            } else {
                const fetchDataText = await fetchResponse.text();
                console.log("Fetch all bookings failed response:", fetchDataText);
                try {
                    const fetchData = JSON.parse(fetchDataText);
                    console.log("Parsed error:", fetchData);
                    throw new Error(fetchData.message || "Failed to fetch bookings.");
                } catch (jsonError) {
                    throw new Error(`Failed to fetch bookings. Response status: ${fetchResponse.status}, Server response not JSON.`);
                }
            }
    
            // Find the booking with the specified ID
            const bookingDetails = allBookings.find(booking => booking.bookingId === bookingId);
            
            if (!bookingDetails) {
                throw new Error(`Booking with ID ${bookingId} not found.`);
            }
    
            console.log("Fetched booking details:", bookingDetails);
    
            // Prepare updated booking data
            const updatedBooking = {
                ...bookingDetails,
                bookingStatus: newStatus
            };
    
            console.log("Sending updated booking to server:", updatedBooking);
    
            // Send the updated booking data to the server
            const updateResponse = await fetch(`http://guides.somee.com/api/GuidesRW/bookings/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedBooking),
            });
    
            if (updateResponse.ok) {
                setBookings(prev => prev.map(booking => booking.id === bookingId ? { ...booking, bookingStatus: newStatus } : booking));
                Alert.alert("Success", `Booking status updated to ${newStatus}`);
            } else {
                const errorText = await updateResponse.text();
                console.log("Update booking status failed response:", errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    Alert.alert("Error", "Failed to update booking status: " + (errorData.message || "Unknown error"));
                } catch {
                    Alert.alert("Error", "Failed to update booking status. Server response not JSON.");
                }
            }
        } catch (error) {
            console.error("Error updating booking status:", error);
            Alert.alert("Error", "Failed to update booking status: " + error.message);
        }
    };
    
    const deleteRoute = async (routeId) => {
        try {
            const response = await fetch(`http://guides.somee.com/api/GuidesRW/${guideInfo.id}/routes/${routeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                Alert.alert("Success", "Route successfully deleted.");
                setRoutes(prev => prev.filter(route => route.routeId !== routeId)); // Update the local state to remove the route
            } else {
                Alert.alert("Error", "Failed to delete the route.");
            }
        } catch (error) {
            console.error("Error deleting the route:", error);
            Alert.alert("Error", "Failed to delete the route: " + error.message);
        }
    };
    const handleUpdateRoute = async (route) => {
        const response = await fetch(`http://guides.somee.com/api/GuidesRW/${guideInfo.id}/routes/${route.routeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(route),
        });
    
        if (response.ok) {
            Alert.alert("Success", "Route updated successfully.");
            setUpdateDialogVisible(false);
            fetchRoutes();  // Refresh the list of routes
        } else {
            const errorData = await response.json();
            Alert.alert("Error", "Failed to update the route: " + (errorData.message || "An error occurred"));
        }
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
                {/* <TouchableOpacity style={styles.tripButton}>
                    <Text style={styles.tripButtonText}>My current Trip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tripButton}>
                    <Text style={styles.tripButtonText}>My Next Trip</Text>
                </TouchableOpacity> */}
            </View>
            <Text style={styles.sectionTitle}>My Routes</Text>

            <View style={styles.tripsList}>
    {routes.length > 0 ? (
        routes.map((route, index) => (
            <View key={index} style={styles.routeItem}>
                <Text style={styles.routeText}>Description: {route.description}</Text>
                <Text style={styles.routeText}>Duration: {route.duration} hours</Text>
                <Text style={styles.routeText}>Difficulty: {route.difficultyLevel}</Text>
                <Text style={styles.routeText}>Start: {route.startPoint}</Text>
                <Text style={styles.routeText}>End: {route.endPoint}</Text>
                <Text style={styles.routeText}>Type: {route.routeType}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRoute(route.routeId)}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.updateButton} onPress={() => {
                    setSelectedRoute(route);
                    setUpdateDialogVisible(true);
                }}>
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
            </View>
        ))
    ) : (
        <Text style={styles.tripText}>No routes available</Text>
    )}
</View>

<Dialog.Container visible={updateDialogVisible}>
    <Dialog.Title>Update Route</Dialog.Title>
    <Dialog.Input
        label="Description"
        value={selectedRoute?.description}
        onChangeText={(text) => setSelectedRoute(prev => ({ ...prev, description: text }))}
    />
   <Dialog.Input
    label="Duration (in hours)"
    value={selectedRoute?.duration.toString()}
    onChangeText={(text) => {
        const num = parseFloat(text);
        if (!isNaN(num)) {
            setSelectedRoute(prev => ({ ...prev, duration: num }));
        } else if (text === '') {
            setSelectedRoute(prev => ({ ...prev, duration: '' }));  // Allow clearing the input
        }
    }}
    keyboardType="numeric"
/>

    <Dialog.Input
        label="Difficulty Level"
        value={selectedRoute?.difficultyLevel}
        onChangeText={(text) => setSelectedRoute(prev => ({ ...prev, difficultyLevel: text }))}
    />
    <Dialog.Input
        label="Start Point"
        value={selectedRoute?.startPoint}
        onChangeText={(text) => setSelectedRoute(prev => ({ ...prev, startPoint: text }))}
    />
    <Dialog.Input
        label="End Point"
        value={selectedRoute?.endPoint}
        onChangeText={(text) => setSelectedRoute(prev => ({ ...prev, endPoint: text }))}
    />
    <Dialog.Input
        label="Route Type"
        value={selectedRoute?.routeType}
        onChangeText={(text) => setSelectedRoute(prev => ({ ...prev, routeType: text }))}
    />
    <Dialog.Button label="Cancel" onPress={() => setUpdateDialogVisible(false)} />
    <Dialog.Button label="Update" onPress={() => handleUpdateRoute(selectedRoute)} />
</Dialog.Container>

            <TouchableOpacity style={styles.sectionButton} onPress={() => setRouteDialogVisible(true)}>
    <Text style={styles.sectionButtonText}>Add Trip</Text>
</TouchableOpacity>

<Text style={styles.sectionTitle}>My Reviews</Text>
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

<View style={styles.bookingsList}>
    {bookings.map((booking, index) => (
        <View key={index} style={styles.bookingItem}>
            <Text style={styles.bookingText}>Tourist ID: {booking.touristId}</Text>
            <Text style={styles.bookingText}>Route ID: {booking.routeId}</Text>
            <Text style={styles.bookingText}>Tour Date: {booking.tourDate}</Text>
            <Text style={styles.bookingText}>Booking Status: {booking.bookingStatus}</Text>
            <Text style={styles.bookingText}>Special Requests: {booking.specialRequests}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.confirmButton} onPress={() => updateBookingStatus(booking.bookingId, 'confirmed')}>
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => updateBookingStatus(booking.bookingId, 'cancelled')}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    ))}
</View>
<Dialog.Container visible={routeDialogVisible}>
    <Dialog.Title>Add New Route</Dialog.Title>
    <Dialog.Input
        label="Description"
        value={newRoute.description}
        onChangeText={(text) => setNewRoute(prev => ({ ...prev, description: text }))}
    />
    <Dialog.Input
        label="Duration (in hours)"
        value={newRoute.duration}
        onChangeText={(text) => setNewRoute(prev => ({ ...prev, duration: parseFloat(text) }))}
        keyboardType="numeric"
    />
    <Dialog.Input
        label="Difficulty Level"
        value={newRoute.difficultyLevel}
        onChangeText={(text) => setNewRoute(prev => ({ ...prev, difficultyLevel: text }))}
    />
    <Dialog.Input
        label="Start Point"
        value={newRoute.startPoint}
        onChangeText={(text) => setNewRoute(prev => ({ ...prev, startPoint: text }))}
    />
    <Dialog.Input
        label="End Point"
        value={newRoute.endPoint}
        onChangeText={(text) => setNewRoute(prev => ({ ...prev, endPoint: text }))}
    />
    <Dialog.Input
        label="Route Type"
        value={newRoute.routeType}
        onChangeText={(text) => setNewRoute(prev => ({ ...prev, routeType: text }))}
    />
    <Dialog.Button label="Cancel" onPress={() => setRouteDialogVisible(false)} />
    <Dialog.Button label="Add" onPress={handleAddRoute} />
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
    bookingsList: {
        width: '100%',
        backgroundColor: '#ECEFF1', // Light gray background
        padding: 10,
        borderRadius: 10,
    },
    bookingItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#FFFFFF', // White background for booking item
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    confirmButton: {
        backgroundColor: '#4CAF50', // Green button
        padding: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#F44336', // Red button
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFFFFF', // White text
    },
    bookingText: {
        color: '#333',
        fontSize: 16,
        marginVertical: 2,
    },
    routeItem: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 4,
    },
    deleteButton: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 5,
        alignItems: 'center',
    },
    updateButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
    },
    routeText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        paddingVertical: 10,
    },
    
});