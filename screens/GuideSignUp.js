import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Switch, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import GuidesLogo from '../assets/guides-logo.svg';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';

// API URL for guide registration
const apiUrl = 'http://guides.somee.com/api/GuidesRW';

export default function GuideSignUp() {
    const navigation = useNavigation();
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [Bio, setBio] = useState('');
    const [Country, setCountry] = useState('');
    const [HasCar, setHasCar] = useState(false);
    const [AverageRating, setAverageRating] = useState(0);  // Optional field
    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');  // New Confirm Password Field
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [Email, setEmail] = useState('');
    const [Languages, setLanguages] = useState('');
    const [DateOfBirth, setDateOfBirth] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // Date picker controls
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const handleConfirmDate = (date) => {
        setDateOfBirth(date);
        hideDatePicker();
    };

    // Function to validate and submit the form
    const btnRegister = () => {
        if (Password !== ConfirmPassword) {
            Alert.alert("Password Mismatch", "Passwords do not match.");
            return;
        }
    
        // Prepare the guide data for submission
        const guideData = {
            FirstName,
            LastName,
            Bio,
            Country,
            HasCar,
            AverageRating: AverageRating || null,  // If not set, send null
            Password,
            PhoneNumber,
            Email,
            DateOfBirth: DateOfBirth ? DateOfBirth.toISOString().split('T')[0] : null,  // Format the date
            Languages,  // Languages as a single string, no array needed
        };
    
        console.log('Sending registration request with:', guideData);
    
        // Submit the form via fetch
        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(guideData),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
            })
        })
        .then(res => {
            console.log('Response status:', res.status);
            if (res.status === 200 || res.status === 201) {
                return res.json();
            } else if (res.status === 400) {
                throw new Error('Registration details not correct');
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(result => {
            console.log('API response:', result);
            navigation.navigate('GuideRegister');
        })
        .catch(error => {
            console.log('Fetch error:', error);
            Alert.alert('Registration Failed', error.message);
        });
    };
    
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <GuidesLogo width={128} height={128} style={styles.logo} />
                <Text style={styles.title}>Guide Register</Text>

                <View style={styles.inputContainer}>
                    <Icon name="user" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={FirstName}
                        onChangeText={setFirstName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="user" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Last Name"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={LastName}
                        onChangeText={setLastName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="info-circle" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Bio"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={Bio}
                        onChangeText={setBio}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="globe" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Country"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={Country}
                        onChangeText={setCountry}
                    />
                </View>

                {/* Date of Birth input */}
                <TouchableOpacity style={styles.inputContainer} onPress={showDatePicker}>
                    <Icon name="calendar" size={20} color="#666" style={styles.inputIcon} />
                    <Text style={styles.dateText}>
                        {DateOfBirth ? DateOfBirth.toDateString() : "Date of Birth"}
                    </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                    themeVariant="light"
                />

                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Has Car?</Text>
                    <Switch value={HasCar} onValueChange={setHasCar} />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="phone" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={PhoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="envelope" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={Email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={Password}
                        onChangeText={setPassword}
                    />
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={ConfirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="language" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Languages Spoken"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={Languages}
                        onChangeText={setLanguages}
                    />
                </View>

                <TouchableOpacity style={styles.registerButton} onPress={btnRegister}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        marginVertical: 10,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
    },
    dateText: {
        flex: 1,
        height: 50,
        textAlignVertical: 'center',
        color: '#666',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
    },
    switchLabel: {
        fontSize: 16,
        color: '#666',
        marginRight: 10,
    },
    registerButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#007BFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginVertical: 20,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

