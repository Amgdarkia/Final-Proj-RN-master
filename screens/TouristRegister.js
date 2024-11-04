// screens/TouristRegister.js

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import GoogleLogo from '../assets/google-logo.svg';
import FacebookLogo from '../assets/Facebook_f_logo_(2019).svg';
import AppleLogo from '../assets/Apple_logo_black.svg';
import GuidesLogo from '../assets/guides-logo.svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

// const apiUrl = 'https://application-guides.onrender.com/api/tourists';
const apiUrl = 'http://guides.somee.com/api/Tourists';
export default function TouristRegister() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const btnRegister = () => {
        const s = {
            Email: email, // Change this to match the expected key
            pass: password // Change this to match the expected key
        };
    
        console.log('Sending registration request with:', s);
    
        fetch(apiUrl + '/login', {
            method: 'POST',
            body: JSON.stringify(s),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
            })
        })
        .then(res => {
            console.log('Response status:', res.status);
            if (res.status === 200) {
                return res.json(); // Assuming the API returns the tourist details
            } else if (res.status === 404) {
                throw new Error('Email or Password not correct');
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(result => {
            console.log('API response:', result);
        
            // Navigate to HomePage and pass tourist data as params
            navigation.navigate('HomePage', { tourist: result });
        })
        .catch(error => {
            console.log('Fetch error:', error);
            Alert.alert('Login Failed', error.message);
        });
        
    };
    

    return (
        <View style={styles.container}>
            <GuidesLogo width={128} height={128} style={styles.logo} />
            <Text style={styles.title}>Tourist Register</Text>
            <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
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
                    value={password}
                    onChangeText={setPassword}
                />
            </View>
            <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity>
                    <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.loginButton}
                onPress={btnRegister} // Call btnRegister on press
            >
                <Text style={styles.loginButtonText}>Register</Text>
            </TouchableOpacity>
            <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>OR</Text>
                <View style={styles.separatorLine} />
            </View>
            <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#FFFFFF' }]}>
                    <GoogleLogo width={32} height={32} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#FFFFFF' }]}>
                    <FacebookLogo width={32} height={32} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#FFFFFF' }]}>
                    <AppleLogo width={32} height={32} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('TouristSignUp')} // Navigate to TouristRegister
            >
                <Text style={styles.registerButtonText}>Register as tourist</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'linear-gradient(135deg, #12c2e9, #c471ed, #f64f59)', // Amazing gradient from blue to pink to red
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        marginBottom: 30, // A bit more space for visual balance
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    title: {
        fontSize: 28, // Bigger title for better emphasis
        fontWeight: 'bold',
        color: '#fff', // White text to contrast with background
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.3)', // Soft text shadow
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white for inputs
        paddingHorizontal: 15,
        marginVertical: 15,
        borderRadius: 10,
        borderColor: 'rgba(255, 255, 255, 0.7)', // Subtle white border
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    inputIcon: {
        marginRight: 15,
        color: '#007BFF', // Icon color to match button
    },
    input: {
        flex: 1,
        height: 55,
        color: '#333', // Dark input text for contrast
        fontSize: 16,
    },
    forgotPasswordContainer: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    forgotPasswordText: {
        color: '#fff', // White text for forgot password
        fontSize: 14,
        textDecorationLine: 'underline', // Underline for emphasis
    },
    loginButton: {
        width: '100%',
        height: 55, // Taller button for better touch experience
        backgroundColor: 'linear-gradient(90deg, #007BFF, #00c6ff)', // Vibrant gradient for login button
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10, // Smooth rounded corners
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        marginVertical: 20,
    },
    loginButtonText: {
        color: '#fff', // White text for contrast
        fontSize: 18, // Slightly bigger font for better visibility
        fontWeight: 'bold',
        textTransform: 'uppercase', // Strong uppercase look
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 30,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Faded white separator line
    },
    separatorText: {
        marginHorizontal: 15,
        fontSize: 16,
        color: '#fff', // White text for separator
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 30,
    },
    socialButton: {
        width: 110,
        height: 60,
        backgroundColor: '#fff', // Clean white for social buttons
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginHorizontal: 10,
    },
    registerButton: {
        marginTop: 30,
    },
    registerButtonText: {
        color: 'blue', // White text to fit theme
        fontSize: 16,
        fontWeight: 'bold',
    },
});