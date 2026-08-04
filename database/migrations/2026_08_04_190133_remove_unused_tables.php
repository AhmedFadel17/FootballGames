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
        Schema::dropIfExists('competition_participants');
        Schema::dropIfExists('competition_player_full_stats');
        Schema::dropIfExists('competition_team_full_stats');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

    }
};
