import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

// API URLs
const guidesApiUrl = 'http://guides.somee.com/api/GuidesRW';
const touristsApiUrl = 'http://guides.somee.com/api/Tourists';
const deleteGuideApiUrl = (id) => `http://guides.somee.com/api/GuidesRW/${id}`;
const deleteTouristApiUrl = (id) => `http://guides.somee.com/api/Tourists/${id}`;

export default function AdminPage() {
    const [guides, setGuides] = useState([]);
    const [tourists, setTourists] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    
    useEffect(() => {
        fetchAllGuidesAndTourists();
    }, []);

    const fetchAllGuidesAndTourists = async () => {
        try {
            setLoading(true);
            const [guidesResponse, touristsResponse] = await Promise.all([
                fetch(guidesApiUrl),
                fetch(touristsApiUrl),
            ]);

            if (guidesResponse.ok && touristsResponse.ok) {
                const guidesData = await guidesResponse.json();
                const touristsData = await touristsResponse.json();

                // Log the fetched data for debugging
                console.log("Guides fetched successfully:", guidesData);
                console.log("Tourists fetched successfully:", touristsData);

                setGuides(guidesData);
                setTourists(touristsData);
            } else {
                console.error("Failed to fetch guides or tourists");
                Alert.alert('Error', 'Unable to fetch guides or tourists');
            }
        } catch (error) {
            console.error('Error fetching guides or tourists:', error);
            Alert.alert('Error', 'Unable to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGuide = async (id) => {
        try {
            const response = await fetch(deleteGuideApiUrl(id), {
                method: 'DELETE',
            });
            if (response.status === 204) {
                Alert.alert('Success', 'Guide deleted successfully');
                setGuides(guides.filter(guide => guide.id !== id)); // Update UI
            } else {
                throw new Error('Failed to delete guide');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not delete the guide');
        }
    };

    const handleDeleteTourist = async (id) => {
        try {
            const response = await fetch(deleteTouristApiUrl(id), {
                method: 'DELETE',
            });
            if (response.status === 204) {
                Alert.alert('Success', 'Tourist deleted successfully');
                setTourists(tourists.filter(tourist => tourist.touristId !== id)); // Update UI
            } else {
                throw new Error('Failed to delete tourist');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not delete the tourist');
        }
    };
    

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <>
                    <Text style={styles.sectionTitle}>Guides</Text>
                    {guides.length > 0 ? (
                        guides.map(guide => {
                            console.log("Guide details:", guide); // Log each guide object
                            return (
                                <View key={guide.id} style={styles.card}>
                                    <Text style={styles.cardTitle}>{guide.firstName} {guide.lastName}</Text>
                                    <Text style={styles.cardSubtitle}>Bio: {guide.bio}</Text>
                                    <Text style={styles.cardSubtitle}>Country: {guide.country}</Text>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeleteGuide(guide.id)}
                                    >
                                        <Icon name="trash" size={20} color="#fff" />
                                        <Text style={styles.buttonText}>Delete Guide</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    ) : (
                        <Text style={styles.emptyText}>No guides found.</Text>
                    )}

                    <Text style={styles.sectionTitle}>Tourists</Text>
                    {tourists.length > 0 ? (
                        tourists.map(tourist => (
                            <View key={tourist.touristId} style={styles.card}>
                                <Text style={styles.cardTitle}>{tourist.firstName} {tourist.lastName}</Text>
                                <Text style={styles.cardSubtitle}>Email: {tourist.email}</Text>
                                <Text style={styles.cardSubtitle}>Phone: {tourist.phoneNumber}</Text>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteTourist(tourist.touristId)}
                                >
                                    <Icon name="trash" size={20} color="#fff" />
                                    <Text style={styles.buttonText}>Delete Tourist</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No tourists found.</Text>
                    )}
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: '#FF1493',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        marginLeft: 10,
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});
