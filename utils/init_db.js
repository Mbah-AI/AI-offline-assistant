import ObjectBox from './ObjectBox';

export const initializeDatabase = async () => {
  try {
    const allEntities = await ObjectBox.getAllEntities();
    if (allEntities.length > 0) {
      console.log('Database already contains data. Skipping initialization.');
      return;
    }
    const entities = [
      { textData: 'Example text 1', textSource: 'Source A' },
      { textData: 'Example text 2', textSource: 'Source B' },
      { textData: 'Example text 3', textSource: 'Source C' },
    ];

    for (let entity of entities) {
      const id = await ObjectBox.insertEntity(entity.textData, entity.textSource);
      console.log(`Inserted entity with ID: ${id}`);
    }

    console.log('Database initialized successfully with sample data!');
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
};
