<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserFavorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'asteroid_id',
        'asteroid_name',
        'note',
        'rating',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
