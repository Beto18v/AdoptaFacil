<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('shared_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('posts')->onDelete('cascade');
            $table->string('token', 32)->unique();
            $table->timestamp('expires_at');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('shared_links');
    }
};
