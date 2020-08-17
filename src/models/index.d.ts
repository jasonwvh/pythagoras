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