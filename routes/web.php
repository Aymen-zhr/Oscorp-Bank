<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'home', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::post('ai/chat', [\App\Http\Controllers\AIController::class, 'chat'])->name('ai.chat');
});





Route::get("/product" , [ProductController::class , "index"]);
Route::post("/product/store" , [ProductController::class , "store"]);
Route::delete("/product/destroy/{product}" , [ProductController::class , "destroy"]);
Route::put("/product/update/{product}" , [ProductController::class , "update"]);








require __DIR__.'/settings.php';

