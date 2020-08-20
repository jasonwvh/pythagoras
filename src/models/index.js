// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Quiz, Challenge, Classroom, Student } = initSchema(schema);

export {
  Quiz,
  Challenge,
  Classroom,
  Student
};