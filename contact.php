<?php
declare(strict_types=1);

ob_start();
error_reporting(0);

header('Content-Type: application/json; charset=utf-8');

// Apenas requisições POST são aceitas
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_clean();
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['success' => false, 'message' => 'Método não permitido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Obter dados tanto de $_POST quanto de payload JSON
$inputData = $_POST;
if (empty($inputData)) {
    $rawInput = file_get_contents('php://input');
    if (!empty($rawInput)) {
        $jsonData = json_decode($rawInput, true);
        if (is_array($jsonData)) {
            $inputData = $jsonData;
        }
    }
}

// Honeypot anti-spam
$honeypot = trim((string) ($inputData['_gotcha'] ?? ''));
if ($honeypot !== '') {
    ob_clean();
    echo json_encode(['success' => true, 'message' => 'Solicitação enviada com sucesso!'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Sanitização e extração dos campos
$name = trim(strip_tags((string) ($inputData['nome'] ?? '')));
$company = trim(strip_tags((string) ($inputData['empresa'] ?? '')));
$email = trim(filter_var((string) ($inputData['email'] ?? ''), FILTER_SANITIZE_EMAIL));
$whatsapp = trim(strip_tags((string) ($inputData['whatsapp'] ?? '')));
$role = trim(strip_tags((string) ($inputData['cargo'] ?? '')));
$eventType = trim(strip_tags((string) ($inputData['tipo-evento'] ?? '')));
$participants = trim(strip_tags((string) ($inputData['participantes'] ?? '')));
$eventDate = trim(strip_tags((string) ($inputData['data'] ?? '')));
$message = trim(strip_tags((string) ($inputData['mensagem'] ?? '')));
$consent = trim((string) ($inputData['consentimento'] ?? ''));

// Validação dos campos obrigatórios
if ($name === '') {
    ob_clean();
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Por favor, informe seu nome.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($company === '') {
    ob_clean();
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Por favor, informe o nome da sua empresa.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    ob_clean();
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Por favor, informe um endereço de e-mail corporativo válido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($consent !== 'autorizado') {
    ob_clean();
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'É necessário autorizar o contato para que possamos atendê-lo.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Persistência segura de backup dos leads (garante que nenhum contato seja perdido)
$dataDir = __DIR__ . '/data';
$leadSaved = false;

try {
    if (!is_dir($dataDir)) {
        @mkdir($dataDir, 0755, true);
    }

    $htaccessPath = $dataDir . '/.htaccess';
    if (!file_exists($htaccessPath)) {
        @file_put_contents($htaccessPath, "Require all denied\nDeny from all\n");
    }

    $leadRecord = [
        'id' => uniqid('lead_', true),
        'timestamp' => date('c'),
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'nome' => $name,
        'empresa' => $company,
        'email' => $email,
        'whatsapp' => $whatsapp,
        'cargo' => $role,
        'tipo_evento' => $eventType,
        'participantes' => $participants,
        'data_prevista' => $eventDate,
        'mensagem' => $message,
        'consentimento' => $consent,
    ];

    $logFile = $dataDir . '/leads.jsonl';
    $writeResult = @file_put_contents($logFile, json_encode($leadRecord, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n", FILE_APPEND | LOCK_EX);
    if ($writeResult !== false) {
        $leadSaved = true;
    }
} catch (\Throwable $e) {
    // Falha silenciosa na persistência de log para não interromper envio principal
}

// Envio de e-mail de notificação
$recipient = 'contato@sghdispenser.com';
$subject = 'Nova solicitação de demonstração - ' . $company;
$body = implode("\n", [
    'Nova solicitação de demonstração recebida pelo site SGH.',
    '==================================================',
    'Data/Hora: ' . date('d/m/Y H:i:s'),
    "Nome: {$name}",
    "Empresa: {$company}",
    "E-mail: {$email}",
    "WhatsApp: {$whatsapp}",
    "Cargo / função: {$role}",
    "Tipo de evento: {$eventType}",
    "Participantes estimados: {$participants}",
    "Data prevista: {$eventDate}",
    '==================================================',
    'Mensagem:',
    $message !== '' ? $message : '(Nenhuma mensagem adicional informada)',
    '==================================================',
]);

// Higienização de headers contra injeção de cabeçalhos
$safeEmail = str_replace(["\r", "\n", "%0a", "%0d"], '', $email);
$headers = [
    'From: SGH Dispenser <contato@sghdispenser.com>',
    'Reply-To: ' . $safeEmail,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$mailSent = @mail($recipient, $subject, $body, implode("\r\n", $headers));

// Se o e-mail foi enviado ou se o lead foi salvo com segurança em disco, confirmamos o recebimento
if ($mailSent || $leadSaved) {
    ob_clean();
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Solicitação enviada com sucesso! Nossa equipe entrará em contato em breve.'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

ob_clean();
http_response_code(500);
echo json_encode([
    'success' => false,
    'message' => 'Não foi possível registrar sua solicitação no momento. Por favor, tente novamente ou escreva para contato@sghdispenser.com.'
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);