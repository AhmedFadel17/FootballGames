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
        Schema::table('bingo_game_instances', function (Blueprint $table) {
            $table->integer('current_match_pos')->default(0)->after('remaining_answers');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bingo_game_instances', function (Blueprint $table) {
            $table->dropColumn('current_match_pos');
        });
    }
};
