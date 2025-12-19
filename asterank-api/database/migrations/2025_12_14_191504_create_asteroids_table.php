<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asteroids', function (Blueprint $table) {
            $table->id();
            $table->string('full_name')->unique();
            $table->string('orbit_class')->nullable();
            $table->float('diameter')->nullable();
            $table->float('price')->nullable();
            $table->float('a')->nullable();
            $table->float('e')->nullable();
            $table->float('i')->nullable();
            $table->float('moid')->nullable();
            $table->float('epoch')->nullable();

            // Optional extra fields
            $table->string('instrument')->nullable();
            $table->string('filter')->nullable();
            $table->string('image_id')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asteroids');
    }
};
