import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  message: string;
  isUser: boolean;
}

const ChatView = ({ navigation, route }) => {
  const { id } = route?.params ?? null;
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const loadChat = async () => {
      const storedMessages = await AsyncStorage.getItem(`chat-${id}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    };
    loadChat();
  }, [id]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.message, item.isUser ? styles.userMessage : styles.aiMessage]}>
            <Text>{item.message}</Text>
            {!item.isUser && (
              <Button title="Source" onPress={() => Alert.alert('Source', 'Insert source here')} />
            )}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: '#ddf',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#ddd',
    alignSelf: 'flex-start',
  },
});


export default ChatView;