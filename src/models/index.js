// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Question, Assignment, Course, Enrollment } = initSchema(schema);

export {
  Question,
  Assignment,
  Course,
  Enrollment
};