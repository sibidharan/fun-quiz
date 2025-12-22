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

## Project Architecture

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

---

# ZealPHP Framework Documentation

ZealPHP is a lightweight, high-performance PHP web framework built on **OpenSwoole**. It serves as an open-source alternative to NextJS, bringing asynchronous I/O capabilities to PHP while maintaining support for traditional PHP superglobals.

## Core Architecture

### Technology Stack
- **OpenSwoole 22.1.5+** - Asynchronous HTTP server for PHP
- **PHP 8.3+** - Required PHP version
- **uopz PECL extension** - Used to override built-in PHP functions (headers, cookies, sessions)
- **PSR-15 Middleware** - Standard middleware support

### Key Features
- Dynamic HTML streaming via APIs and sockets
- Parallel data fetching using coroutines (`go()` function)
- Dynamic routing with implicit routes
- Nested templating and HTML rendering
- Worker, task, and process support
- Per-request PHP superglobal reconstruction

---

## Project Structure

```
my-project/
├── app.php                 # Main application entry point
├── composer.json           # Dependencies (sibidharan/zealphp)
├── public/                 # Static files & implicit routes
│   ├── index.php          # Home page (implicit route for /)
│   ├── about.php          # /about route
│   ├── css/               # Static CSS files
│   └── js/                # Static JS files
├── api/                    # RESTful API endpoints (implicit routes)
│   ├── test.php           # /api/test
│   └── users/
│       └── get.php        # /api/users/get
├── route/                  # Explicit route definitions (auto-loaded)
│   └── custom.php         # Additional routes loaded at startup
├── template/               # HTML templates for App::render()
│   ├── index/             # Templates scoped to index.php
│   │   ├── _head.php
│   │   ├── _master.php
│   │   └── content.php
│   └── shared/
│       └── header.php
└── src/                    # Custom application code (optional)
```

---

## Superglobals Mode vs Coroutine Mode

ZealPHP offers two operational modes that fundamentally change how the framework handles concurrent requests:

### Superglobals Enabled (Default)
```php
App::superglobals(true);
```
- Traditional PHP superglobals work (`$_GET`, `$_POST`, `$_SESSION`, etc.)
- **No coroutines** in the main request handler (prevents data leaks)
- Uses `prefork_request_handler()` for isolation
- SessionManager handles session state
- Familiar PHP development experience

### Superglobals Disabled (Full Coroutine Mode)
```php
App::superglobals(false);
```
- **Full coroutine support** in the main request handler
- Use `G::instance()` instead of PHP superglobals
- CoSessionManager handles session state
- OpenSwoole hook flags enabled for all I/O
- Maximum async performance
- **Recommended for new projects**

```php
// Example: Accessing request data with disabled superglobals
$g = G::instance();
$username = $g->get['username'] ?? 'guest';
$g->session['user'] = $username;
```

---

## Routing System

### Implicit Routes (Automatic)

ZealPHP automatically creates routes based on file structure:

1. **Root Index**: `/` → `public/index.php`
2. **Public Files**: `/about` → `public/about.php`
3. **Directories**: `/admin/dashboard` → `public/admin/dashboard/index.php`
4. **API Routes**: `/api/users/get` → `api/users/get.php`

### Explicit Routes

Define routes in `app.php` or files in the `route/` directory:

```php
// Basic route with parameter
$app->route('/hello/{name}', function($name) {
    echo "Hello, $name!";
});

// Route with HTTP methods
$app->route('/users/{id}', ['methods' => ['GET', 'POST', 'DELETE']], function($id) {
    // Handler code
});

// Namespace route (creates /api/users)
$app->nsRoute('api', '/users', function() {
    return ['users' => []];
});

// Catch-all route with last parameter matching everything
$app->nsPathRoute('files', '{path}', function($path) {
    // $path matches /files/anything/deep/nested
});

// Pattern-based route (full regex control)
$app->patternRoute('/raw/(?P<rest>.*)', [], function($rest) {
    // Full regex matching
});
```

### Route Parameter Injection

Route handlers support automatic parameter injection:

```php
$app->route('/user/{id}', function($id, $request, $response, $app) {
    // $id - from URL parameter
    // $request - ZealPHP\HTTP\Request object
    // $response - ZealPHP\HTTP\Response object
    // $app - ResponseMiddleware instance
});
```

---

## API System

### File-Based API Structure

Place PHP files in the `api/` directory:

```
api/
├── test.php                    # /api/test
├── users/
│   ├── get.php                # /api/users/get
│   ├── create.php             # /api/users/create
│   └── profile/
│       └── update.php         # /api/users/profile/update
```

### API Handler Pattern

```php
<?php
// File: api/users/get.php

// Function name MUST match the endpoint basename
$get = function($request, $response, $server) {
    // Return array/object for automatic JSON encoding
    return [
        'users' => [
            ['id' => 1, 'name' => 'John'],
            ['id' => 2, 'name' => 'Jane']
        ]
    ];
};
```

