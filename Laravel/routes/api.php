<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvestorRequestController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\BienController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\BlogArticleController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CommentReactionController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ExclusiveOfferController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\Auth\JwtAuthController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ConseillerContactController;
use App\Http\Controllers\ExpertContactController;
use App\Http\Controllers\ProjectController;

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
//nos proprietes a inverstir 
Route::middleware(['auth:api'])->group(function () {
    Route::post('admin/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
});
Route::delete('/properties/{id}/document/{index}', [PropertyController::class, 'deleteDocumentAtIndex']);
Route::delete('/properties/{id}/image/{index}', [PropertyController::class, 'deleteImageAtIndex']);
// Routes publiques (pas besoin d'authentification)
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/download/{propertyId}/{documentIndex}', [PropertyController::class, 'downloadDocument']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);
Route::post('/investors/{property}/store', [InvestorRequestController::class, 'store']);
Route::get('/investor-requests', [InvestorRequestController::class, 'index']);
Route::delete('/investor-requests/{id}', [InvestorRequestController::class, 'destroy']); // Supprimer une demande
Route::put('/investor-requests/{id}', [InvestorRequestController::class, 'update']);
Route::get('/investor-requests/{id}', [InvestorRequestController::class, 'show']);
Route::post('/prospects/store', [InvestorRequestController::class, 'storeProspect']);

//init
Route::get('/init', function () {
    return response()->json(['message' => 'API Init successful']);
});
//nos biens a vendre
Route::get('/biens', [BienController::class, 'index']);
Route::get('/biens/{id}', [BienController::class, 'show']);
Route::get('/biens/similaires/{id}', [BienController::class, 'similaires']);
Route::get('/download/{BienId}', [BienController::class, 'downloadDocument']);
Route::get('/download-owner/{id}', [BienController::class, 'downloadOwnerDocument']);
Route::middleware('auth:api')->group(function () {
    Route::post('/biens', [BienController::class, 'store']);
    Route::put('/biens/{id}', [BienController::class, 'update']);
    Route::delete('/biens/{id}', [BienController::class, 'destroy']);
});
Route::delete('/biens/{id}/images/{index}', [BienController::class, 'deleteImage']);
Route::delete('/biens/{id}/document', [BienController::class, 'deleteDocument']);
Route::delete('/biens/{id}/owner-documents/{index}', [BienController::class, 'deleteOwnerDocumentByIndex']);

//offer pour un bien 
Route::post('/offers', [OfferController::class, 'store']);
Route::get('/offers', action: [OfferController::class, 'index']);
Route::delete('/offers/{id}', [OfferController::class, 'destroy']);

//message pour un bien 
Route::post('/messages', [MessageController::class, 'store']);
Route::get('/messages', [MessageController::class, 'index']);
Route::delete('/messages/{id}', [MessageController::class, 'destroy']);
//admin blog
Route::middleware(['auth:api'])->group(function () {
    Route::post('/admin/blogs', [BlogArticleController::class, 'store']);
    Route::delete('/admin/blogs/{id}', [BlogArticleController::class, 'destroy']);
    Route::put('/blogs/{id}', [BlogArticleController::class, 'update']);
});
//blog 
Route::get('/blogs', [BlogArticleController::class, 'index']);
Route::get('/blogs/{id}', action: [BlogArticleController::class, 'show']);
Route::post('/admin/upload', [BlogArticleController::class, 'uploadImage']);
Route::get('/admin/blogs/{id}', [BlogArticleController::class, 'show']);
Route::post('/blogs/{id}/rate', [BlogArticleController::class, 'rate']);

//blog similaires 
Route::get('/blogs/{id}/similaires', [BlogArticleController::class, 'similaires']);
//comments
Route::get('/blogs/{id}/comments', [CommentController::class, 'showComments']);
Route::post('/blogs/{id}/comments', [CommentController::class, 'store']);
Route::post('/comments/{comment}/reaction', [CommentReactionController::class, 'toggleReaction']);
Route::get('/comments', [CommentController::class, 'getAllComments']);
Route::delete('/comments/{id}', [CommentController::class, 'deleteComment']);
//
//newsletter
Route::post('/newsletter', [NewsletterController::class, 'store']);
Route::get('/newsletters', [NewsletterController::class, 'index']);
Route::delete('/newsletters/{id}', [NewsletterController::class, 'destroy']);

//contactus 
Route::post('/vip-contact', [ContactController::class, 'store']);
Route::get('/contacts', [ContactController::class, 'index']);
Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);

