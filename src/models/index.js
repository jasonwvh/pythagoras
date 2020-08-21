// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Quiz, Challenge, Classroom, ClassEnrollment } = initSchema(schema);

export {
  Quiz,
  Challenge,
  Classroom,
  ClassEnrollment
};