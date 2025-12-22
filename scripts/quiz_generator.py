#!/usr/bin/env python3
"""
Fun Quiz Question Generator CLI
Uses OpenAI Agents SDK to generate age-appropriate quiz questions
"""

import asyncio
import json
import sys
import os
import argparse
from typing import Optional
from dataclasses import dataclass
from pydantic import BaseModel, Field
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv

from agents import Agent, Runner, function_tool

# Load environment variables from .env file
# Look for .env in parent directory (project root) or current directory
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv()  # Try current directory

# MongoDB connection from environment
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/funquiz")
DB_NAME = os.getenv("MONGODB_DATABASE", "funquiz")
USE_FILE_STORAGE = os.getenv("USE_FILE_STORAGE", "false").lower() == "true"
QUESTIONS_FILE = "questions.json"

# Topics configuration - must match PHP QuizTopics.php
TOPICS = {
    "indian_history": {
        "name": "Indian History",
        "description": "Freedom fighters, ancient India, empires and kingdoms",
        "icon": "🇮🇳",
        "examples": "Mahatma Gandhi, Chandragupta Maurya, Ashoka, Mughal Empire, British Rule"
    },
    "tamil_history": {
        "name": "Tamil History",
        "description": "Chola, Pandya, Chera kingdoms and Tamil culture",
        "icon": "🏛️",
        "examples": "Raja Raja Chola, Thiruvalluvar, Sangam literature, Brihadeeswarar Temple"
    },
    "world_history": {
        "name": "World History",
        "description": "World wars, ancient civilizations, famous leaders",
        "icon": "🌍",
        "examples": "World War II, Egyptian pyramids, Alexander the Great, Renaissance"
    },
    "science_nature": {
        "name": "Science & Nature",
        "description": "Animals, plants, human body, space",
        "icon": "🔬",
        "examples": "Photosynthesis, human organs, gravity, electricity, magnets"
    },
    "geography": {
        "name": "Geography",
        "description": "Countries, capitals, rivers, mountains",
        "icon": "🗺️",
        "examples": "India states, world capitals, Himalayan rivers, continents"
    },
    "space_astronomy": {
        "name": "Space & Astronomy",
        "description": "Planets, stars, ISRO missions, astronauts",
        "icon": "🚀",
        "examples": "Solar system, Chandrayaan, Kalpana Chawla, black holes"
    },
    "sports": {
        "name": "Sports",
        "description": "Cricket, Olympics, football, famous players",
        "icon": "🏏",
        "examples": "Sachin Tendulkar, Olympics, FIFA World Cup, Kabaddi"
    },
    "technology": {
        "name": "Technology",
        "description": "Computers, internet, inventions, gadgets",
        "icon": "💻",
        "examples": "Computer parts, internet, mobile phones, AI"
    },
    "mathematics": {
        "name": "Mathematics",
        "description": "Fun math puzzles and number facts",
        "icon": "🔢",
        "examples": "Basic arithmetic, shapes, famous mathematicians, number patterns"
    },
    "indian_culture": {
        "name": "Indian Culture",
        "description": "Festivals, traditions, classical arts, dance",
        "icon": "🪔",
        "examples": "Diwali, Bharatanatyam, classical music, Indian cuisine"
    },
    "environment": {
        "name": "Environment",
        "description": "Climate, pollution, conservation, wildlife",
        "icon": "🌳",
        "examples": "Global warming, recycling, endangered species, forests"
    },
    "famous_people": {
        "name": "Famous People",
        "description": "Scientists, leaders, artists, inventors",
        "icon": "👨‍🔬",
        "examples": "APJ Abdul Kalam, Marie Curie, Leonardo da Vinci, Edison"
    },
    "current_affairs": {
        "name": "Current Affairs",
        "description": "Recent events, news, achievements",
        "icon": "📰",
        "examples": "G20 Summit India, Chandrayaan-3, recent Olympics winners"
    },
    "mythology": {
        "name": "Indian Mythology",
        "description": "Ramayana, Mahabharata, gods and legends",
        "icon": "🏹",
        "examples": "Lord Rama, Pandavas, Hanuman, Krishna, Durga"
    },
    "literature": {
        "name": "Literature",
        "description": "Famous books, authors, poetry",
        "icon": "📚",
        "examples": "Rabindranath Tagore, Panchatantra, Harry Potter, famous poets"
    },
    "music_arts": {
        "name": "Music & Arts",
        "description": "Musical instruments, paintings, artists",
        "icon": "🎵",
        "examples": "Tabla, Veena, M.F. Husain, Raja Ravi Varma"
    },
    "animals": {
        "name": "Animals",
        "description": "Wildlife, pets, marine life, insects",
        "icon": "🦁",
        "examples": "National animal, endangered species, animal habitats, adaptations"
    },
    "food_nutrition": {
        "name": "Food & Nutrition",
        "description": "Healthy eating, cuisines, vitamins",
        "icon": "🍎",
        "examples": "Vitamins, Indian dishes, healthy foods, proteins"
    },
    "inventions": {
        "name": "Inventions",
        "description": "Who invented what, famous discoveries",
        "icon": "💡",
        "examples": "Light bulb, telephone, zero, printing press"
    },
    "monuments": {
        "name": "Monuments & Wonders",
        "description": "World wonders, famous buildings, heritage sites",
        "icon": "🏰",
        "examples": "Taj Mahal, Great Wall, Eiffel Tower, Qutub Minar"
    }
}