//offre exclusive

Route::middleware(['auth:api'])->group(function () {
    Route::post('/exclusive-offers', [ExclusiveOfferController::class, 'store']);
    Route::put('/exclusive-offers/{id}', [ExclusiveOfferController::class, 'update']);
    Route::delete('/exclusive-offers/{id}', [ExclusiveOfferController::class, 'destroy']);
});
Route::get('/exclusive-offers/{id}', [ExclusiveOfferController::class, 'show']);
Route::get('/exclusive-offers', [ExclusiveOfferController::class, 'index']);
//testimonials 
Route::middleware(['auth:api'])->group(function () {
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::put('/testimonials/{id}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{id}', [TestimonialController::class, 'destroy']);
});
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/testimonials/{id}', [TestimonialController::class, 'show']);
Route::delete('/testimonials/{id}/image', [TestimonialController::class, 'deleteImage']);

//permissions-roles
Route::middleware('auth:api')->group(function () {
    Route::get('/admin/roles', [RoleController::class, 'index']);
    Route::post('/admin/roles', [RoleController::class, 'store']);
    Route::put('/admin/roles/{id}', [RoleController::class, 'update']);
    Route::delete('/admin/roles/{id}', [RoleController::class, 'destroy']);
    Route::get('/admin/permissions', [RoleController::class, 'allPermissions']);
});

// CSRF Token Route (Needed for Axios)
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF Cookie Set']);
});
Route::post('/login', [JwtAuthController::class, 'login']);
Route::post('/logout', [JwtAuthController::class, 'logout'])->middleware('auth:api');
Route::post('/refresh', [JwtAuthController::class, 'refresh'])->middleware('auth:api');
// routes/api.php
Route::middleware('auth:api')->get('/me', function (Request $request) {
    return response()->json($request->user());
});
Route::middleware('auth:api')->group(function () {
    // ✅ Gestion des utilisateurs
    Route::get('/admin/users', [UserController::class, 'index']);     // Liste des utilisateurs
    Route::post('/admin/users', [UserController::class, 'store']);    // Création d'un utilisateur
    Route::get('/admin/users/{id}', [UserController::class, 'show']); // Détails d'un utilisateur
    Route::put('/admin/users/{id}', [UserController::class, 'update']); // Modification d'un utilisateur
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']); // Suppression d'un utilisateur
    Route::get('/user/permissions', [UserController::class, 'getUserPermissions']);
});

//conseiller
Route::post('/advisor-requests', [ConseillerContactController::class, 'store']);
Route::get('/advisor-requests', [ConseillerContactController::class, 'index']);
Route::get('/advisor-requests/{id}', [ConseillerContactController::class, 'show']);
Route::put('/advisor-requests/{id}', [ConseillerContactController::class, 'update']);
Route::delete('/advisor-requests/{id}', [ConseillerContactController::class, 'destroy']);
// routes/api.php
Route::middleware('auth:api')->group(function () {
    Route::get('/activities', [ActivityController::class, 'index']);
    Route::get('/activities/latest', [ActivityController::class, 'latestThree']);
});
//Expert
Route::post('/expert-contact', [ExpertContactController::class, 'store']);
Route::get('/expert-contacts', [ExpertContactController::class, 'index']); // This route is now protected
Route::put('/expert-contacts/{id}', action: [ExpertContactController::class, 'update']);
Route::delete('/expert-contacts/{id}', [ExpertContactController::class, 'destroy']);

// 📂 Routes publiques
Route::get('/projects', [ProjectController::class, 'index']);       // Liste des projets
Route::get('/projects/{id}', [ProjectController::class, 'show']);   // Détail d’un projet

// 🔐 Routes protégées (admin ou authentifiées)
Route::middleware('auth:api')->group(function () {
    Route::post('/projects', [ProjectController::class, 'store']);          // Créer un projet
    Route::put('/projects/{id}', [ProjectController::class, 'update']);     // Mettre à jour un projet
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']); // Supprimer un projet
});
