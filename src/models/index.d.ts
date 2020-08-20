import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Quiz {
  readonly id: string;
  readonly title: string;
  readonly category?: string;
  readonly challenges?: Challenge[];
  constructor(init: ModelInit<Quiz>);
  static copyOf(source: Quiz, mutator: (draft: MutableModel<Quiz>) => MutableModel<Quiz> | void): Quiz;
}

export declare class Challenge {
  readonly id: string;
  readonly quizID: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly choices?: string[];
  readonly solution?: number;
  readonly explanation?: string;
  constructor(init: ModelInit<Challenge>);
  static copyOf(source: Challenge, mutator: (draft: MutableModel<Challenge>) => MutableModel<Challenge> | void): Challenge;
}

export declare class Classroom {
  readonly id: string;
  readonly title: string;
  readonly students?: string[];
  constructor(init: ModelInit<Classroom>);
  static copyOf(source: Classroom, mutator: (draft: MutableModel<Classroom>) => MutableModel<Classroom> | void): Classroom;
}

export declare class Student {
  readonly id: string;
  readonly username: string;
  readonly classes?: string[];
  constructor(init: ModelInit<Student>);
  static copyOf(source: Student, mutator: (draft: MutableModel<Student>) => MutableModel<Student> | void): Student;
}