# Mapping of variant topic names to canonical topic slugs
TOPIC_MAPPING = {
    # Space variants
    'space': 'space_astronomy',
    'space_earth': 'space_astronomy',
    'space_india': 'space_astronomy',
    'space_physics': 'space_astronomy',
    # Science variants
    'human_body': 'science_nature',
    'human body': 'science_nature',
    'human_organs': 'science_nature',
    'biology': 'science_nature',
    'chemistry': 'science_nature',
    'physics': 'science_nature',
    'photosynthesis': 'science_nature',
    'science_general': 'science_nature',
    'science_history': 'science_nature',
    'science_india': 'science_nature',
    # Nature/Environment variants
    'nature': 'environment',
    'nature in india': 'environment',
    'plants': 'environment',
    'plants_india': 'environment',
    'plants_animals': 'animals',
    'earth_science': 'geography',
    'earth_science_india': 'geography',
    'electricity_magnets': 'technology',
    # Animals variants
    'animals_india': 'animals',
    # Sports variants
    'cricket': 'sports',
    'football': 'sports',
    'kabaddi': 'sports',
    'olympics': 'sports',
    'paralympics': 'sports',
    'sports events': 'sports',
    'sports general': 'sports',
    'hockey': 'sports',
    'badminton': 'sports',
    'tennis': 'sports',
    'swimming': 'sports',
    'athletics': 'sports',
    'archery': 'sports',
    'boxing': 'sports',
    'chess': 'sports',
    'volleyball': 'sports',
    'wrestling': 'sports',
    'shooting': 'sports',
    'snooker': 'sports',
    'motorsport': 'sports',
    'martial arts': 'sports',
    'winter sports': 'sports',
    # Technology variants
    'computers': 'technology',
    'internet': 'technology',
    'gadgets': 'technology',
    # Monuments variants
    'monuments_wonders': 'monuments',
    'monuments-wonders': 'monuments',
}


def normalize_topic(topic: str) -> str:
    """Normalize a topic slug to match predefined TOPICS keys"""
    # Convert to lowercase and replace hyphens with underscores
    normalized = topic.lower().replace('-', '_')

    # Check if it's in the mapping
    if normalized in TOPIC_MAPPING:
        return TOPIC_MAPPING[normalized]

    # Check original (case-insensitive)
    if topic.lower() in TOPIC_MAPPING:
        return TOPIC_MAPPING[topic.lower()]

    # Check if it's already a valid topic
    if normalized in TOPICS:
        return normalized

    # Fallback: return the normalized version (might not match CSS)
    return normalized


class QuizQuestion(BaseModel):
    """Schema for a single quiz question"""
    question: str = Field(..., description="The quiz question text")
    options: list[str] = Field(..., description="Exactly 4 answer options", min_length=4, max_length=4)
    correct: int = Field(..., description="Index of correct answer (0-3)", ge=0, le=3)
    explanation: str = Field(..., description="Brief explanation of the correct answer")
    difficulty: str = Field(..., description="Difficulty level: easy, medium, or hard")
    topic: str = Field(..., description="Topic slug from the predefined list")
    age_min: int = Field(..., description="Minimum recommended age", ge=8)
    age_max: int = Field(..., description="Maximum recommended age", le=16)


