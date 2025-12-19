<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_favorites', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');      // logged-in user
            $table->string('asteroid_id');              // external API id
            $table->string('asteroid_name');            // for easy display
            $table->text('note')->nullable();           // user note
            $table->unsignedTinyInteger('rating')->nullable(); // 1–5 stars
            $table->timestamps();

            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');

            $table->unique(['user_id', 'asteroid_id']); // no duplicates
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_favorites');
    }
};
