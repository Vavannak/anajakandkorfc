<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Path to the JSON file
$dataFile = 'database.json';

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load existing data (or create default if not exists)
function loadData() {
    global $dataFile;
    $defaultData = [
        'players' => [
            ['id' => 1, 'name' => 'SOKHA "GODZILLA"', 'role' => 'Captain / Striker', 'stats' => '🏅 8 Titles • ⚽ 245 Goals', 'photo' => null, 'defaultIcon' => 'fa-user-ninja'],
            ['id' => 2, 'name' => 'RITHY "PHANTOM"', 'role' => 'Midfielder', 'stats' => '🏅 6 Titles • 🎯 112 Assists', 'photo' => null, 'defaultIcon' => 'fa-user-astronaut'],
            ['id' => 3, 'name' => 'VICHEKA "SHADOW"', 'role' => 'Defender', 'stats' => '🏅 5 Titles • 🛡️ 89 Clean Sheets', 'photo' => null, 'defaultIcon' => 'fa-user-secret'],
            ['id' => 4, 'name' => 'DARA "WIZARD"', 'role' => 'Goalkeeper', 'stats' => '🏅 7 Titles • 🧤 156 Saves', 'photo' => null, 'defaultIcon' => 'fa-user-graduate']
        ],
        'matches' => [
            ['id' => 1, 'date' => 'Mar 25, 2026', 'opponent' => 'Phoenix Esports', 'result' => '3 - 1 WIN', 'status' => 'win'],
            ['id' => 2, 'date' => 'Mar 28, 2026', 'opponent' => 'Dragon FC', 'result' => '2 - 0 WIN', 'status' => 'win'],
            ['id' => 3, 'date' => 'Apr 2, 2026', 'opponent' => 'Tiger Gaming', 'result' => 'Upcoming', 'status' => 'upcoming'],
            ['id' => 4, 'date' => 'Apr 5, 2026', 'opponent' => 'Khmer Warriors', 'result' => 'Upcoming', 'status' => 'upcoming']
        ],
        'achievements' => [
            ['id' => 1, 'title' => 'eFootball Cambodia Champions', 'year' => '2025', 'icon' => 'fa-trophy'],
            ['id' => 2, 'title' => 'SEA Invitational Runner-up', 'year' => '2025', 'icon' => 'fa-medal'],
            ['id' => 3, 'title' => 'Kingdom League Winners', 'year' => '2024, 2025', 'icon' => 'fa-crown'],
            ['id' => 4, 'title' => 'Undefeated Streak Record', 'year' => '21 Matches (2025)', 'icon' => 'fa-chart-line']
        ],
        'teamInfo' => ['tournamentsWon' => 15, 'totalMatches' => 45]
    ];

    if (!file_exists($dataFile)) {
        file_put_contents($dataFile, json_encode($defaultData, JSON_PRETTY_PRINT));
        return $defaultData;
    }
    $content = file_get_contents($dataFile);
    return json_decode($content, true);
}

// Save data to file
function saveData($data) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Handle requests
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Return the current data
    $data = loadData();
    echo json_encode($data);
    exit();
}

if ($method === 'POST') {
    // Admin authentication (simple password check)
    $input = json_decode(file_get_contents('php://input'), true);
    $password = $input['password'] ?? '';
    $data = $input['data'] ?? null;

    if ($password !== 'admin123') {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }

    if ($data === null) {
        http_response_code(400);
        echo json_encode(['error' => 'No data provided']);
        exit();
    }

    saveData($data);
    echo json_encode(['success' => true]);
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