### Available Injected Variables in API Handlers
- `$request` - ZealPHP\HTTP\Request object
- `$response` - ZealPHP\HTTP\Response object
- `$server` - OpenSwoole server instance
- `$app` - ZealAPI instance

### Response Handling
- **Arrays/Objects**: Automatically JSON-encoded with `Content-Type: application/json`
- **Strings**: Output as-is
- **Integers**: Treated as HTTP status codes
- **ResponseInterface**: PSR-7 response returned directly

---

## App Class Reference

### Initialization

```php
use ZealPHP\App;

// Basic initialization
$app = App::init('0.0.0.0', 8080);

// With custom working directory
$app = App::init('0.0.0.0', 8080, '/path/to/project');

// Disable superglobals for full coroutine support
App::superglobals(false);
$app = App::init('0.0.0.0', 8080);
```

### Static Properties

| Property | Type | Description |
|----------|------|-------------|
| `App::$superglobals` | bool | Enable/disable PHP superglobals (default: true) |
| `App::$cwd` | string | Current working directory |
| `App::$server` | Server | OpenSwoole server instance |
| `App::$display_errors` | bool | Show errors in response (default: true) |
| `App::$ignore_php_ext` | bool | Hide .php extensions, return 403 (default: true) |
| `App::$coproc_implicit_request_handler` | bool | Use coprocess for implicit routes |

### Static Methods

```php
App::init($host, $port, $cwd)      // Initialize application
App::instance()                    // Get app singleton
App::getServer()                   // Get OpenSwoole server
App::superglobals($enable)         // Enable/disable superglobals
App::display_errors($show)         // Toggle error display
App::middleware()                  // Access middleware stack
App::render($template, $data)      // Render template
App::getCurrentFile()              // Get current script name
```

---

## App::render() Function

The render function provides a powerful templating system.

### Basic Usage

```php
// Renders template/hello.php with data
App::render('hello', ['name' => 'World']);
```

### Template Lookup Rules

1. **Root lookup** (starts with `/`): Searches from `template/` root
   ```php
   App::render('/shared/header');  // template/shared/header.php
   ```

2. **Scoped lookup**: Searches under directory named after current PHP file
   ```php
   // In public/dashboard.php
   App::render('sidebar');  // template/dashboard/sidebar.php
   ```

3. **Fallback**: If scoped directory doesn't exist, searches template root
   ```php
   App::render('footer');  // template/footer.php
   ```

### Template Files

```php
<?php
// template/index/_master.php

// Variables are auto-injected via extract()
?>
<!DOCTYPE html>
<html>
<head>
    <title><?= $title ?></title>
</head>
<body>
    <?php App::render('_header'); ?>

    <main>
        <?= $content ?>
    </main>

    <?php App::render('/shared/footer'); ?>
</body>
</html>
```

### Nested Rendering

```php
// In route handler
App::render('_master', [
    'title' => 'My App',
    'content' => 'Welcome!'
]);

// _master.php can call more renders
<?php App::render('sidebar', ['items' => $menuItems]); ?>
```

---

## Session Management

### With Superglobals Enabled

```php
App::superglobals(true);

// Standard PHP session functions work
session_start();
$_SESSION['user'] = 'john';
$username = $_SESSION['user'];
session_destroy();
```

### With Superglobals Disabled

```php
App::superglobals(false);

$g = G::instance();

// Use G instance for session access
session_start();
$g->session['user'] = 'john';
$username = $g->session['user'];
session_destroy();
```

### Session Functions (Overridden via uopz)

All standard PHP session functions are overridden to work with OpenSwoole:

- `session_start()`
- `session_id($id)`
- `session_status()`
- `session_name($name)`
- `session_write_close()`
- `session_destroy()`
- `session_unset()`
- `session_regenerate_id($delete_old)`
- `session_get_cookie_params()`
- `session_set_cookie_params($params)`
- `session_cache_limiter($limiter)`
- `session_cache_expire($expire)`

---

## G Class (Global State)

The G class provides a singleton for managing request-specific global state.

### Usage

```php
$g = G::instance();

// Access request data
$g->get         // $_GET equivalent
$g->post        // $_POST equivalent
$g->cookie      // $_COOKIE equivalent
$g->server      // $_SERVER equivalent
$g->files       // $_FILES equivalent
$g->session     // $_SESSION equivalent
$g->request     // Merged $_GET and $_POST

// Custom properties
$g->status      // HTTP response status
$g->zealphp_request   // ZealPHP Request object
$g->zealphp_response  // ZealPHP Response object
```

### Static Access

```php
G::get('session');
G::set('custom_key', 'value');
```

### Behavior by Mode

| Mode | Behavior |
|------|----------|
| Superglobals ON | Proxies to PHP global variables (`$GLOBALS`) |
| Superglobals OFF | Uses instance properties (coroutine-safe) |

---

## Coroutines and Async Processing

### coprocess() / coproc()

Creates a separate process with its own memory space for async operations.

