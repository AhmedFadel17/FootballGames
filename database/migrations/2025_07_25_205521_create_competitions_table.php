<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('competitions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name'); 
            $table->string('short_name')->nullable();
            $table->unsignedBigInteger('country_id'); 
            $table->enum('type', ['league', 'cup', 'supercup', 'international']);
            $table->integer('founded_year')->nullable();
            $table->integer('tier')->nullable();
            $table->string('img_src')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('country_id')
                ->references('id')->on('countries')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('competitions');
    }
};
