import { NativeModules } from 'react-native';
const { ObjectBoxModule } = NativeModules;

export default {
  insertEntity: (textData, textSource, textDataEmbedding) => {
    return ObjectBoxModule.insertEntity(textData, textSource, textDataEmbedding);
  },

  getAllEntities: () => {
    return ObjectBoxModule.getAllEntities();
  },

  getMatchingEntities: (queryEmbedding) => {
    return ObjectBoxModule.getMatchingEntities(queryEmbedding);
  },
};
