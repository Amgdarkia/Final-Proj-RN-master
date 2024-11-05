import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import { Linking } from 'react-native';

const HomePageGuide = () => {
    const route = useRoute();
    const { guide } = route.params || {};

    const [guideInfo, setGuideInfo] = useState(guide);
    const [routes, setRoutes] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isReviewing, setIsReviewing] = useState(false);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await fetch(`http://guides.somee.com/api/GuidesRW/${guideInfo.id}/routes`);
                if (response.ok) {
                    const fetchedRoutes = await response.json();
                    setRoutes(fetchedRoutes);
                }
            } catch (error) {
                Alert.alert("Error", "Failed to fetch routes.");
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://guides.somee.com/api/GuidesRW/${guideInfo.id}/reviews`);
                if (response.ok) {
                    const fetchedReviews = await response.json();
                    setReviews(fetchedReviews);
                }
            } catch (error) {
                Alert.alert("Error", "Failed to fetch reviews.");
            }
        };

        fetchRoutes();
        fetchReviews();
    }, [guideInfo.id]);

    const handleAddReview = () => {
        setIsReviewing(true);
    };

    const submitReview = async () => {
        try {
            const touristId = 1; // Replace with actual touristId
            const guideId = guideInfo.id;

            const response = await fetch(`http://guides.somee.com/api/tourists/${touristId}/reviews/${guideId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, comment }),
            });

            if (response.ok) {
                Alert.alert("Success", "Review added successfully.");
                const newReview = await response.json();
                setReviews((prevReviews) => [...prevReviews, newReview]);
                setRating(0);
                setComment('');
                setIsReviewing(false);
            } else {
                Alert.alert("Error", "Failed to add review.");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to submit the review.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profileContainer}>
                <Image source={require('../assets/searchscreen2.jpeg')} style={styles.profileImage} />
                <Text style={styles.title}>Welcome to {guideInfo.firstName}'s Profile!</Text>
                <Text style={styles.descriptionText}>{guideInfo.Bio}</Text>
                <Text style={styles.infoText}>Languages: {guideInfo.languages}</Text>
                <Text style={styles.infoText}>Country: {guideInfo.country}</Text>
                <Text style={styles.infoText}>Email: {guideInfo.email}</Text>
                <Text style={styles.contactGuideText}>Contact Guide</Text>
                <TouchableOpacity
                    style={styles.whatsappButton}
                    onPress={() => Linking.openURL('https://wa.me/+972507311176')}
                >
                    <Icon name="whatsapp" size={40} color="#25D366" />
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Routes Offered</Text>
            {routes.length > 0 ? (
                routes.map((route, index) => (
                    <View key={index} style={styles.routeItem}>
                        <Text style={styles.routeText}>Description: {route.description}</Text>
                        <Text style={styles.routeText}>Duration: {route.duration} hours</Text>
                        <Text style={styles.routeText}>Difficulty: {route.difficultyLevel}</Text>
                        <Text style={styles.routeText}>Start: {route.startPoint}</Text>
                        <Text style={styles.routeText}>End: {route.endPoint}</Text>
                        <Text style={styles.routeText}>Type: {route.routeType}</Text>
                    </View>
                ))
            ) : (
                <Text style={styles.tripText}>No routes available</Text>
            )}

            <Text style={styles.sectionTitle}>Reviews</Text>
            {reviews.length > 0 ? (
                reviews.map((review, index) => (
                    <View key={index} style={styles.reviewCard}>
                        <Text style={styles.reviewText}>
                            {`Rating: ${review.rating} ★ - ${review.comment}`}
                        </Text>
                    </View>
                ))
            ) : (
                <Text style={styles.reviewText}>No reviews available</Text>
            )}

            {isReviewing ? (
                <View style={styles.reviewInputContainer}>
                    <Text style={styles.addReviewLabel}>Rate this guide:</Text>
                    <StarRating rating={rating} onChange={setRating} />

                    <TextInput
                        style={styles.commentInput}
                        placeholder="Write your comment here..."
                        value={comment}
                        onChangeText={setComment}
                    />

                    <TouchableOpacity style={styles.submitReviewButton} onPress={submitReview}>
                        <Text style={styles.submitReviewButtonText}>Submit Review</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelReviewButton} onPress={() => setIsReviewing(false)}>
                        <Text style={styles.cancelReviewButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.addReviewButton} onPress={handleAddReview}>
                    <Text style={styles.addReviewButtonText}>Add Review</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f9f9fb',
        paddingVertical: 20,
    },
    profileContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFDEE9',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
        elevation: 6,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: '#FF6F61',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginVertical: 5,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#444',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    descriptionText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginVertical: 5,
    },
    infoText: {
        fontSize: 14,
        color: '#777',
        marginBottom: 3,
    },
    routeItem: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 15,
        marginHorizontal: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 3,
    },
    routeText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    tripText: {
        color: '#333',
        fontSize: 16,
        marginVertical: 2,
        textAlign: 'center',
    },
    reviewCard: {
        backgroundColor: '#E3F2FD',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
        elevation: 2,
    },
    reviewText: {
        fontSize: 16,
        color: '#444',
        marginVertical: 2,
    },
    contactGuideText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
        textAlign: 'center',
    },
    whatsappButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: 30,
        backgroundColor: '#E0F7EF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 3,
    },
    addReviewButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 15,
    },
    addReviewButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewCard: { padding: 10, backgroundColor: '#f0f0f5', marginVertical: 5, borderRadius: 8 },
    reviewText: { fontSize: 16 },
    addReviewButton: { backgroundColor: '#4CAF50', padding: 10, marginTop: 10, borderRadius: 8, alignItems: 'center' },
    addReviewButtonText: { color: 'white', fontSize: 16 },
    reviewInputContainer: { marginTop: 20, padding: 10, backgroundColor: '#f0f0f5', borderRadius: 8 },
    addReviewLabel: { fontSize: 16, marginBottom: 10 },
    commentInput: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
    submitReviewButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 8, alignItems: 'center' },
    submitReviewButtonText: { color: 'white', fontSize: 16 },
    cancelReviewButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 5 },
    cancelReviewButtonText: { color: 'white', fontSize: 16 },
    
});

export default HomePageGuide;
