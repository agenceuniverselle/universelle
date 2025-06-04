<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PropertyController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::view('/{any}', 'app')->where('any', '.*');


// Route pour servir votre application React
Route::get('/{any}', function () {
    return view('app'); // Vue principale qui charge votre app React
})->where('any', '.*');

// Ou si vous voulez des routes spécifiques :
Route::get('/login', function () {
    return view('app');
});