// import React, { useEffect, useState } from 'react';
// import { Button, TextInput, ScrollView, Text } from 'react-native';
// import firebase from 'firebase';

// function ChatScreen({ route }) {
//     const { gameId } = route.params;
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');

//     useEffect(() => {
//         const messagesRef = firebase.database().ref('messages/' + gameId);
//         messagesRef.on('value', (snapshot) => {
//             const data = snapshot.val();
//             const items = Object.values(data || {});
//             setMessages(items);
//         });
//     }, [gameId]);

//     const sendMessage = () => {
//         const messagesRef = firebase.database().ref('messages/' + gameId);
//         messagesRef.push({ text: newMessage });
//         setNewMessage('');
//     };

//     return (
//         <ScrollView>
//             {messages.map((message, index) => (
//                 <Text key={index}>{message.text}</Text>
//             ))}
//             <TextInput value={newMessage} onChangeText={setNewMessage} />
//             <Button title="Send" onPress={sendMessage} />
//         </ScrollView>
//     );
// }

// export default ChatScreen;
// React screen called ChatScreen

import React from 'react';
import { View, Text, Button } from 'react-native';
import { Paragraph, Title } from 'react-native-paper';
//React Components
import HeaderMenu from '../components/HeaderMenu.js';

function ChatScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <HeaderMenu navigation={navigation} reactNavigation={navigation} />
        <Title>Work In Progress</Title>
        <Paragraph>Chat Features Coming Soon</Paragraph>
        <Button
          title="Go to Main"
          onPress={() => navigation.navigate('Main')}
        />
      </View>
    );
  }
  
  export default ChatScreen;