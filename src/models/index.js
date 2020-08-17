// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Quiz, Challenge } = initSchema(schema);

export {
  Quiz,
  Challenge
};