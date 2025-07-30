<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('competition_participants', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('competition_id');
            $table->unsignedBigInteger('season_id');
            $table->unsignedBigInteger('team_id');
            $table->boolean('is_winner')->default(false);
            $table->timestamps();

            $table->foreign('competition_id')
                ->references('id')->on('competitions')
                ->onDelete('cascade');

            $table->foreign('season_id')
                ->references('id')->on('seasons')
                ->onDelete('cascade');

            $table->foreign('team_id')
                ->references('id')->on('teams')
                ->onDelete('cascade');

            $table->unique(['competition_id', 'season_id', 'team_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('competition_participants');
    }
};
