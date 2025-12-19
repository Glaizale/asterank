<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');

            // External asteroid info
            $table->string('asteroid_id');      // from API / fallback data
            $table->string('name');             // asteroid name
            $table->string('type')->nullable();
            $table->string('distance')->nullable();
            $table->string('value')->nullable();

            // User custom field (CRUD requirement)
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');

            // prevent same asteroid twice for same user
            $table->unique(['user_id', 'asteroid_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};