class QuestionBatch(BaseModel):
    """Schema for a batch of questions"""
    questions: list[QuizQuestion] = Field(..., description="List of generated questions")


@dataclass
class GeneratorContext:
    """Context for the quiz generator agent"""
    db: MongoClient
    topic: str
    difficulty: str
    count: int
    age_min: int
    age_max: int


def get_db_connection():
    """Get MongoDB connection"""
    client = MongoClient(MONGO_URI)
    return client[DB_NAME]


def load_questions_from_file() -> list[dict]:
    """Load questions from JSON file"""
    import os
    file_path = os.path.join(os.path.dirname(__file__), QUESTIONS_FILE)
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            return json.load(f)
    return []


def save_questions_to_file(questions: list[dict]) -> int:
    """Save questions to JSON file"""
    import os
    import uuid
    file_path = os.path.join(os.path.dirname(__file__), QUESTIONS_FILE)

    existing = load_questions_from_file()

    for q in questions:
        q['_id'] = str(uuid.uuid4())
        q['created_at'] = datetime.utcnow().isoformat()
        q['used_count'] = 0

    existing.extend(questions)

    with open(file_path, 'w') as f:
        json.dump(existing, f, indent=2, default=str)

    return len(questions)


def build_instructions(context, agent) -> str:
    """Build dynamic instructions based on context"""
    ctx = context.context
    topic_info = TOPICS.get(ctx.topic, {})

    # List valid topic slugs for the AI
    valid_topics = ", ".join(TOPICS.keys())

    return f"""You are a quiz question generator for Indian Tamil kids aged {ctx.age_min}-{ctx.age_max}.

TOPIC: {topic_info.get('name', ctx.topic)}
TOPIC SLUG: {ctx.topic}
DESCRIPTION: {topic_info.get('description', '')}
EXAMPLES: {topic_info.get('examples', '')}
DIFFICULTY: {ctx.difficulty}
GENERATE: {ctx.count} questions

CRITICAL - TOPIC FIELD:
The "topic" field in each question MUST be EXACTLY: "{ctx.topic}"
Do NOT use variations like "cricket", "football", "space", etc.
Use ONLY the exact slug provided above.

VALID TOPIC SLUGS: {valid_topics}

IMPORTANT GUIDELINES:
1. Questions must be appropriate for kids aged {ctx.age_min}-{ctx.age_max}
2. Focus on general knowledge that Indian children would find interesting
3. Include facts about India, Tamil Nadu, and world knowledge
4. Make questions fun and educational, not too hard
5. Avoid controversial, religious conflicts, or sensitive topics
6. Use simple language that kids can understand
7. Each question must have exactly 4 options
8. Only ONE option should be correct
9. Provide a brief, kid-friendly explanation for each answer
10. Questions should be interesting and make kids curious to learn more
11. ALWAYS use the exact topic slug "{ctx.topic}" - never use sub-categories or variants

DIFFICULTY LEVELS:
- easy (age 8-10): Very simple facts, basic knowledge
- medium (age 11-13): Moderate complexity, some reasoning
- hard (age 14-16): More detailed knowledge, critical thinking

Generate {ctx.count} unique, interesting questions about {topic_info.get('name', ctx.topic)}.
Ensure variety - don't repeat similar questions."""


# Create the question generator agent
question_generator = Agent(
    name="QuizQuestionGenerator",
    instructions=build_instructions,
    model="gpt-4.1-mini",
    output_type=QuestionBatch
)


async def generate_questions(
    topic: str,
    count: int = 10,
    difficulty: str = "medium",
    age_min: int = 8,
    age_max: int = 16
) -> list[dict]:
    """Generate quiz questions using the AI agent"""

    if topic not in TOPICS:
        raise ValueError(f"Invalid topic: {topic}. Valid topics: {list(TOPICS.keys())}")

    context = GeneratorContext(
        db=get_db_connection(),
        topic=topic,
        difficulty=difficulty,
        count=count,
        age_min=age_min,
        age_max=age_max
    )

    prompt = f"Generate {count} {difficulty} difficulty quiz questions about {TOPICS[topic]['name']} for kids aged {age_min}-{age_max}."

    result = await Runner.run(
        question_generator,
        input=prompt,
        context=context
    )

    output = result.final_output_as(QuestionBatch)
    return [q.model_dump() for q in output.questions]


