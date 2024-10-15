<?php
// Database connection
$host = 'localhost';
$db = 'community_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;port=3307;dbname=$db;charset=$charset";




$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $db = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Handle different actions
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'signup':

        ob_clean();
        header('Content-Type: application/json');

        $data = json_decode(file_get_contents('php://input'), true);
        $username = $data['username'];
        $password = password_hash($data['password'], PASSWORD_BCRYPT);
    
        // Check if username already exists
        $stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
    
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Username already exists.']);
        } else {
            // Insert new user
            $stmt = $db->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
            $stmt->execute([$username, $password]);
            echo json_encode(['success' => true]);
        }
        break;
    
    
    case 'login':

        ob_clean();
        header('Content-Type: application/json');

        $data = json_decode(file_get_contents('php://input'), true);
        $username = $data['username'];
        $password = $data['password'];

        // Check credentials
        $stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials.']);
        }
        break;

    case 'submit_story':

        ob_clean();
        header('Content-Type: application/json');

        $data = json_decode(file_get_contents('php://input'), true);
        $authorName = $data['authorName'];
        $title = $data['title'];
        $content = $data['content'];
        
        // 插入此检查，确保用户已登录
        if (empty($authorName)) {
            echo json_encode(['success' => false, 'message' => 'You must be logged in to submit a story.']);
            exit();
        }

        

        // Insert the story into the database
        $stmt = $db->prepare("INSERT INTO stories (authorName, title, content, submission_time) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$authorName, $title, $content]);
        echo json_encode(['success' => true]);
        break;

        case 'get_stories':
            $stmt = $db->query("SELECT * FROM stories ORDER BY submission_time DESC");
            $stories = $stmt->fetchAll(PDO::FETCH_ASSOC); // 使用关联数组形式获取数据
        
            foreach ($stories as &$story) {
                $storyId = $story['id'];
                $commentStmt = $db->prepare("SELECT * FROM comments WHERE storyId = ? ORDER BY comment_time DESC");
                $commentStmt->execute([$storyId]);
                $story['comments'] = $commentStmt->fetchAll(PDO::FETCH_ASSOC); // 确保获取的也是数组
            }
        
            header('Content-Type: application/json');
            echo json_encode($stories);
            exit();
        

    case 'add_comment':
      
        ob_clean();
        header('Content-Type: application/json');

        $data = json_decode(file_get_contents('php://input'), true);
        $storyId = $data['storyId'];
        $commentContent = $data['commentContent'];
        $author = $data['author'];
            // 插入此检查，确保用户已登录
        if (empty($author)) {
            echo json_encode(['success' => false, 'message' => 'You must be logged in to submit a comment.']);
            exit();
        }

        // Insert comment into the database
        $stmt = $db->prepare("INSERT INTO comments (storyId, content, author, comment_time) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$storyId, $commentContent, $author]);
        echo json_encode(['success' => true]);
        break;

    case 'delete_story':
        
        ob_clean();
        header('Content-Type: application/json');

        $data = json_decode(file_get_contents('php://input'), true);
        $storyId = $data['storyId'];

        // Delete the story and its comments
        $stmt = $db->prepare("DELETE FROM comments WHERE storyId = ?");
        $stmt->execute([$storyId]);

        $stmt = $db->prepare("DELETE FROM stories WHERE id = ?");
        $stmt->execute([$storyId]);

        echo json_encode(['success' => true]);
        break;

    case 'delete_comment':
        
        ob_clean();
        header('Content-Type: application/json');

        $data = json_decode(file_get_contents('php://input'), true);
        $commentId = $data['commentId'];

        // Delete the comment
        $stmt = $db->prepare("DELETE FROM comments WHERE id = ?");
        $stmt->execute([$commentId]);

        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
        break;
}
?>
