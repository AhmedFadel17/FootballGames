<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->nullable()->after('name');
            $table->string('avatar')->nullable()->after('email');
            $table->integer('coins')->default(0)->after('avatar');
            $table->integer('games_played')->default(0)->after('coins');
            $table->integer('games_won')->default(0)->after('games_played');
            $table->integer('games_lost')->default(0)->after('games_won');
            $table->string('favorite_team')->nullable()->after('games_lost');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username',
                'avatar',
                'coins',
                'games_played',
                'games_won',
                'games_lost',
                'favorite_team',
            ]);
        });
    }
};