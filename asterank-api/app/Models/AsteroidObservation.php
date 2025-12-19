<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AsteroidObservation extends Model
{
    protected $fillable = [
        'obs_id',
        'target',
        'observation_time',
        'center_ra',
        'center_dec',
        'predicted_ra',
        'predicted_dec',
        'mag',
        'offset',
        'veloc_we',
        'veloc_sn',
        'pixel_loc_x',
        'pixel_loc_y',
        'triplet',
        'raw_data',
    ];

    protected $casts = [
        'observation_time' => 'datetime',
        'raw_data'         => 'array',
        'center_ra'        => 'float',
        'center_dec'       => 'float',
        'predicted_ra'     => 'float',
        'predicted_dec'    => 'float',
        'mag'              => 'float',
        'offset'           => 'float',
        'veloc_we'         => 'float',
        'veloc_sn'         => 'float',
    ];
}
