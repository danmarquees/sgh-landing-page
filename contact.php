<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['success' => false, 'message' => 'Método não permitido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$honeypot = trim((string) ($_POST['_gotcha'] ?? ''));
if ($honeypot !== '') {
    echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

$name = trim((string) ($_POST['nome'] ?? ''));
$company = trim((string) ($_POST['empresa'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$whatsapp = trim((string) ($_POST['whatsapp'] ?? ''));
$role = trim((string) ($_POST['cargo'] ?? ''));
$eventType = trim((string) ($_POST['tipo-evento'] ?? ''));
$participants = trim((string) ($_POST['participantes'] ?? ''));
$eventDate = trim((string) ($_POST['data'] ?? ''));
$message = trim((string) ($_POST['mensagem'] ?? ''));
$consent = (string) ($_POST['consentimento'] ?? '');

if ($name === '' || $company === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $consent !== 'autorizado') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Preencha os campos obrigatórios e autorize o contato.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$recipient = 'contato@sghdispenser.com';
$subject = 'Nova solicitação de demonstração - SGH';
$body = implode("\n", [
    'Nova solicitação de demonstração recebida pelo site SGH.',
    '',
    "Nome: {$name}",
    "Empresa: {$company}",
    "E-mail: {$email}",
    "WhatsApp: {$whatsapp}",
    "Cargo / função: {$role}",
    "Tipo de evento: {$eventType}",
    "Participantes estimados: {$participants}",
    "Data prevista: {$eventDate}",
    '',
    'Mensagem:',
    $message,
]);

$headers = [
    'From: SGH Dispenser <contato@sghdispenser.com>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($recipient, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Não foi possível enviar sua solicitação agora.'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);