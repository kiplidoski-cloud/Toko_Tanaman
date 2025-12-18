<?php
// Midtrans Server Key
$serverKey = 'YOUR_SERVER_KEY_HERE';
$isProduction = false;

// Set Midtrans configuration
require_once dirname(__FILE__) . '/midtrans-php/Midtrans.php';
\Midtrans\Config::$serverKey = $serverKey;
\Midtrans\Config::$isProduction = $isProduction;
\Midtrans\Config::$isSanitized = true;
\Midtrans\Config::$is3ds = true;

// Get POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Prepare transaction data
$transaction = array(
    'transaction_details' => $data['transaction_details'],
    'customer_details' => $data['customer_details'],
    'item_details' => $data['item_details']
);

try {
    // Get Snap token
    $snapToken = \Midtrans\Snap::getSnapToken($transaction);
    
    echo json_encode(array(
        'status' => 'success',
        'token' => $snapToken
    ));
} catch (Exception $e) {
    echo json_encode(array(
        'status' => 'error',
        'message' => $e->getMessage()
    ));
}
?>