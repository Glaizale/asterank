<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('asteroid_observations', function (Blueprint $table) {
            $table->id();
            $table->string('obs_id')->unique();
            $table->string('target')->default('J99TS7A');
            $table->timestamp('observation_time')->nullable();
            $table->decimal('center_ra', 12, 8)->nullable();
            $table->decimal('center_dec', 12, 8)->nullable();
            $table->decimal('predicted_ra', 12, 8)->nullable();
            $table->decimal('predicted_dec', 12, 8)->nullable();
            $table->decimal('mag', 8, 2)->nullable();
            $table->decimal('offset', 10, 2)->nullable();
            $table->decimal('veloc_we', 10, 2)->nullable();
            $table->decimal('veloc_sn', 10, 2)->nullable();
            $table->decimal('pixel_loc_x', 10, 2)->nullable();
            $table->decimal('pixel_loc_y', 10, 2)->nullable();
            $table->string('triplet', 1)->default('n');
            $table->json('raw_data')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('asteroid_observations');
    }
};