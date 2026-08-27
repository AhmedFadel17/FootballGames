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
        // 1. Continents Table
        Schema::table('continents', function (Blueprint $table) {
            $table->unsignedInteger('popularity')->default(0)->after('name');
            $table->string('img_src')->nullable()->after('popularity');
        });

        // 2. Countries Table
        Schema::table('countries', function (Blueprint $table) {
            // Type enum/tinyint: e.g., 1 = Country, 2 = Confederation/Federation (UEFA, CONMEBOL)
            $table->boolean('is_federation')->default(false)->after('name');
            $table->string('img_src')->nullable()->after('name');
        });

        // 3. Teams Table
        Schema::table('teams', function (Blueprint $table) {
            // Type enum/tinyint: e.g., 1 = Club, 2 = National Team, 3 = Youth Club, 4 = Youth National Team
            $table->unsignedTinyInteger('type')->default(1)->comment('1=Club, 2=National, 3=Youth Club, 4=Youth National')->after('name');
            $table->foreignId('current_competition_id')
                ->nullable()
                ->after('type')
                ->constrained('competitions')
                ->nullOnDelete();
        });

        // 4. Players Table
        Schema::table('players', function (Blueprint $table) {
            $table->boolean('is_retired')->default(false)->after('name');
            $table->foreignId('current_team_id')
                ->nullable()
                ->after('is_retired')
                ->constrained('teams')
                ->nullOnDelete();
        });

        // 5. Managers Table
        Schema::table('managers', function (Blueprint $table) {
            $table->boolean('is_retired')->default(false)->after('name');
            $table->foreignId('current_team_id')
                ->nullable()
                ->after('is_retired')
                ->constrained('teams')
                ->nullOnDelete();
        });

        Schema::table('bingo_games', function (Blueprint $table) {
            $table->unsignedSmallInteger('difficulty')->default(1)->after('size');
        });

        Schema::table('grid_games', function (Blueprint $table) {
            $table->unsignedSmallInteger('difficulty')->default(1)->after('size');
        });

        Schema::table('career_games', function (Blueprint $table) {
            $table->unsignedSmallInteger('difficulty')->default(1)->after('attempts_left');
        });
        Schema::table('games', function (Blueprint $table) {
            $table->string('img_src')->nullable()->after('max_players');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('managers', function (Blueprint $table) {
            $table->dropForeign(['current_team_id']);
            $table->dropColumn(['is_retired', 'current_team_id']);
        });

        Schema::table('players', function (Blueprint $table) {
            $table->dropForeign(['current_team_id']);
            $table->dropColumn(['is_retired', 'current_team_id']);
        });

        Schema::table('teams', function (Blueprint $table) {
            $table->dropForeign(['current_competition_id']);
            $table->dropColumn(['type', 'current_competition_id']);
        });

        Schema::table('countries', function (Blueprint $table) {
            $table->dropColumn(['is_federation', 'img_src']);
        });

        Schema::table('continents', function (Blueprint $table) {
            $table->dropColumn(['popularity', 'img_src']);
        });

        Schema::table('bingo_games', function (Blueprint $table) {
            $table->dropColumn(['difficulty']);
        });

        Schema::table('grid_games', function (Blueprint $table) {
            $table->dropColumn(['difficulty']);
        });

        Schema::table('career_games', function (Blueprint $table) {
            $table->dropColumn(['difficulty']);
        });

        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['img_src']);
        });
    }
};
