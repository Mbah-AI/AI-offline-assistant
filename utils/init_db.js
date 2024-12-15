import ObjectBox from './ObjectBox';

export const initializeDatabase = async () => {
  try {
    const allEntities = await ObjectBox.getAllEntities();
    if (allEntities.length > 0) {
      console.log('Database already contains data. Skipping initialization.');
      return;
    }
    const textDataEmbedding = new Float32Array([0.1, 0.2, 0.3, 0.4]);
    const entities = [
      { textData: 'Example text 1', textSource: 'Source A', textDataEmbedding },
      { textData: 'Example text 2', textSource: 'Source B', textDataEmbedding },
      { textData: 'Example text 3', textSource: 'Source C', textDataEmbedding },
    ];

    for (let entity of entities) {
      const id = await ObjectBox.insertEntity(entity.textData, entity.textSource, entity.textDataEmbedding);
      console.log(`Inserted entity with ID: ${id}`);
    }

    console.log('Database initialized successfully with sample data!');
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
};
