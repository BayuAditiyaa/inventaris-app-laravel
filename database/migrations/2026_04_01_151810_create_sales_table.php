<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no')->unique();
            $table->foreignId('customer_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->constrained()->onDelete('restrict');
            $table->dateTime('sold_at');
            $table->bigInteger('subtotal'); // in IDR
            $table->bigInteger('discount')->default(0); // in IDR
            $table->bigInteger('total'); // in IDR
            $table->timestamps();

            $table->index('invoice_no');
            $table->index('user_id');
            $table->index('sold_at');
            $table->index('customer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};