# Data model

The structure of Yoko's data, for both the database (PostgreSQL) and the back-end. The conventions behind it (id + UUID, `text` with CHECK, lookup tables) are in [decision 003](../decisions/003-database-conventions.md).

```mermaid
---
title: Yoko entity-relationship diagram
---
erDiagram
    USER }|--o| ADDRESS : ""
    USER {
        INT ID
        UUID7 UUID
        varchar(100) username
        ADDRESS addressId
        datetime createdAt
        datetime updatedAt
        datetime deletedAt
    }

    ADDRESS {
        INT ID
        UUID7 UUID
        varchar city
        varchar country
        char(2) state
        varchar latitude
        varchar longitude
        datetime createdAt
        datetime updatedAt
    }

    OCCURRENCE ||--o{ OCCURRENCE-CATEGORY : ""
    OCCURRENCE }|--|| USER : ""
    OCCURRENCE |o--o| GOAL : ""
    OCCURRENCE {
        INT ID
        UUID7 UUID
        varchar(50) title
        varchar(250) description
        USER userId
        GOAL goalId
        boolean isEvent
        boolean allDay
        string[] weekDayRepetition
        int monthRepetitionSpace
        int monthRepetition
        int weekRepetitionSpace
        int weekRepetition
        int yearRepetitionSpace
        int yearRepetition
        string endsType
        date endDateOfOccurrence
        int qntOccurrencesTillEnd
        date dateOfOccurrence
        time startTime
        time endTime
        OCCURRENCE-CATEGORY occurrenceCategory
        timestampz createdAt
        timestampz updatedAt
        timestampz deletedAt
    }

    OCCURRENCE-DATE }o--|| OCCURRENCE : ""
    OCCURRENCE-DATE {
        INT ID
        UUID7 UUID
        date dateOfOccurrence
        enum status
        OCCURRENCE occurrenceId
        timestampz createdAt
        timestampz updatedAt
        timestampz deletedAt
    }

    OCCURRENCE-CATEGORY {
        INT ID
        UUID7 UUID
        varchar(100) description
        datetime createdAt
        datetime updatedAt
    }

    GOAL {
        INT ID
        UUID7 UUID
        varchar(100) description
        OCCURRENCE occurrenceId
        boolean isMet
        datetime createdAt
        datetime updatedAt
        datetime deletedAt
    }

    NOTE }|--|| USER : ""
    NOTE {
        INT ID
        UUID7 UUID
        varchar(150) title
        text description
        USER userId
        datetime createdAt
        datetime updatedAt
        datetime deletedAt
    }

    TASK ||--o{ TASK-CATEGORY : ""
    TASK }|--|| USER : ""
    TASK {
        INT ID
        UUID7 UUID
        varchar(100) description
        date dateOfTask
        time initTime
        time endTime
        USER userId
        TASK-CATEGORY taskCategory
        datetime createdAt
        datetime updatedAt
        datetime deletedAt
    }

    TASK-CATEGORY {
        INT ID
        UUID7 UUID
        varchar(100) description
        datetime createdAt
        datetime updatedAt
    }

    MOOD-HISTORY ||--o{ MOOD : ""
    MOOD-HISTORY }|--|| USER : ""
    MOOD-HISTORY {
        INT ID
        UUID7 UUID
        USER userId
        MOOD mood
        varchar(150) description
        datetime createdAt
        datetime updatedAt
    }

    MOOD {
        INT ID
        UUID7 UUID
        varchar(100) description
        datetime createdAt
        datetime updatedAt
    }
```

## Notes

- `deletedAt` marks a soft delete. Occurrences, tasks and notes stay in the history for tracking, as the [product requirements](../product/requirements.md) ask.
- `ADDRESS` only exists to find the user's coordinates when they don't share their location. See [decision 004](../decisions/004-period-of-the-day.md).
- How users are stored depends on the authentication provider, which is still open in #144.
