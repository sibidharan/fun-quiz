<?php

namespace FunQuiz;

/**
 * Quiz Topics Configuration
 * These topics are shared between PHP and Python CLI
 */
class QuizTopics
{
    public const TOPICS = [
        'indian_history' => [
            'name' => 'Indian History',
            'description' => 'Freedom fighters, ancient India, empires and kingdoms',
            'icon' => '🇮🇳',
            'animation' => 'taj-mahal',
            'color' => '#FF9933'
        ],
        'tamil_history' => [
            'name' => 'Tamil History',
            'description' => 'Chola, Pandya, Chera kingdoms and Tamil culture',
            'icon' => '🏛️',
            'animation' => 'temple',
            'color' => '#E91E63'
        ],
        'world_history' => [
            'name' => 'World History',
            'description' => 'World wars, ancient civilizations, famous leaders',
            'icon' => '🌍',
            'animation' => 'globe',
            'color' => '#2196F3'
        ],
        'science_nature' => [
            'name' => 'Science & Nature',
            'description' => 'Animals, plants, human body, space',
            'icon' => '🔬',
            'animation' => 'atoms',
            'color' => '#4CAF50'
        ],
        'geography' => [
            'name' => 'Geography',
            'description' => 'Countries, capitals, rivers, mountains',
            'icon' => '🗺️',
            'animation' => 'mountains',
            'color' => '#795548'
        ],
        'space_astronomy' => [
            'name' => 'Space & Astronomy',
            'description' => 'Planets, stars, ISRO missions, astronauts',
            'icon' => '🚀',
            'animation' => 'space',
            'color' => '#1A237E'
        ],
        'sports' => [
            'name' => 'Sports',
            'description' => 'Cricket, Olympics, football, famous players',
            'icon' => '🏏',
            'animation' => 'sports',
            'color' => '#F44336'
        ],
        'technology' => [
            'name' => 'Technology',
            'description' => 'Computers, internet, inventions, gadgets',
            'icon' => '💻',
            'animation' => 'tech',
            'color' => '#00BCD4'
        ],
        'mathematics' => [
            'name' => 'Mathematics',
            'description' => 'Fun math puzzles and number facts',
            'icon' => '🔢',
            'animation' => 'numbers',
            'color' => '#9C27B0'
        ],
        'indian_culture' => [
            'name' => 'Indian Culture',
            'description' => 'Festivals, traditions, classical arts, dance',
            'icon' => '🪔',
            'animation' => 'diya',
            'color' => '#FF5722'
        ],
        'environment' => [
            'name' => 'Environment',
            'description' => 'Climate, pollution, conservation, wildlife',
            'icon' => '🌳',
            'animation' => 'nature',
            'color' => '#8BC34A'
        ],
        'famous_people' => [
            'name' => 'Famous People',
            'description' => 'Scientists, leaders, artists, inventors',
            'icon' => '👨‍🔬',
            'animation' => 'people',
            'color' => '#607D8B'
        ],
        'current_affairs' => [
            'name' => 'Current Affairs',
            'description' => 'Recent events, news, achievements',
            'icon' => '📰',
            'animation' => 'news',
            'color' => '#3F51B5'
        ],
        'cyber_security' => [
            'name' => 'Cyber Security',
            'description' => 'Online safety, passwords, privacy protection',
            'icon' => '🔒',
            'animation' => 'cyber',
            'color' => '#1976D2'
        ],
        'internet_safety' => [
            'name' => 'Internet Safety',
            'description' => 'Safe browsing, social media awareness, online privacy',
            'icon' => '🛡️',
            'animation' => 'shield',
            'color' => '#388E3C'
        ],
        'cyber_crime_awareness' => [
            'name' => 'Cyber Crime Awareness',
            'description' => 'Types of cyber crimes, how to stay safe online',
            'icon' => '⚠️',
            'animation' => 'warning',
            'color' => '#F57C00'
        ],
        'online_fraud_awareness' => [
            'name' => 'Online Fraud Awareness',
            'description' => 'OTP fraud, phishing, scam awareness',
            'icon' => '🚨',
            'animation' => 'alert',
            'color' => '#D32F2F'
        ],
        'police_awareness' => [
            'name' => 'Police & Safety',
            'description' => 'Role of police, emergency numbers, citizen safety',
            'icon' => '👮',
            'animation' => 'police',
            'color' => '#0D47A1'
        ],
        'digital_literacy' => [
            'name' => 'Digital Literacy',
            'description' => 'Basic computer skills, internet usage, digital tools',
            'icon' => '💻',
            'animation' => 'digital',
            'color' => '#7B1FA2'
        ],
        'network_basics' => [
            'name' => 'Network Basics',
            'description' => 'WiFi, LAN, internet connectivity basics',
            'icon' => '📡',
            'animation' => 'network',
            'color' => '#00897B'
        ],
        'safe_online_culture' => [
            'name' => 'Safe Online Culture',
            'description' => 'Digital citizenship, responsible internet use',
            'icon' => '🌐',
            'animation' => 'globe-safe',
            'color' => '#5C6BC0'
        ],
        'literature' => [
            'name' => 'Literature',
            'description' => 'Famous books, authors, poetry',
            'icon' => '📚',
            'animation' => 'books',
            'color' => '#673AB7'
        ],
        'music_arts' => [
            'name' => 'Music & Arts',
            'description' => 'Musical instruments, paintings, artists',
            'icon' => '🎵',
            'animation' => 'music',
            'color' => '#E91E63'
        ],
        'animals' => [
            'name' => 'Animals',
            'description' => 'Wildlife, pets, marine life, insects',
            'icon' => '🦁',
            'animation' => 'animals',
            'color' => '#FF9800'
        ],
        'food_nutrition' => [
            'name' => 'Food & Nutrition',
            'description' => 'Healthy eating, cuisines, vitamins',
            'icon' => '🍎',
            'animation' => 'food',
            'color' => '#F44336'
        ],
        'inventions' => [
            'name' => 'Inventions',
            'description' => 'Who invented what, famous discoveries',
            'icon' => '💡',
            'animation' => 'bulb',
            'color' => '#FFEB3B'
        ],
        'monuments' => [
            'name' => 'Monuments & Wonders',
            'description' => 'World wonders, famous buildings, heritage sites',
            'icon' => '🏰',
            'animation' => 'monuments',
            'color' => '#9E9E9E'
        ]
    ];

    /**
     * Get all topics
     */
    public static function getAll(): array
    {
        return self::TOPICS;
    }

    /**
     * Get age-appropriate difficulty levels
     */
    public static function getDifficultyForAge(int $age): string
    {
        if ($age <= 10) {
            return 'easy';
        } elseif ($age <= 13) {
            return 'medium';
        } else {
            return 'hard';
        }
    }

    /**
     * Get all topic slugs
     */
    public static function getTopicSlugs(): array
    {
        return array_keys(self::TOPICS);
    }

    /**
     * Get topic by slug
     */
    public static function getTopic(string $slug): ?array
    {
        return self::TOPICS[$slug] ?? null;
    }

    /**
     * Export topics as JSON for Python CLI
     */
    public static function toJson(): string
    {
        return json_encode(self::TOPICS, JSON_PRETTY_PRINT);
    }
}
