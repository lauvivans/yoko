# Product requirements

What Yoko does and the rules each feature follows. Use it to check whether a change does what the product expects.

## Features

Base features:

- Create, read, update and delete notes.
- Create, read, update and delete events.
- Create, read, update and delete recurring actions.
- Create, read, update and delete tasks.
- Register a mood and read the mood history.
- Import (generator) and export data.
- Period of the day (sunrise, morning, noon, afternoon, sunset, night and dawn), with a friendly message and the time. See [decision 004](../decisions/004-period-of-the-day.md).

Planned:

- Semantic search.
- MCP.

## General

- The user needs to sign in to keep their data long term.
- Every main feature works without signing in. That data is saved locally, and it is synchronized when the user signs in.
- The main features are reachable from the header menu and from the home page.
- The user can switch between a light and a dark theme.
- Sign-in methods: Google, e-mail and password, and magic link.

## Occurrences

An occurrence is an event or a recurring action. It has:

- an id;
- a short title;
- a category: Personal, Work, Study, Finance, Family, Travel, Home, Health, Reading, Social or Hobby;
- whether it is an event;
- a description (optional);
- the repeated weekdays, only for occurrences that are not events;
- how often it repeats, for example every other week for 3 months;
- a date range. The end date is optional;
- a status for each date: `IN_PROGRESS`, `COMPLETED`, `SKIPPED` or `MISSED`.

Rules:

- The end works like Google Calendar's: on a date, or after a number of occurrences. When the user picks "after", the system calculates the end date.
- The user can edit an occurrence: title, date range, repetition, whether it is an event, category and description.
- The user can delete one or more occurrences. Deleted and finished occurrences are kept in the history for tracking.
- The user can choose whether to show the description.

### Views

The user has three views:

- **Calendar:** shows every occurrence, events or not. No sort or delete button. Deleting happens from a right-click on the occurrence. It may have a category filter.
- **Events:** only events, each with a counter. Filters: happening this month, next month, in 2, 3, 4 or 5 months, or in more than 6; and by category.
- **Actions:** only occurrences that are not events, each with a counter.

Events and actions can be sorted by default (creation date), color, alphabetical order and date.

Counters:

- An action counts up, based on the days the user marked as completed.
- An event counts down. On the day of the event it shows "It's today". After it, "Already happened".

### Goals

- A goal can be attached to an occurrence that is **not** an event. Example: read 2 books a month.
- When an action has a goal, its card also shows the goal's state.
- The user can have at most 20 goals at a time. Completing a goal, automatically or by hand, frees room for more. A goal can repeat every day, week, month or year.
- A goal follows the date range and the repetition of its occurrence.

## Notes

- A note has an id, and can have a title and a description.
- The user can edit a note (title and description) and delete one or more notes.

## Tasks

- A task has an id, and can have a short description and a time range (e.g. 3 PM to 4 PM).
- A task has a status, shown as a color: To do, In progress, On hold, Blocked, Completed, Deferred or Cancelled. New tasks start as To do.
- The user can edit a task (description, time range and status) and delete one or more tasks. Tasks are kept in the history for tracking.
- The user can sort tasks by default (time range) or status, and filter them by status or time range.

## Mood

- A mood entry has an id, the date it was registered and the mood. It can have a description of what led to that feeling.
- The user has a mood history, filtered by month or day.
- A mood entry can't be edited once registered, but it can be deleted.

Moods: Happy, Sad, Angry, Anxious, Excited, Relaxed, Confident, Nervous, Calm, Frustrated, Joyful, Depressed, Grateful, Envious, Jealous, Guilty, Ashamed, Embarrassed, Proud, Hopeful, Disappointed, Bored, Curious, Irritated, Amused, Playful, Serious, Lonely, Loved, Hated, Confused, Overwhelmed, Insecure, Optimistic, Pessimistic, Enthusiastic, Apathetic, Compassionate, Indifferent and Reflective.

## Import and export

- The user can download their data as a PDF or a spreadsheet.
- The user can import their data from a spreadsheet. The columns are still to be defined.

## Search

- Searching events or actions writes the query to the URL, so the user can share or revisit the search.
- Clearing the search brings back all the data, with the current filters and sorting.
- The front-end sends the search query to the back-end, which returns the matching data, paginated.

## Scenarios

### Deleting events and actions

```gherkin
Feature: Delete events and actions

  Scenario: Delete one event or action
    Given I want to delete an event or action
    When I click its card
    Then the card is selected and the button shows "Delete (1 selected)"
    When I click the button
    Then the event or action is deleted and its card disappears

  Scenario: Delete several events or actions
    Given I want to delete more than one event or action
    When I click the cards I want to delete
    Then the cards are selected and the button shows "Delete ({total} selected)"
    When I click the button
    Then the events or actions are deleted and their cards disappear

  Scenario: Delete all events or actions
    Given I want to delete all my events or actions
    When I click "Delete all"
    Then a modal asks me to confirm
    When I confirm
    Then all my events or actions are deleted for good
```

## Greeting by period of the day

The header greets the user according to the period of the day. `{{username}}`, `{{hour}}` and `{{minutes}}` are filled in by the app.

| Period        | Message                                                    |
| ------------- | ---------------------------------------------------------- |
| Sunrise       | Hi {{username}}, sun is rising. {{hour}}:{{minutes}}am     |
| After sunrise | Hi {{username}}, morning is coming. {{hour}}:{{minutes}}am |
| Morning       | Good morning {{username}}. {{hour}}:{{minutes}}am          |
| Noon          | Hi {{username}}, it's lunch time. {{hour}}:{{minutes}}pm   |
| Afternoon     | Good afternoon {{username}}. {{hour}}:{{minutes}}pm        |
| Sunset        | Hi {{username}}, sun is setting. {{hour}}:{{minutes}}pm    |
| After sunset  | Hi {{username}}, night is coming. {{hour}}:{{minutes}}pm   |
| Night         | Good night {{username}}. {{hour}}:{{minutes}}pm            |
| Midnight      | Hi {{username}}, it's midnight. {{hour}}:{{minutes}}am     |
| Dawn          | Hi {{username}}, it's late. {{hour}}:{{minutes}}am         |
| Default       | Hey {{username}}, it's {{hour}}:{{minutes}}{{am/pm}}       |

The default message is used when the location is unknown.
