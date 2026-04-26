<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});






Route::get("/product" , [ProductController::class , "index"]);
Route::post("/product/store" , [ProductController::class , "store"]);
Route::delete("/product/destroy/{product}" , [ProductController::class , "destroy"]);
Route::put("/product/update/{product}" , [ProductController::class , "update"]);








require __DIR__.'/settings.php';

