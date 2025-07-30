<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('competition_player_full_stats', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('competition_id');
            $table->unsignedBigInteger('player_id');

            // Core Stats
            $table->integer('appearances')->default(0);
            $table->integer('minutes_played')->default(0);
            $table->integer('goals')->default(0);
            $table->integer('assists')->default(0);
            $table->integer('yellow_cards')->default(0);
            $table->integer('red_cards')->default(0);
            $table->integer('clean_sheets')->default(0);
            $table->integer('saves')->default(0);
            $table->integer('penalties_saved')->default(0);
            $table->integer('own_goals')->default(0);
            $table->integer('goals_conceded')->default(0);
            $table->timestamps();

            // Foreign keys
            $table->foreign('competition_id')->references('id')->on('competitions')->onDelete('cascade');
            $table->foreign('player_id')->references('id')->on('players')->onDelete('cascade');

            // Unique combination
            $table->unique(['competition_id','player_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('competition_player_full_stats');
    }
};
