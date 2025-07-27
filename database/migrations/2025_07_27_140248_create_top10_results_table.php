<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('top10_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_instance_id')->constrained()->onDelete('cascade');
            $table->json('correct_ordered_ids');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('top10_results');
    }
};
