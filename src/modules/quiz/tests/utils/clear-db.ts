import { DataSource } from 'typeorm';

export const clearDb = async (dataSource: DataSource) => {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repo = dataSource.getRepository(entity.name);
    await repo.query(
      `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE`,
    );
  }
};
