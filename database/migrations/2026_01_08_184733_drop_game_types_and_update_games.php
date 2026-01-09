<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
        $table->dropForeign(['game_type_id']);
        $table->dropColumn('game_type_id');
    });
    Schema::table('games', function (Blueprint $table) {
        $table->renameColumn('title', 'name'); 
    });

    Schema::table('games', function (Blueprint $table) {
        $table->string('slug')->unique()->nullable()->after('name');
        $table->integer('max_players')->default(4)->after('slug');
        $table->integer('min_players')->default(2)->after('slug');
        $table->json('default_config')->nullable();
    });
    DB::table('games')->get()->each(function ($game) {
    DB::table('games')
        ->where('id', $game->id)
        ->update(['slug' => Str::slug($game->name ?? $game->title)]);
});    
Schema::table('games', function (Blueprint $table) {
    $table->string('slug')->nullable(false)->change();
});
        Schema::dropIfExists('game_types');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('game_types', function (Blueprint $table) {
             $table->id();
            $table->string('name')->unique(); 
            $table->string('slug')->unique(); 
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::table('games', function (Blueprint $table) {
            $table->foreignId('game_type_id')->nullable()->constrained('game_types');
            $table->dropColumn('slug');
            $table->rename('name', 'title');
            $table->dropColumn('min_players');
            $table->dropColumn('max_players');
            $table->dropColumn('default_config');


        });
    }
};
