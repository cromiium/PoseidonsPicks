import React, { useState } from 'react';
import { View, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, StyleSheet, Dimensions, Platform } from 'react-native';
import { TextInput, Button, Card, Icon } from 'react-native-paper';
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import { createAccount } from '../redux/actions/accountActions';

const SignUpScreen = ({ navigation }) => {
    const [userID, setUserID] = useState('');
    const [firstName, setFirstName] = useState(''); // Added state variable for first name
    const [lastName, setLastName] = useState(''); // Added state variable for last name
    const [email, setEmail] = useState(''); // Added state variable for email
    const [password, setPassword] = useState('');


    const handleSignUp = () => {
        // Add any validation for email and password here

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Account creation successful, user is signed in
                const user = userCredential.user;
                // You can navigate to another screen here or update state
                // Navigate to MainScreen after creating the account
                navigation.navigate('App', { screen: 'MainScreen' });
                console.log("User created successfully with email: ", user.email);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // Handle errors here, such as displaying a message to the user
                console.error("Error creating user: ", errorCode, errorMessage);
            });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <Card style={{ width: Dimensions.get('window').width * 0.8 }}>
                    <Image source={require('../../assets/playersedge.png')} style={{ width: 200, height: 200, alignSelf: 'center' }} />
                    <Card.Content>
                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                        <TextInput
                            label="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <TextInput
                            label="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        <Button mode="contained" onPress={handleSignUp}>
                            Sign Up
                        </Button>
                        <Button onPress={() => navigation.goBack()}>
                            Back
                        </Button>

                    </Card.Content>
                </Card>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SignUpScreen;