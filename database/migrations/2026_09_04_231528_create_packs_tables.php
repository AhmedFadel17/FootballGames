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
        // 1. Card Events / Themes Table
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->string('name', 100);
            $table->boolean('is_active')->default(true);
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();

            // Visual Theme Props
            $table->string('img_src')->nullable();
            $table->string('theme_color', 20)->default('#FFD700');

            $table->timestamps();

            $table->index('is_active');
        });

        Schema::create('player_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('player_id')->constrained('players')->cascadeOnDelete();
            $table->foreignId('event_id')->constrained('events')->restrictOnDelete();

            $table->unsignedTinyInteger('rarity')->default(1);
            $table->unsignedInteger('rating')->default(75);
            $table->string('img_src')->nullable();
            $table->boolean('is_packable')->default(true);

            $table->timestamps();

            $table->index(['player_id', 'event_id']);
            $table->index('is_packable');
        });


        // Power-ups / In-Game Helpers
        Schema::create('powerups', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->string('img_src')->nullable();
            $table->unsignedTinyInteger('type')->default(1);
            $table->unsignedTinyInteger('rarity')->default(1);
            $table->unsignedInteger('duration')->default(3600);
            $table->float('multiplier')->default(1.0);
            $table->timestamps();

            $table->index('type');
        });


        Schema::create('cosmetics', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->string('name', 100);
            $table->string('img_src');
            $table->unsignedTinyInteger('type')->default(1);
            $table->unsignedTinyInteger('rarity')->default(1);
            $table->timestamps();

            $table->index('type');
        });

        Schema::create('packs', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->unsignedInteger('price_coins')->default(0);
            $table->unsignedSmallInteger('cards_count')->default(5);
            $table->unsignedSmallInteger('required_level')->default(1);
            $table->unsignedInteger('user_limit')->nullable();
            $table->unsignedTinyInteger('limit_type')->default(0);
            $table->string('img_src')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('pack_drop_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pack_id')->constrained('packs')->cascadeOnDelete();

            $table->string('drop_type', 30);
            $table->unsignedTinyInteger('rarity')->nullable();
            $table->foreignId('event_id')->nullable()->constrained('events')->nullOnDelete();
            $table->unsignedInteger('min_coins')->default(0);
            $table->unsignedInteger('max_coins')->default(0);
            $table->decimal('drop_percentage', 5, 2);

            $table->timestamps();

            $table->index(['pack_id', 'drop_type']);
        });

        Schema::create('user_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            $table->morphs('cardable');

            $table->unsignedInteger('quantity')->default(1);
            $table->timestamp('obtained_at')->useCurrent();

            $table->unique(['user_id', 'cardable_type', 'cardable_id']);
        });

        Schema::create('user_powerups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('powerup_id')->constrained('powerups')->cascadeOnDelete();
            $table->unsignedInteger('quantity')->default(0);

            $table->unique(['user_id', 'powerup_id']);
        });


        Schema::create('user_pack_openings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('pack_id')->constrained('packs')->cascadeOnDelete();
            $table->unsignedInteger('coins_spent');

            $table->json('dropped_items');

            $table->timestamp('created_at')->useCurrent();

            $table->index(['user_id', 'pack_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_pack_openings');
        Schema::dropIfExists('user_powerups');
        Schema::dropIfExists('user_cards');
        Schema::dropIfExists('pack_drop_rules');
        Schema::dropIfExists('player_cards');

        Schema::dropIfExists('packs');
        Schema::dropIfExists('cosmetics');
        Schema::dropIfExists('powerups');
        Schema::dropIfExists('events');
    }
};
