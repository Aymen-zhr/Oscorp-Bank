<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Buffer output so headers can still be sent even if downstream code writes early.
ob_start(null, 0, PHP_OUTPUT_HANDLER_STDFLAGS);
register_shutdown_function(function () {
    $error = error_get_last();

    // If a fatal error occurred, clear any output buffer so the framework can still send the error response.
    if ($error && ob_get_level() > 0) {
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
    }
});

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());

if (ob_get_level() > 0) {
    ob_end_flush();
}
