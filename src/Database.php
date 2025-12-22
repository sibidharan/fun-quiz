<?php

namespace FunQuiz;

use MongoDB\Client as MongoDBClient;
use Dotenv\Dotenv;

class Database
{
    private static ?Database $instance = null;
    private static ?MongoDBClient $client = null;
    private static bool $envLoaded = false;
    private string $database;
    private string $connectionString;

    private function __construct()
    {
        $this->loadEnv();
        $this->connectionString = $_ENV['MONGODB_URI'] ?? getenv('MONGODB_URI') ?: 'mongodb://localhost:27017/funquiz';
        $this->database = $_ENV['MONGODB_DATABASE'] ?? getenv('MONGODB_DATABASE') ?: 'funquiz';

        if (self::$client === null) {
            self::$client = new MongoDBClient($this->connectionString);
        }
    }

    private function loadEnv(): void
    {
        if (self::$envLoaded) {
            return;
        }

        // Try to load .env from project root
        $projectRoot = dirname(__DIR__);
        if (file_exists($projectRoot . '/.env')) {
            $dotenv = Dotenv::createImmutable($projectRoot);
            $dotenv->safeLoad();
        }

        self::$envLoaded = true;
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    /**
     * Check database connection
     */
    public function checkConnection(): bool
    {
        try {
            self::$client->listDatabases();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get the database instance
     */
    public function getDatabase(): \MongoDB\Database
    {
        if (!$this->checkConnection()) {
            self::$client = new MongoDBClient($this->connectionString);
        }
        return self::$client->{$this->database};
    }

    /**
     * Get a collection
     */
    public function getCollection(string $collection): \MongoDB\Collection
    {
        return $this->getDatabase()->{$collection};
    }

    /**
     * Insert a document into a collection
     */
    public function insert(string $collection, array $document): ?string
    {
        $document['created_at'] = new \MongoDB\BSON\UTCDateTime();
        $result = $this->getCollection($collection)->insertOne($document);
        return (string) $result->getInsertedId();
    }

    /**
     * Insert multiple documents
     */
    public function insertMany(string $collection, array $documents): array
    {
        foreach ($documents as &$document) {
            $document['created_at'] = new \MongoDB\BSON\UTCDateTime();
        }
        $result = $this->getCollection($collection)->insertMany($documents);
        return array_map('strval', $result->getInsertedIds());
    }

    /**
     * Find documents in a collection
     */
    public function find(string $collection, array $filter = [], array $options = []): array
    {
        $cursor = $this->getCollection($collection)->find($filter, $options);
        $results = [];
        foreach ($cursor as $document) {
            $results[] = $this->bsonToArray($document);
        }
        return $results;
    }

    /**
     * Find one document
     */
    public function findOne(string $collection, array $filter = [], array $options = []): ?array
    {
        $document = $this->getCollection($collection)->findOne($filter, $options);
        return $document ? $this->bsonToArray($document) : null;
    }

    /**
     * Update documents
     */
    public function update(string $collection, array $filter, array $update, bool $multi = false): int
    {
        $update['$set']['updated_at'] = new \MongoDB\BSON\UTCDateTime();

        if ($multi) {
            $result = $this->getCollection($collection)->updateMany($filter, $update);
        } else {
            $result = $this->getCollection($collection)->updateOne($filter, $update);
        }

        return $result->getModifiedCount();
    }

    /**
     * Delete documents
     */
    public function delete(string $collection, array $filter, bool $multi = false): int
    {
        if ($multi) {
            $result = $this->getCollection($collection)->deleteMany($filter);
        } else {
            $result = $this->getCollection($collection)->deleteOne($filter);
        }

        return $result->getDeletedCount();
    }

    /**
     * Count documents
     */
    public function count(string $collection, array $filter = []): int
    {
        return $this->getCollection($collection)->countDocuments($filter);
    }

    /**
     * Aggregate pipeline
     */
    public function aggregate(string $collection, array $pipeline): array
    {
        $cursor = $this->getCollection($collection)->aggregate($pipeline);
        $results = [];
        foreach ($cursor as $document) {
            $results[] = $this->bsonToArray($document);
        }
        return $results;
    }

    /**
     * Get random documents using $sample
     */
    public function random(string $collection, int $count, array $match = []): array
    {
        $pipeline = [];

        if (!empty($match)) {
            $pipeline[] = ['$match' => $match];
        }

        $pipeline[] = ['$sample' => ['size' => $count]];

        return $this->aggregate($collection, $pipeline);
    }

    /**
     * Convert BSON document to array
     */
    private function bsonToArray($document): array
    {
        $array = (array) $document;

        foreach ($array as $key => $value) {
            if ($value instanceof \MongoDB\BSON\ObjectId) {
                $array[$key] = (string) $value;
            } elseif ($value instanceof \MongoDB\BSON\UTCDateTime) {
                $array[$key] = $value->toDateTime()->format('Y-m-d H:i:s');
            } elseif (is_object($value)) {
                $array[$key] = $this->bsonToArray($value);
            } elseif (is_array($value)) {
                $array[$key] = array_map(function($item) {
                    return is_object($item) ? $this->bsonToArray($item) : $item;
                }, $value);
            }
        }

        return $array;
    }
}
