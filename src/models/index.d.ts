import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Question {
  readonly id: string;
  readonly assignmentID: string;
  readonly question?: string;
  readonly choices?: string[];
  readonly solution?: number;
  readonly explanation?: string;
  constructor(init: ModelInit<Question>);
  static copyOf(source: Question, mutator: (draft: MutableModel<Question>) => MutableModel<Question> | void): Question;
}

export declare class Assignment {
  readonly id: string;
  readonly courseID: string;
  readonly title: string;
  readonly category?: string;
  constructor(init: ModelInit<Assignment>);
  static copyOf(source: Assignment, mutator: (draft: MutableModel<Assignment>) => MutableModel<Assignment> | void): Assignment;
}

export declare class Course {
  readonly id: string;
  readonly title: string;
  readonly students?: string[];
  constructor(init: ModelInit<Course>);
  static copyOf(source: Course, mutator: (draft: MutableModel<Course>) => MutableModel<Course> | void): Course;
}

export declare class Enrollment {
  readonly id: string;
  readonly courseID?: string;
  readonly courseTitle?: string;
  readonly studentUsername?: string;
  readonly progress?: number;
  constructor(init: ModelInit<Enrollment>);
  static copyOf(source: Enrollment, mutator: (draft: MutableModel<Enrollment>) => MutableModel<Enrollment> | void): Enrollment;
}