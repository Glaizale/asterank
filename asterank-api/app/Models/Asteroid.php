<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asteroid extends Model
{
    protected $table = 'asteroids';

    protected $fillable = [
        'full_name',
        'class',
        'diameter',
        'price',
        'a',
        'e',
        'i',
        'moid',
        'epoch'
    ];
}
