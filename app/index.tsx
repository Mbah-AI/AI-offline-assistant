import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, PermissionsAndroid, Alert } from 'react-native';
import { useLlmInference, LlmInferenceConfig } from 'react-native-llm-mediapipe';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  message: string;
  isUser: boolean;
}

// const requestStoragePermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.check(
//       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//     );
//     if (!granted) {
//       const permissionGranted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission',
//           message: 'This app needs storage permission to function properly',
//           buttonPositive: 'OK',
//         },
//       );
//       return permissionGranted === PermissionsAndroid.RESULTS.GRANTED;
//     } else {
//       console.log('Storage permission already granted');
//       return true;
//     }
//   } catch (err) {
//     console.error(err);
//     return false;
//   }
// };

export default function Index() {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [id, setId] = useState<string | null>(null);
  const config: LlmInferenceConfig = {
    storageType: 'asset', // use 'file' to store the model on the device internal storage instead
    // modelPath: '/data/local/tmp/llm/gemma2-2b-it-cpu-int8.bin',
    
    modelName: 'pytorch_model.bin', // place it in /android/app/src/main/assets/ folder
  }
  // const [generateResponse, setGenerateResponse] = useState<null | Function>(null);

  // useEffect(() => {
  //   requestStoragePermission().then(async (permissionGranted) => {
  //     if (!permissionGranted) {
  //       return;
  //     }
  //     const { generateResponse } = useLlmInference(config);
  //     setGenerateResponse(generateResponse);
  //   });
  // }, []);

  useEffect(() => {
    const newId = uuidv4();
    setId(newId);
  }, []);

  const { generateResponse } = useLlmInference(config);
  const handleGeneratePress = async () => {
    if (generateResponse && id) {
      const response = await generateResponse(prompt);
      const newMessage: Message = { message: response, isUser: false };
      const updatedConversation = [...conversation, { message: prompt, isUser: true }, newMessage];
      await AsyncStorage.setItem(`chat-${id}`, JSON.stringify(updatedConversation));
      setConversation(updatedConversation);
      setPrompt('');
    } else {
      console.log('generateResponse is null');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={conversation}
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPrompt}
          value={prompt}
          placeholder="Enter your prompt here"
        />
        <Button title="Send" onPress={handleGeneratePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
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
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
  },
});
