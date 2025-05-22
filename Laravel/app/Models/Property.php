<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'type',
        'price',
        'status',
        'location',
        'area',
        'bedrooms',
        'bathrooms',
        'description',
        'investmentType',
        'projectStatus',
        'returnRate',
        'minEntryPrice',
        'recommendedDuration',
        'partners',
        'financingEligibility',
        'isFeatured',
        'images',
        'documents',
    ];
    
    protected $casts = [
        'partners'=> 'array',
        'images' => 'array',
        'documents' => 'array',
        'financingEligibility' => 'boolean',
        'isFeatured' => 'boolean',
    ];
    public function getTemporaryImageUrls()
{
    $filenames = json_decode($this->images ?? '[]');
    return collect($filenames)->map(function ($name) {
        return Storage::disk('s3')->temporaryUrl(
            'images/' . $name,
            now()->addMinutes(60)
        );
    });
}
//show details property 
public function show($id)
{
    try {
        $property = Property::findOrFail($id);

        // Convertir en tableau et ajouter les champs nécessaires
        $partners = is_array($property->partners) ? $property->partners : json_decode($property->partners ?? '[]', true);
        $images = is_array($property->images) ? $property->images : json_decode($property->images ?? '[]', true);
        $documents = is_array($property->documents) ? $property->documents : json_decode($property->documents ?? '[]', true);

        $investmentDetails = [
            'investmentType' => $property->investmentType,
            'projectStatus' => $property->projectStatus,
            'returnRate' => $property->returnRate,
            'minEntryPrice' => $property->minEntryPrice,
            'recommendedDuration' => $property->recommendedDuration,
            'partners' => $partners,
            'financingEligibility' => $property->financingEligibility,
        ];

        return response()->json([
            'id' => $property->id,
            'title' => $property->title,
            'type' => $property->type,
            'price' => $property->price,
            'status' => $property->status,
            'location' => $property->location,
            'area' => $property->area,
            'bedrooms' => $property->bedrooms,
            'bathrooms' => $property->bathrooms,
            'description' => $property->description,
            'isFeatured' => $property->isFeatured,
            'images' => $images,
            'documents' => $documents,
            'investmentDetails' => $investmentDetails,
            'created_at' => $property->created_at->format('Y-m-d H:i:s'),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Bien introuvable.',
            'error' => $e->getMessage()
        ], 404);
    }
}

}
