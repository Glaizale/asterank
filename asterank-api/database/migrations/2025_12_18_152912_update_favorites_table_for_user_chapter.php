<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('favorites', function (Blueprint $table) {
            if (!Schema::hasColumn('favorites', 'user_id')) {
                $table->unsignedBigInteger('user_id')->after('id');
            }
            if (!Schema::hasColumn('favorites', 'asteroid_id')) {
                $table->string('asteroid_id')->after('user_id');
            }
            if (!Schema::hasColumn('favorites', 'name')) {
                $table->string('name')->after('asteroid_id');
            }
            if (!Schema::hasColumn('favorites', 'type')) {
                $table->string('type')->nullable()->after('name');
            }
            if (!Schema::hasColumn('favorites', 'distance')) {
                $table->string('distance')->nullable()->after('type');
            }
            if (!Schema::hasColumn('favorites', 'value')) {
                $table->string('value')->nullable()->after('distance');
            }
            if (!Schema::hasColumn('favorites', 'notes')) {
                $table->text('notes')->nullable()->after('value');
            }

            if (!Schema::hasColumn('favorites', 'created_at')) {
                $table->timestamps();
            }
        });
    }

    public function down(): void
    {
        Schema::table('favorites', function (Blueprint $table) {
            // optional: drop added columns if you rollback
            // $table->dropColumn(['user_id','asteroid_id','name','type','distance','value','notes']);
        });
    }
};
