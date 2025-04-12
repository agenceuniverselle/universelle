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
}
