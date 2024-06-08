import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, StyleSheet, Dimensions, Platform } from 'react-native';
import { TextInput, Button, Card, Icon } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { loadAccount } from '../redux/actions/accountActions';



// Use the auth object for authentication operations

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const testAccounts = {
        'Test1': 'password1',
        'Test2': 'password2',
        // add more test accounts as needed
    };
    const signIn = async (email, password) => {
        console.log(`Attempting to sign in with email: ${email}, password: ${password}`);
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            console.log('User signed in successfully!');
            // Use user.uid instead of email for loadAccount
            dispatch(loadAccount(userCredential.user.uid)); 
            console.log('Account loaded successfully!')
            navigation.navigate('App', { screen: 'MainScreen' });
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <Card style={{ width: Dimensions.get('window').width * 0.8 }}>
                    {/*React Native image component that is centered within the parent component*/}
                    <Image source={require('../../assets/playersedge.png')} style={{ width: 200, height: 200, alignSelf: 'center' }} />
                    <Card.Content>
                        <TextInput
                            label="Email"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                        <Button mode="contained" onPress={() => signIn(username, password)}>
                            Login
                        </Button>
                        {/* Add a button to navigate to the SignUpScreen component with username and password as parameters*/}
                        <Button mode="text" onPress={() => navigation.navigate('SignUpScreen')}>
                            Sign Up
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

export default LoginScreen;