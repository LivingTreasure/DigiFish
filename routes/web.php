<?php

use App\Http\Controllers\LoginController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\APIController;
use App\Http\Controllers\HomeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('game');
})->name('game')->middleware('auth');

Route::post('/api/move', [APIController::class, 'setMove']);
Route::get('/api/move', [APIController::class, 'getMove']);

Route::post('/api/inventory', [APIController::class, 'setInventory']);
Route::get('/api/inventory', [APIController::class, 'getInventory']);

Route::get('/logout', [HomeController::class, 'logout']);

Auth::routes();
