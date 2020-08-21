/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateQuiz = /* GraphQL */ `
  subscription OnCreateQuiz {
    onCreateQuiz {
      id
      title
      category
      challenges {
        items {
          id
          quizID
          title
          subtitle
          choices
          solution
          explanation
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateQuiz = /* GraphQL */ `
  subscription OnUpdateQuiz {
    onUpdateQuiz {
      id
      title
      category
      challenges {
        items {
          id
          quizID
          title
          subtitle
          choices
          solution
          explanation
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteQuiz = /* GraphQL */ `
  subscription OnDeleteQuiz {
    onDeleteQuiz {
      id
      title
      category
      challenges {
        items {
          id
          quizID
          title
          subtitle
          choices
          solution
          explanation
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onCreateChallenge = /* GraphQL */ `
  subscription OnCreateChallenge {
    onCreateChallenge {
      id
      quizID
      title
      subtitle
      choices
      solution
      explanation
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateChallenge = /* GraphQL */ `
  subscription OnUpdateChallenge {
    onUpdateChallenge {
      id
      quizID
      title
      subtitle
      choices
      solution
      explanation
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteChallenge = /* GraphQL */ `
  subscription OnDeleteChallenge {
    onDeleteChallenge {
      id
      quizID
      title
      subtitle
      choices
      solution
      explanation
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClassroom = /* GraphQL */ `
  subscription OnCreateClassroom {
    onCreateClassroom {
      id
      title
      students
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClassroom = /* GraphQL */ `
  subscription OnUpdateClassroom {
    onUpdateClassroom {
      id
      title
      students
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClassroom = /* GraphQL */ `
  subscription OnDeleteClassroom {
    onDeleteClassroom {
      id
      title
      students
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClassEnrollment = /* GraphQL */ `
  subscription OnCreateClassEnrollment {
    onCreateClassEnrollment {
      id
      classroomID
      classroomTitle
      studentUsername
      progress
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClassEnrollment = /* GraphQL */ `
  subscription OnUpdateClassEnrollment {
    onUpdateClassEnrollment {
      id
      classroomID
      classroomTitle
      studentUsername
      progress
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClassEnrollment = /* GraphQL */ `
  subscription OnDeleteClassEnrollment {
    onDeleteClassEnrollment {
      id
      classroomID
      classroomTitle
      studentUsername
      progress
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
