<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvestorRequestController;
use App\Http\Controllers\PropertyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/investors/{id}/store', [InvestorRequestController::class, 'store']);

Route::post('admin/properties', [PropertyController::class, 'store']);
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/download/{propertyId}/{documentIndex}', [PropertyController::class, 'downloadDocument']);



Route::get('/init', function () {
    return response()->json(['message' => 'API Init successful']);
});