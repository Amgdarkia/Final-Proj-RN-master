// screens/GuideRegister.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import GoogleLogo from '../assets/google-logo.svg';
import FacebookLogo from '../assets/Facebook_f_logo_(2019).svg';
import AppleLogo from '../assets/Apple_logo_black.svg';
import GuidesLogo from '../assets/guides-logo.svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

// Updated API URL
const apiUrl = 'http://guides.somee.com/api/GuidesRW';           //'https://application-guides.onrender.com/api/guides';

export default function GuideRegister() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const btnLogin = () => {
        const credentials = {
            Email: email,
            pass: password
        };

        console.log('Sending login request with:', credentials);

        fetch(apiUrl + '/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                console.log('Response status:', res.status);
                if (res.status === 200) {
                    return res.json();
                } else if (res.status === 404) {
                    throw new Error('Email or Password not correct');
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(result => {
                console.log('API response:', result);
                const guide = {
                    id: result.id,
                    email: result.email,
                    first_name: result.firstName,
                    last_name: result.lastName,
                };
                
                navigation.navigate('HomePageGuide', { guide });
            })
            .catch(error => {
                console.log('Fetch error:', error);
                Alert.alert('Login Failed', error.message);
            });
    };

    return (
        <View style={styles.container}>
            <GuidesLogo width={128} height={128} style={styles.logo} />
            <Text style={styles.title}>Guide Login</Text>
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
                onPress={btnLogin}
            >
                <Text style={styles.loginButtonText}>Login</Text>
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
                onPress={() => navigation.navigate('GuideSignUp')}
            >
                <Text style={styles.registerButtonText}>Register as guide</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'linear-gradient(135deg, #ff9966, #ff5e62)', // Stunning orange-pink gradient background
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        marginBottom: 30, // Increase space for better aesthetics
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10, // Depth effect for logo
    },
    title: {
        fontSize: 28, // Larger title for emphasis
        fontWeight: 'bold',
        color: '#fff', // White text for contrast
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.3)', // Soft shadow for depth
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white background
        paddingHorizontal: 15,
        marginVertical: 15,
        borderRadius: 10,
        borderColor: 'rgba(255, 255, 255, 0.7)', // Subtle white border
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10, // Smooth elevation for input containers
    },
    inputIcon: {
        marginRight: 10,
        color: '#007BFF', // Icon color to match the button
    },
    input: {
        flex: 1,
        height: 55, // Taller input for better touch experience
        color: '#333', // Dark text color for readability
        fontSize: 16,
    },
    forgotPasswordContainer: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    forgotPasswordText: {
        color: '#fff', // White text for contrast
        fontSize: 14,
        textDecorationLine: 'underline', // Underline for clickable effect
    },
    loginButton: {
        width: '100%',
        height: 55, // Taller button for better clickability
        backgroundColor: 'linear-gradient(90deg, #007BFF, #00c6ff)', // Vibrant blue gradient button
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10, // Rounded edges for smoothness
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 12, // Depth for login button
        marginVertical: 20,
    },
    loginButtonText: {
        color: '#fff', // White text for contrast
        fontSize: 18, // Larger font size for readability
        fontWeight: 'bold',
        textTransform: 'uppercase', // Strong uppercase for CTA
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
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Soft white separator line
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
        width: 100,
        height: 60,
        backgroundColor: '#fff', // Clean white background for buttons
        borderRadius: 20, // Smooth rounded corners
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10, // Deeper shadow for social buttons
        marginHorizontal: 10, 
    },
    registerButton: {
        marginTop: 20,
    },
    registerButtonText: {
        color: '#fff', // White text for contrast
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase', // Strong uppercase for the register button
    },
}); 