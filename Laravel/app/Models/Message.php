<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected $fillable = [
        'bien_id',
        'name',
        'email',
        'phone',
        'contact_method',
        'visit_type',
        'visit_date',
        'message',
    ];
}
