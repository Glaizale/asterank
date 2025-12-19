<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('asteroids', function (Blueprint $table) {
            if (!Schema::hasColumn('asteroids', 'instrument')) {
                $table->string('instrument')->nullable();
            }
            if (!Schema::hasColumn('asteroids', 'filter')) {
                $table->string('filter')->nullable();
            }
            if (!Schema::hasColumn('asteroids', 'exposure')) {
                $table->decimal('exposure', 8, 2)->nullable();
            }
            // repeat for any other columns this migration adds
        });
    }

    public function down(): void
    {
        Schema::table('asteroids', function (Blueprint $table) {
            if (Schema::hasColumn('asteroids', 'instrument')) {
                $table->dropColumn('instrument');
            }
            if (Schema::hasColumn('asteroids', 'filter')) {
                $table->dropColumn('filter');
            }
            if (Schema::hasColumn('asteroids', 'exposure')) {
                $table->dropColumn('exposure');
            }
        });
    }
};
