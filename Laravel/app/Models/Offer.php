<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'bien_id', 'first_name', 'last_name', 'email', 'phone', 'offer', 'financing', 'message', 'consent'
    ];

    public function bien()
    {
        return $this->belongsTo(Bien::class);
    }
}
