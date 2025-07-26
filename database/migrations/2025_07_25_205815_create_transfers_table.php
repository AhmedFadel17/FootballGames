<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('player_id')->constrained()->onDelete('cascade');
            $table->foreignId('from_team_id')->nullable()->constrained('teams')->onDelete('set null');
            $table->foreignId('to_team_id')->constrained('teams')->onDelete('cascade');
            $table->decimal('fee', 12, 2)->nullable();
            $table->date('transfer_date');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('transfers');
    }
};

