<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvestorRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'montant_investissement',
        'type_participation',
        'prenom',
        'nom',
        'email',
        'telephone',
        'nationalite',
        'commentaire',
        'consent',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