```php
// Only works when superglobals are ENABLED
App::superglobals(true);

$result = coprocess(function($worker) {
    // This runs in a separate process
    // Full coroutine support available here
    go(function() {
        // Async operation 1
    });

    go(function() {
        // Async operation 2
    });

    echo "Result from coprocess";
});

echo $result; // "Result from coprocess"
```

### go() Function (Coroutines)

When superglobals are disabled, use coroutines directly:

```php
App::superglobals(false);

$app->route('/async-demo', function() {
    $channel = new \OpenSwoole\Coroutine\Channel(1);

    go(function() use ($channel) {
        // Simulate async I/O
        \OpenSwoole\Coroutine::sleep(0.1);
        $channel->push('Hello from coroutine');
    });

    $result = $channel->pop();
    return ['message' => $result];
});
```

### prefork_request_handler()

Used internally for implicit routes when superglobals are enabled. Isolates blocking operations while preserving response metadata:

```php
// Internal usage in implicit route handling
$output = prefork_request_handler(function() use ($php_file) {
    include $php_file;
});
// Headers, cookies, status codes are passed back via serialization
```

---

## Middleware System

### PSR-15 Middleware Support

```php
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class AuthMiddleware implements MiddlewareInterface
{
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        // Pre-request logic
        $token = $request->getHeaderLine('Authorization');

        if (!$this->validateToken($token)) {
            return new Response('Unauthorized', 401);
        }

        // Continue to next middleware/handler
        $response = $handler->handle($request);

        // Post-request logic
        return $response->withHeader('X-Auth', 'validated');
    }
}

// Register middleware
$app->addMiddleware(new AuthMiddleware());
$app->addMiddleware(new LoggingMiddleware());
```

### Middleware Execution Order

Middlewares are executed in reverse order of addition (last added = first executed).

---

## HTTP Utilities

### Response Headers

```php
use function ZealPHP\response_add_header;
use function ZealPHP\response_set_status;

response_add_header('Content-Type', 'application/json');
response_add_header('X-Custom-Header', 'value');
response_set_status(201);
```

### Cookies

```php
// These are overridden to work with OpenSwoole
setcookie('user', 'john', time() + 3600, '/', '', true, true);
setrawcookie('token', $rawToken);
```

### Headers

```php
// Overridden header function
header('Location: /dashboard');
header('Content-Type: text/html');

// Check response code
$code = http_response_code();
http_response_code(404);
```

---

## Running the Application

### Basic Setup

```php
<?php
// app.php

require 'vendor/autoload.php';

use ZealPHP\App;

// For full coroutine support (recommended)
App::superglobals(false);

$app = App::init('0.0.0.0', 8080);

// Define explicit routes
$app->route('/hello/{name}', function($name) {
    return ['message' => "Hello, $name!"];
});

// Run with default settings
$app->run();
```

### Custom Server Settings

```php
$app->run([
    'worker_num' => 4,
    'task_worker_num' => 2,
    'max_request' => 10000,
    'dispatch_mode' => 2,
]);
```

### Start the Server

```bash
php app.php
# Server running at http://0.0.0.0:8080
```

---

## Logging

### elog() - Error Logging

```php
use function ZealPHP\elog;

elog("User logged in", "info");
elog("Database error", "error");
elog("Debug data: " . json_encode($data), "debug");
```

### zlog() - Detailed Request Logging

```php
use function ZealPHP\zlog;

zlog("Processing payment", "system");
zlog($userData, "debug", "/api/users");  // Filter by URL
```

### access_log() - Apache-Style Access Logs

```php
use function ZealPHP\access_log;

// Automatically called by ResponseMiddleware
// Format: IP - - [timestamp] "METHOD URI PROTOCOL" STATUS LENGTH "referer" "user-agent"
```

---

## Task Workers

ZealPHP supports OpenSwoole task workers for background processing:

```php
// In a handler
$server = App::getServer();
$server->task([
    'handler' => '/tasks/send_email',
    'args' => ['to' => 'user@example.com', 'subject' => 'Hello']
]);

// File: tasks/send_email.php
$send_email = function($to, $subject) {
    // Send email logic
    return ['sent' => true];
};
```

---

## Installation

### Requirements
- PHP 8.3+
- OpenSwoole extension
- uopz extension

### Install OpenSwoole

```bash
sudo pecl install openswoole
echo "extension=openswoole.so" | sudo tee -a /etc/php/8.3/cli/conf.d/99-openswoole.ini
```

### Install uopz

```bash
sudo pecl install uopz
echo "extension=uopz.so" | sudo tee -a /etc/php/8.3/cli/conf.d/99-uopz.ini
```

### Create Project

```bash
composer create-project --stability=dev sibidharan/zealphp-project my-project
cd my-project
php app.php
```

---

## Quick Reference

| Feature | Superglobals ON | Superglobals OFF |
|---------|-----------------|------------------|
| `$_GET`, `$_POST`, etc. | Works | Use `G::instance()->get` |
| Coroutines in handler | No (use coprocess) | Yes |
| Session management | SessionManager | CoSessionManager |
| Performance | Good | Maximum |
| PHP compatibility | High | Requires adaptation |
