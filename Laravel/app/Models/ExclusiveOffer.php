<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExclusiveOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'current_value',
        'monthly_rental_income',
        'annual_growth_rate',
        'duration_years',
        'initial_investment', 
    ];

    public function property()
    {
        return $this->belongsTo(Property::class, 'property_id');
    }
}
