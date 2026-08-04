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
        Schema::table('player_team_periods', function (Blueprint $table) {
            $table->boolean('is_loan')->default(false)->after('end_date');
            $table->boolean('is_current')->default(false)->after('is_loan');

            $table->index(['player_id', 'start_date', 'end_date']);
            $table->index(['team_id', 'start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('player_team_periods', function (Blueprint $table) {
            $table->dropIndex(['player_id', 'start_date', 'end_date']);
            $table->dropIndex(['team_id', 'start_date', 'end_date']);

            $table->dropColumn(['is_loan', 'is_current']);
        });
    }
};
