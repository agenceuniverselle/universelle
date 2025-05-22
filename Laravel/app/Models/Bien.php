<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bien extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'status',
        'price',
        'location',
        'area',
        'bedrooms',
        'bathrooms',
        'description',
        'is_featured',
        'available_date',
        'images',
        'documents',
        'is_draft',
        'construction_year',
        'condition',
        'exposition',
        'cuisine',
        'has_parking',
        'parking_places',
        'climatisation',
        'terrasse',
        'points_forts',
        'occupation_rate',
        'estimated_valuation',
        'estimated_charges',
        'monthly_rent',
        'quartier',            
        'proximite',           
        'map_link', 
        'owner_name',
        'owner_email',
        'owner_phone',
        'owner_nationality',
        'owner_documents',
           
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_draft' => 'boolean',
        'available_date' => 'date',
        'images' => 'array',
        'documents' => 'array',
        'points_forts' => 'array',
        'proximite' => 'array',  
        'owner_documents' => 'array',  // ✅ Ajouté : Cast JSON

    ];
}