def save_questions_to_db(questions: list[dict]) -> int:
    """Save questions to MongoDB or file"""
    # Normalize all topic slugs before saving
    for q in questions:
        if 'topic' in q:
            q['topic'] = normalize_topic(q['topic'])

    if USE_FILE_STORAGE:
        return save_questions_to_file(questions)

    try:
        db = get_db_connection()
        collection = db.questions

        for q in questions:
            q['created_at'] = datetime.utcnow()
            q['used_count'] = 0

        result = collection.insert_many(questions)
        return len(result.inserted_ids)
    except Exception as e:
        print(f"DB Error, falling back to file storage: {e}", file=sys.stderr)
        return save_questions_to_file(questions)


async def generate_and_save(
    topic: str,
    count: int = 10,
    difficulty: str = "medium",
    age_min: int = 8,
    age_max: int = 16,
    stream_first: bool = False
) -> dict:
    """Generate questions and save to database"""

    questions = await generate_questions(
        topic=topic,
        count=count,
        difficulty=difficulty,
        age_min=age_min,
        age_max=age_max
    )

    if stream_first and questions:
        # Output first question immediately
        first_q = questions[0]
        print(json.dumps({"first_question": first_q, "status": "streaming"}), flush=True)

    saved_count = save_questions_to_db(questions)

    return {
        "status": "success",
        "topic": topic,
        "difficulty": difficulty,
        "generated": len(questions),
        "saved": saved_count,
        "questions": questions
    }


async def generate_for_quiz_session(
    age: int,
    excluded_ids: list[str] = None,
    count: int = 10
) -> dict:
    """
    Generate questions for a live quiz session.
    First tries to fetch from file/DB, then generates new ones if needed.
    """
    import random

    # Determine difficulty based on age
    if age <= 10:
        difficulty = "easy"
    elif age <= 13:
        difficulty = "medium"
    else:
        difficulty = "hard"

    excluded_ids = excluded_ids or []

    # Try to get questions from file storage first
    if USE_FILE_STORAGE:
        all_questions = load_questions_from_file()

        # Filter by age and exclude used ones
        filtered = [
            q for q in all_questions
            if q.get('age_min', 8) <= age <= q.get('age_max', 16)
            and q.get('_id') not in excluded_ids
        ]

        if len(filtered) >= count:
            random.shuffle(filtered)
            return {
                "status": "success",
                "source": "file",
                "questions": filtered[:count]
            }
    else:
        # Try MongoDB
        try:
            db = get_db_connection()
            collection = db.questions

            age_filter = {"age_min": {"$lte": age}, "age_max": {"$gte": age}}

            match_filter = age_filter.copy()
            if excluded_ids:
                from bson import ObjectId
                match_filter["_id"] = {"$nin": [ObjectId(id) for id in excluded_ids if ObjectId.is_valid(id)]}

            pipeline = [
                {"$match": match_filter},
                {"$sample": {"size": count}}
            ]

            existing = list(collection.aggregate(pipeline))

            if len(existing) >= count:
                questions = []
                for q in existing:
                    q['_id'] = str(q['_id'])
                    questions.append(q)

                return {
                    "status": "success",
                    "source": "database",
                    "questions": questions
                }
        except Exception as e:
            print(f"DB Error: {e}", file=sys.stderr)

    # Not enough questions, generate new ones
    topics_to_generate = random.sample(list(TOPICS.keys()), min(5, len(TOPICS)))
    all_questions = []

    for topic in topics_to_generate:
        if len(all_questions) >= count:
            break

        try:
            questions = await generate_questions(
                topic=topic,
                count=3,  # Generate 3 per topic
                difficulty=difficulty,
                age_min=8 if age <= 10 else (11 if age <= 13 else 14),
                age_max=10 if age <= 10 else (13 if age <= 13 else 16)
            )
            all_questions.extend(questions)
        except Exception as e:
            print(f"Error generating for topic {topic}: {e}", file=sys.stderr)
            continue

    if all_questions:
        save_questions_to_db(all_questions)

        return {
            "status": "success",
            "source": "generated",
            "questions": all_questions[:count]
        }

    return {
        "status": "error",
        "message": "Could not generate questions"
    }


