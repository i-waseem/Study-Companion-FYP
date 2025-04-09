# Study Companion Use Cases

## Actors
- **Student**: Primary user of the system
- **System**: The Study Companion application
- **AI Service**: Google Gemini API
- **Database**: MongoDB storage

## Use Case Diagrams

### Authentication Use Cases
```
┌─────────────────────────────────────────────┐
│              Study Companion                │
│                                            │
│  ┌──────────────┐        ┌──────────────┐  │
│  │   Register   │        │    Login     │  │
│  └──────────────┘        └──────────────┘  │
│         ▲                      ▲           │
│         │                      │           │
│         │                      │           │
│    ┌────┴──────────────────────┴────┐     │
│    │            Student            │     │
│    └─────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

### Quiz Management Use Cases
```
┌─────────────────────────────────────────────────────┐
│                 Study Companion                     │
│                                                    │
│  ┌──────────────┐        ┌──────────────┐         │
│  │  Select      │        │  Generate    │         │
│  │  Subject     │───────▶│   Quiz      │         │
│  └──────────────┘        └──────────────┘         │
│         ▲                      │                   │
│         │                      ▼                   │
│         │                ┌──────────────┐         │
│         │                │   Take       │         │
│    ┌────┴────┐          │   Quiz      │         │
│    │ Student │          └──────────────┘         │
│    └─────────┘                │                   │
│         │                     ▼                   │
│         │                ┌──────────────┐         │
│         └───────────────▶│   View       │         │
│                         │  Results     │         │
│                         └──────────────┘         │
└─────────────────────────────────────────────────┘
```

### Learning Management Use Cases
```
┌───────────────────────────────────────────────────────┐
│                  Study Companion                      │
│                                                      │
│  ┌──────────────┐    ┌──────────────┐               │
│  │   View       │    │   Create     │               │
│  │  Subjects    │    │  Flashcards  │               │
│  └──────────────┘    └──────────────┘               │
│         ▲                   ▲                        │
│         │                   │                        │
│    ┌────┴───────────────────┴────┐                  │
│    │          Student           │                  │
│    └────────────┬───────────────┘                  │
│                 │                                   │
│                 ▼                                   │
│  ┌──────────────┐    ┌──────────────┐              │
│  │   Track      │    │   View       │              │
│  │  Progress    │    │  Notes       │              │
│  └──────────────┘    └──────────────┘              │
└───────────────────────────────────────────────────┘
```

## Detailed Use Cases

### Authentication
1. **Register**
   - Actor: Student
   - Flow:
     1. Enter username, email, password
     2. System validates input
     3. System creates account
     4. System generates JWT token
     5. Student is logged in

2. **Login**
   - Actor: Student
   - Flow:
     1. Enter email and password
     2. System validates credentials
     3. System generates JWT token
     4. Student accesses system

### Quiz Management
1. **Generate Quiz**
   - Actor: Student, AI Service
   - Flow:
     1. Select subject, course, topic
     2. System requests quiz from AI
     3. AI generates questions
     4. System presents quiz

2. **Take Quiz**
   - Actor: Student
   - Flow:
     1. Answer questions
     2. Submit answers
     3. System calculates score
     4. System displays results

### Learning Management
1. **Track Progress**
   - Actor: Student
   - Flow:
     1. View completed quizzes
     2. See performance metrics
     3. Track improvement

2. **Manage Notes**
   - Actor: Student
   - Flow:
     1. Create/edit notes
     2. Organize by subject
     3. Save and retrieve notes

## Security Considerations
- Password encryption
- JWT token validation
- Session management
- Input validation
- Error handling
