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
        Schema::table('game_results', function (Blueprint $table) {
            $table->unsignedInteger('duration_seconds')->default(0)->after('rank');
            $table->unsignedInteger('earned_xp')->default(0)->after('rank');
            $table->unsignedInteger('earned_coins')->default(0)->after('rank');
            $table->unsignedInteger('earned_points')->default(0)->after('rank');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_results', function (Blueprint $table) {
            $table->dropColumn(['duration_seconds', 'earned_xp', 'earned_coins', 'earned_points']);
        });
    }
};
