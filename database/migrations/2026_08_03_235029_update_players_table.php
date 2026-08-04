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
        Schema::table('players', function (Blueprint $table) {
            $table->integer('height_cm')->nullable()->after('api_id');
            $table->integer('weight_kg')->nullable()->after('api_id');
            $table->integer('preferred_foot')->nullable()->after('api_id');
            $table->bigInteger('market_value')->nullable()->after('api_id');
            $table->integer('rating')->nullable()->after('api_id');
            $table->string('slug')->nullable()->after('api_id');

            DB::statement('ALTER TABLE players ALTER COLUMN position TYPE smallint USING (position::smallint)');
            DB::statement('ALTER TABLE players DROP CONSTRAINT IF EXISTS players_position_check');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('players', function (Blueprint $table) {
            $table->dropColumn(['height_cm', 'weight_kg', 'preferred_foot', 'slug', 'rating', 'market_value']);
            DB::statement('ALTER TABLE players ALTER COLUMN position TYPE varchar USING (position::varchar)');
            DB::statement("ALTER TABLE players ADD CONSTRAINT players_position_check CHECK (position IN ('league', 'cup', 'international', 'friendly'))");
        });
    }
};
