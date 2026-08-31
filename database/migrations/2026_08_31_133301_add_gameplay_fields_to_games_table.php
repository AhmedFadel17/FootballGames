<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->unsignedInteger('stamina_cost')->default(1)->after('description');
            $table->unsignedInteger('base_xp')->default(50)->after('stamina_cost');
            $table->unsignedInteger('base_coins')->default(100)->after('base_xp');
            $table->unsignedInteger('base_points')->default(100)->after('base_coins');
            $table->unsignedInteger('time_limit_seconds')->nullable()->after('base_points');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['stamina_cost', 'base_xp', 'base_coins', 'base_points', 'time_limit_seconds']);
        });
    }
};
