import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, Image, Dimensions, Linking, KeyboardAvoidingView, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import GuidesLogo from '../assets/guides-logo.svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { FavoritesContext } from '../FavoritesContext';
import { OPEN_CAGE_API, OPENWEATHERMAP_API_KEY } from '@env';
import DateTimePicker from '@react-native-community/datetimepicker'; // Ensure you have this installed

const images = [
    require('../assets/searchscreen1.webp'),
    require('../assets/searchscreen2.jpeg'),
    require('../assets/searchscreen3.jpeg'),
];

const CITY_NAME = 'paris';

const TripCard = ({ guide }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const { addFavorite, removeFavorite } = useContext(FavoritesContext);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        if (isFavorite) {
            removeFavorite(guide);
        } else {
            addFavorite(guide);
        }
    };

    return (
        <View style={styles.tripCard}>
            <Image source={require('../assets/searchscreen3.jpeg')} style={styles.tripImage} />
            <Text style={styles.tripTitle}>{guide.firstName} {guide.lastName}</Text>
            <Text style={styles.tripSubtitle}>
                Speaks: {Array.isArray(guide.languages) ? guide.languages.join(', ') : guide.languages}
            </Text>
            <View style={styles.tripFooter}>
                <TouchableOpacity onPress={toggleFavorite}>
                    <Icon name="heart" size={20} color={isFavorite ? "#FF1493" : "#000"} />
                </TouchableOpacity>
                <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, index) => (
                        <Icon
                            key={index}
                            name="star"
                            size={20}
                            color={index < guide.averageRating ? "#FFD700" : "#ccc"}
                        />
                    ))}
                    <Text style={styles.ratingText}>{guide.averageRating}/5</Text>
                </View>
            </View>
        </View>
    );
};
export default function SearchScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { width } = Dimensions.get('window');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [isFromDatePickerVisible, setFromDatePickerVisibility] = useState(false);
    const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);
    const [people, setPeople] = useState('');
    const [temperature, setTemperature] = useState(null);
    const [hasCar, setHasCar] = useState(false);
    const scrollViewRef = useRef(null);
     const tourist = route.params?.tourist;
    const [searchQuery, setSearchQuery] = useState('');
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [guides, setGuides] = useState([]);
    const [routes, setRoutes] = useState([]); // Add routes state
    const [tourDate, setTourDate] = useState(new Date());
    const [specialRequests, setSpecialRequests] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    useEffect(() => {
        fetchTemperature();
        fetchCountries();
        fetchGuides();
        fetchRoutes(); // Fetch routes data
    }, []);

    const fetchTemperature = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
            );
            setTemperature(response.data.main.temp);
        } catch (error) {
            console.error('Error fetching temperature:', error);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all');
            const countriesData = response.data.map(country => ({
                name: country.name.common,
                website: country.tld ? `https://${country.tld[0]}` : ''
            }));
            setCountries(countriesData);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const fetchGuides = async () => {
        try {
            const response = await axios.get('http://guides.somee.com/api/GuidesRW');
            setGuides(response.data);
        } catch (error) {
            console.error('Error fetching guides:', error);
        }
    };

    const fetchRoutes = async () => {
        try {
            const response = await axios.get('http://guides.somee.com/api/GuidesRW/routes'); // Adjust API endpoint
            setRoutes(response.data); // Set routes data
        } catch (error) {
            console.error('Error fetching routes:', error);
        }
    };

    const handleLogout = () => {
        console.log('Logout pressed');
        console.log(`Open Cage API Key: ${OPEN_CAGE_API}`);
    };

    const handleConfirmFromDate = (date) => {
        setFromDate(date);
        setFromDatePickerVisibility(false);
    };

    const handleConfirmToDate = (date) => {
        setToDate(date);
        setToDatePickerVisibility(false);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            const filteredData = countries.filter(country =>
                country.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredCountries(filteredData);
        } else {
            setFilteredCountries([]);
        }
    };
    const handleAddBooking = async (routeId, guideId) => {
        console.log("handleAddBooking called", { routeId, guideId, touristId: tourist?.id, tourDate, specialRequests });
    
        if (!tourist || !tourist.id) {
            console.error("Tourist information is missing.");
            Alert.alert("Error", "Tourist information is missing.");
            return;
        }
    
        const booking = {
            TouristId: tourist.id,
            GuideId: guideId,
            RouteId: routeId,
            TourDate: tourDate,
            BookingStatus: 'pending',
            SpecialRequests: specialRequests
        };
    
        console.log("Attempting to add booking with data:", booking);
    
        try {
            const response = await axios.post('http://guides.somee.com/api/Tourists/addBooking', booking);
            if (response.status === 201) {
                console.log("Booking added successfully!");
                Alert.alert("Success", "Booking added successfully!");
            } else {
                console.error("Unable to complete booking.", response);
                throw new Error('Unable to complete booking.');
            }
        } catch (error) {
            console.error('Error adding booking:', error);
            Alert.alert("Error", "Failed to add booking: " + error.message);
        }
    };
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    

    const onDateConfirmed = (event, selectedDate) => {
        const currentDate = selectedDate || tourDate;
        console.log("Date confirmed:", currentDate);
        setTourDate(currentDate);
        setDatePickerVisibility(false);  
    };
    

    const openWebsite = (website) => {
        if (website) {
            Linking.openURL(website).catch((err) => console.error('Failed to open URL:', err));
        } else {
            alert('No website available for this country');
        }
    };

    const renderCountry = ({ item }) => (
        <TouchableOpacity style={styles.countryItem} onPress={() => openWebsite(item.website)}>
            <Text style={styles.countryName}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderTripCard = ({ item }) => (
        <TripCard guide={item} />
    );

    const renderRouteCard = ({ item }) => (
        <View style={styles.tripCard}>
            <Image source={require('../assets/searchscreen2.jpeg')} style={styles.tripImage} />
            <Text style={styles.tripTitle}>{item.description}</Text>
            <Text style={styles.tripSubtitle}>Start: {item.startPoint}</Text>
            <Text style={styles.tripSubtitle}>End: {item.endPoint}</Text>
            <Text style={styles.tripSubtitle}>Duration: {item.duration} hrs</Text>
            <Text style={styles.tripSubtitle}>Difficulty: {item.difficultyLevel}</Text>
            <Text style={styles.tripSubtitle}>Type: {item.routeType}</Text>
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => {
                    if (tourDate && specialRequests !== '') {
                        handleAddBooking(item.routeId, item.guideId); // Assuming routeId and guideId are properties of item
                    } else {
                        showDatePicker(); // Show the date picker if date or requests are not set
                    }
                }}
            >
                <Text style={styles.addButtonText}>Add Booking</Text>
            </TouchableOpacity>
            {isDatePickerVisible && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={tourDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onDateConfirmed}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="Special Requests"
                value={specialRequests}
                onChangeText={setSpecialRequests}
            />
        </View>
    );
    
    
    
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                    <GuidesLogo width={50} height={50} style={styles.logo} />
                    <Text style={styles.tempText}>
                        {temperature !== null && `${temperature}°C`}
                    </Text>
                </View>
                <View style={styles.featuredContainer}>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={(event) => {
                            const index = Math.floor(event.nativeEvent.contentOffset.x / width);
                            setCurrentImageIndex(index);
                        }}
                        scrollEventThrottle={16}
                    >
                        {images.map((image, index) => (
                            <Image
                                key={index}
                                source={image}
                                style={[styles.featuredImage, { width }]}
                            />
                        ))}
                    </ScrollView>
                    <View style={styles.inputContainer}>
                        <View style={styles.searchSection}>
                            <Icon name="search" size={20} color="#fff" style={styles.searchIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Choose your destination"
                                placeholderTextColor="#ccc"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={searchQuery}
                                onChangeText={handleSearch}
                            />
                        </View>
                        <View style={styles.sideInputs}>
                            <TouchableOpacity onPress={() => setFromDatePickerVisibility(true)} style={styles.dateInput}>
                                <Text style={styles.dateInputText}>{fromDate.toDateString()}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setToDatePickerVisibility(true)} style={styles.dateInput}>
                                <Text style={styles.dateInputText}>{toDate.toDateString()}</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.peopleInput}
                                placeholder="People"
                                placeholderTextColor="#ccc"
                                keyboardType="numeric"
                                value={people}
                                onChangeText={setPeople}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>
                </View>
                <DateTimePickerModal
                    isVisible={isFromDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirmFromDate}
                    onCancel={() => setFromDatePickerVisibility(false)}
                    textColor="black"
                />
                <DateTimePickerModal
                    isVisible={isToDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirmToDate}
                    onCancel={() => setToDatePickerVisibility(false)}
                    textColor="black"
                />
                {searchQuery.length > 0 && (
                    <FlatList
                        data={filteredCountries}
                        keyExtractor={(item) => item.name}
                        renderItem={renderCountry}
                        style={styles.list}
                    />
                )}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Guides</Text>
                </View>
                <FlatList
                    data={guides}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderTripCard}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.horizontalScroll}
                />
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Available Routes</Text>
                </View>
                <FlatList
                    data={routes}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderRouteCard}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.horizontalScroll}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'linear-gradient(45deg, #1d976c, #93f9b9)', // Soft green gradient background
    },
    contentContainer: {
        paddingTop: 0, // Align the content to the top of the screen
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 2,
        borderBottomColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    tempText: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    logo: {
        flex: 1,
        alignItems: 'flex-end',
    },
    logoutButton: {
        backgroundColor: '#FF1493',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20, // Pill-shaped button
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase', // Uppercase text
    },
    featuredContainer: {
        position: 'relative',
        height: 250, // Make the featured section larger
        marginBottom: 30,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
    featuredImage: {
        height: '100%',
        borderRadius: 20,
    },
    inputContainer: {
        position: 'absolute',
        top: '50%',
        left: '5%',
        right: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark translucent background
        borderRadius: 10, // Rounded corners for input
        paddingHorizontal: 15,
        height: 55, // Increase height for better touch experience
        borderColor: '#fff',
        borderWidth: 1.5,
        flex: 2,
        marginRight: 10,
    },
    searchIcon: {
        marginRight: 10,
        color: '#fff', // White search icon
    },
    input: {
        flex: 1,
        height: '100%',
        color: '#fff', // White text inside the input
        fontSize: 16,
    },
    sideInputs: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 3,
    },
    dateInput: {
        flex: 1,
        height: 55,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark translucent background
        borderRadius: 10,
        paddingHorizontal: 15,
        borderColor: '#fff',
        borderWidth: 1.5,
        justifyContent: 'center',
        marginRight: 10,
    },
    dateInputText: {
        color: '#fff', // White text
    },
    peopleInput: {
        flex: 1,
        height: 55,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 10,
        paddingHorizontal: 15,
        borderColor: '#fff',
        borderWidth: 1.5,
        color: '#fff',
    },
    list: {
        flex: 1,
        padding: 20,
    },
    countryItem: {
        padding: 20,
        borderBottomWidth: 1.5,
        borderBottomColor: '#ccc',
        backgroundColor: '#f9f9f9', // Soft white background for each item
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 6,
    },
    countryName: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    horizontalScroll: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    tripCard: {
        backgroundColor: '#fff',
        borderRadius: 20, 
        padding: 15,
        margin: 10,
        width: 300, // Adjust width as necessary
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
        flexDirection: 'column', // Ensure contents are stacked vertically
    },
    
    tripImage: {
        width: 270, // Slightly smaller than the card to fit well
        height: 140,
        borderRadius: 15,
        marginBottom: 10,
    },
    
    tripTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5, // Space between title and subtitles
    },
    
    tripSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center', // Center-align the text
        marginBottom: 5, // Space between each subtitle
    },
    
    addButton: {
        marginTop: 10,
        backgroundColor: '#4CAF50', 
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 4,
        width: '100%', // Ensure the button stretches to the width of the card
    },
    
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
    },
    ratingText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderTopWidth: 1.5,
        borderTopColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    footerButton: {
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: 14,
        color: '#555',
        marginTop: 8,
        fontWeight: 'bold',
    },
    addButton: {
        marginTop: 10,
        backgroundColor: '#4CAF50', // Green background
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 4,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
});