def list_topics():
    """List all available topics"""
    return TOPICS


def get_stats():
    """Get database/file statistics"""
    if USE_FILE_STORAGE:
        questions = load_questions_from_file()

        stats = {
            "total_questions": len(questions),
            "storage": "file",
            "by_topic": {},
            "by_difficulty": {}
        }

        for topic in TOPICS:
            stats["by_topic"][topic] = len([q for q in questions if q.get('topic') == topic])

        for diff in ["easy", "medium", "hard"]:
            stats["by_difficulty"][diff] = len([q for q in questions if q.get('difficulty') == diff])

        return stats

    try:
        db = get_db_connection()
        collection = db.questions

        stats = {
            "total_questions": collection.count_documents({}),
            "storage": "mongodb",
            "by_topic": {},
            "by_difficulty": {}
        }

        for topic in TOPICS:
            stats["by_topic"][topic] = collection.count_documents({"topic": topic})

        for diff in ["easy", "medium", "hard"]:
            stats["by_difficulty"][diff] = collection.count_documents({"difficulty": diff})

        return stats
    except Exception as e:
        return {"error": str(e)}


def main():
    parser = argparse.ArgumentParser(description="Fun Quiz Question Generator")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Generate command
    gen_parser = subparsers.add_parser("generate", help="Generate questions for a topic")
    gen_parser.add_argument("--topic", required=True, help="Topic slug")
    gen_parser.add_argument("--count", type=int, default=10, help="Number of questions")
    gen_parser.add_argument("--difficulty", default="medium", choices=["easy", "medium", "hard"])
    gen_parser.add_argument("--age-min", type=int, default=8)
    gen_parser.add_argument("--age-max", type=int, default=16)
    gen_parser.add_argument("--stream-first", action="store_true", help="Output first question immediately")

    # Quiz session command
    quiz_parser = subparsers.add_parser("quiz", help="Get questions for a quiz session")
    quiz_parser.add_argument("--age", type=int, required=True, help="Player's age")
    quiz_parser.add_argument("--count", type=int, default=10, help="Number of questions")
    quiz_parser.add_argument("--exclude", nargs="*", default=[], help="Question IDs to exclude")

    # List topics command
    subparsers.add_parser("topics", help="List all available topics")

    # Stats command
    subparsers.add_parser("stats", help="Show database statistics")

    # Seed command - generate initial questions for all topics
    seed_parser = subparsers.add_parser("seed", help="Seed database with initial questions")
    seed_parser.add_argument("--count", type=int, default=10, help="Questions per topic per difficulty")

    args = parser.parse_args()

    if args.command == "generate":
        result = asyncio.run(generate_and_save(
            topic=args.topic,
            count=args.count,
            difficulty=args.difficulty,
            age_min=args.age_min,
            age_max=args.age_max,
            stream_first=args.stream_first
        ))
        print(json.dumps(result, indent=2, default=str))

    elif args.command == "quiz":
        result = asyncio.run(generate_for_quiz_session(
            age=args.age,
            excluded_ids=args.exclude,
            count=args.count
        ))
        print(json.dumps(result, indent=2, default=str))

    elif args.command == "topics":
        print(json.dumps(list_topics(), indent=2))

    elif args.command == "stats":
        print(json.dumps(get_stats(), indent=2))

    elif args.command == "seed":
        print("Seeding database with initial questions...")
        total = 0

        for topic in TOPICS:
            for difficulty in ["easy", "medium", "hard"]:
                print(f"Generating {args.count} {difficulty} questions for {topic}...")
                try:
                    result = asyncio.run(generate_and_save(
                        topic=topic,
                        count=args.count,
                        difficulty=difficulty,
                        age_min=8 if difficulty == "easy" else (11 if difficulty == "medium" else 14),
                        age_max=10 if difficulty == "easy" else (13 if difficulty == "medium" else 16)
                    ))
                    total += result.get("saved", 0)
                    print(f"  Saved {result.get('saved', 0)} questions")
                except Exception as e:
                    print(f"  Error: {e}")

        print(f"\nTotal questions seeded: {total}")

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
