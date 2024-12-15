import { NativeModules } from 'react-native';
const { ObjectBoxModule } = NativeModules;

export default {
  insertEntity: (textData, textSource) => ObjectBoxModule.insertEntity(textData, textSource),
  getAllEntities: () => ObjectBoxModule.getAllEntities(),
  getMatchingEntities: (searchTerm) => ObjectBoxModule.getMatchingEntities(searchTerm),
};
