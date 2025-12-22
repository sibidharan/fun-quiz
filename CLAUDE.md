# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fun Quiz is an interactive quiz application for kids (ages 8-16) built with ZealPHP framework on OpenSwoole. Questions are generated using OpenAI's Agents SDK and stored in JSON files or MongoDB.

## Commands

### Start the Server
```bash
php app.php
# Server runs at http://localhost:8080
```

### Generate Quiz Questions (Python CLI)
```bash
cd scripts
source .venv/bin/activate

# Generate questions for a specific topic
python quiz_generator.py generate --topic indian_history --count 10 --difficulty easy

# Get questions for a quiz session based on player age
python quiz_generator.py quiz --age 12 --count 10

# Seed database with questions for all topics
python quiz_generator.py seed --count 10

# List topics
python quiz_generator.py topics

# Show statistics
python quiz_generator.py stats
```

## Architecture

### Request Handling Mode
The app runs with `App::superglobals(false)` which:
- Enables full coroutine support in request handlers
- Requires `G::instance()` for accessing request data (`$_GET`, `$_POST`, `$_SESSION` equivalents)
- Session management via `session_start()` still works but data is accessed via `$g->session`

### Key Components

**PHP Application** (`app.php`):
- Entry point defining explicit routes (`/play`, `/results`, `/leaderboard`)
- Implicit routes auto-created from `public/` and `api/` directories

**API Layer** (`api/`):
- `api/quiz/questions.php` - Fetches questions filtered by difficulty (based on user age) and excludes previously answered questions
- `api/quiz/submit.php` - Submits quiz results, calculates points, updates leaderboard
- `api/user/register.php` - User registration (name, age stored in session)
- API handlers must define a function matching the endpoint basename (e.g., `$questions = function(...)`)

**Question Generator** (`scripts/quiz_generator.py`):
- Uses OpenAI Agents SDK with `gpt-4.1-mini` model
- Pydantic models enforce question schema (4 options, correct index 0-3, difficulty, age range)
- Stores questions in `scripts/questions.json` (file storage) or MongoDB
- Topics defined in `TOPICS` dict must match `src/QuizTopics.php`

**Data Storage**:
- Questions: `scripts/questions.json` or MongoDB `funquiz.questions`
- Leaderboard: `scripts/leaderboard.json`
- Session: Managed by ZealPHP's CoSessionManager (superglobals disabled mode)

### Database Singleton

`FunQuiz\Database` provides a MongoDB singleton wrapper:
```php
$db = Database::getInstance();
$db->find('collection', ['filter' => 'value']);
$db->insert('collection', ['data' => 'value']);
$db->random('collection', 10, ['topic' => 'science']);
```

## Topic System

Topics are defined in two places that must stay synchronized:
- `src/QuizTopics.php` - PHP class with topic metadata
- `scripts/quiz_generator.py` - Python TOPICS dict for question generation

Both define: slug, name, description, icon, examples (Python only)

## Difficulty Mapping by Age

- Ages 8-10: easy
- Ages 11-13: medium
- Ages 14-16: hard

## Framework Documentation

ZealPHP framework documentation is available as a skill. Claude will automatically reference it when working with ZealPHP concepts like routing, templates, sessions, middleware, or the G class.
