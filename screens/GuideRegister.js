// screens/GuideRegister.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import GoogleLogo from '../assets/google-logo.svg';
import FacebookLogo from '../assets/Facebook_f_logo_(2019).svg';
import AppleLogo from '../assets/Apple_logo_black.svg';
import GuidesLogo from '../assets/guides-logo.svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


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
                
                navigation.navigate('ProfileScreen', { guide });
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
        backgroundColor: '#F9FAFB', // Light background for a clean, modern look
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: '600',
        color: '#333', // Darker text for readability
        marginBottom: 20,
        letterSpacing: 0.5, // Slight letter spacing for modern look
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#FFFFFF', // White background for contrast
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB', // Subtle border color
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    inputIcon: {
        marginRight: 10,
        color: '#3B82F6', // Soft blue for a welcoming icon color
    },
    input: {
        flex: 1,
        height: 50,
        color: '#333',
        fontSize: 16,
    },
    forgotPasswordContainer: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 15,
    },
    forgotPasswordText: {
        color: '#3B82F6', // Soft blue to match the icon
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#3B82F6', // Consistent soft blue for button
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginVertical: 20,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.8, // Slight letter spacing for modern touch
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 20,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#D1D5DB', // Light separator color for elegance
    },
    separatorText: {
        marginHorizontal: 10,
        fontSize: 14,
        color: '#6B7280', // Muted text color for "OR"
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    socialButton: {
        width: 90,
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginHorizontal: 5,
    },
    registerButton: {
        marginTop: 15,
    },
    registerButtonText: {
        color: '#3B82F6',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline', // Underline for modern effect
    },
});
