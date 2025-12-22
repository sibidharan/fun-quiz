# Fun Quiz for Kids

A fun, interactive quiz application for school kids (ages 8-16) built with **ZealPHP** framework on **OpenSwoole**. Features animated mascots that react to answers with funny dialogs and topic-themed backgrounds.

**Live Demo:** https://funquiz.zeal.ninja

## Features

- **20 Quiz Topics**: Indian History, Science, Space, Sports, Mythology, and more
- **5 Animated Mascots**: Wormy the Bookworm, Hoppy the Bunny, Professor Hoot, Whiskers the Cat, Byte the Robot
- **AI Question Generation**: Uses OpenAI Agents SDK to generate age-appropriate questions
- **Age-Based Difficulty**: Easy (8-10), Medium (11-13), Hard (14-16)
- **Fun Animations**: Particle effects, emoji bursts, and comic-style reactions
- **Topic-Themed Backgrounds**: Each topic has unique animated scenery
- **Leaderboard System**: Track high scores
- **MongoDB Storage**: Persistent question bank and scores

## Tech Stack

- **ZealPHP** - Lightweight PHP framework on OpenSwoole
- **OpenSwoole** - Async HTTP server with coroutine support
- **MongoDB** - Question and leaderboard storage
- **OpenAI Agents SDK** - AI-powered question generation (Python)
- **PHP 8.3+** with uopz extension

## Getting Started

### Prerequisites

- PHP 8.3+ with OpenSwoole and uopz extensions
- MongoDB
- Python 3.12+ (for question generation)
- Composer

### Installation

```bash
# Clone the repository
git clone https://github.com/sibidharan/fun-quiz.git
cd fun-quiz

# Install PHP dependencies
composer install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your MongoDB URI and OpenAI API key

# Start the server
php app.php
```

Visit `http://localhost:8080` in your browser.

### Question Generator Setup (Optional)

```bash
cd scripts

# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
# Or using uv: uv sync

# Generate questions for a topic
python quiz_generator.py generate --topic indian_history --count 10 --difficulty easy

# Seed all topics
python quiz_generator.py seed --count 10
```

## Project Structure

```
fun-quiz/
├── app.php                 # Main entry point
├── .env.example            # Environment template
├── composer.json           # PHP dependencies
├── public/
│   ├── index.php           # Home page
│   ├── css/
│   │   ├── app.css         # Main styles
│   │   ├── worm-animations.css  # Mascot animations
│   │   ├── mascots/        # Individual mascot styles
│   │   └── topics/         # Topic-themed backgrounds
│   └── js/
│       ├── app.js          # Quiz logic
│       └── mascot-controller.js  # Mascot animations
├── api/
│   ├── quiz/
│   │   ├── questions.php   # GET questions by difficulty
│   │   └── submit.php      # POST quiz results
│   └── user/
│       └── register.php    # User registration
├── scripts/
│   └── quiz_generator.py   # AI question generator
├── src/
│   ├── Database.php        # MongoDB wrapper
│   └── QuizTopics.php      # Topic definitions
└── template/               # PHP templates
```

## Available Topics

| Topic | Description |
|-------|-------------|
| Indian History | Freedom fighters, empires, kingdoms |
| Tamil History | Chola, Pandya, Chera dynasties |
| World History | World wars, civilizations, leaders |
| Science & Nature | Biology, chemistry, physics |
| Space & Astronomy | Planets, ISRO, astronauts |
| Geography | Countries, capitals, rivers |
| Sports | Cricket, Olympics, famous players |
| Technology | Computers, internet, gadgets |
| Mathematics | Puzzles, number facts |
| Indian Culture | Festivals, traditions, arts |
| Environment | Climate, conservation, wildlife |
| Famous People | Scientists, leaders, artists |
| Mythology | Ramayana, Mahabharata, legends |
| Literature | Books, authors, poetry |
| Music & Arts | Instruments, paintings |
| Animals | Wildlife, marine life |
| Food & Nutrition | Healthy eating, vitamins |
| Inventions | Discoveries, inventors |
| Monuments | World wonders, heritage sites |
| Current Affairs | Recent events, news |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/quiz/questions` | GET | Get questions by age/difficulty |
| `/api/quiz/submit` | POST | Submit quiz results |
| `/api/user/register` | POST | Register player (name, age) |

## Environment Variables

```env
MONGODB_URI=mongodb://user:pass@host:27017/db
MONGODB_DATABASE=funquiz
OPENAI_API_KEY=sk-your-key-here
APP_HOST=0.0.0.0
APP_PORT=8080
```

## License

MIT

## Author

Sibidharan ([@sibidharan](https://github.com/sibidharan))
