<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('po_number')->unique();
            $table->foreignId('supplier_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->string('status')->default('ordered');
            $table->date('ordered_at');
            $table->date('expected_at')->nullable();
            $table->dateTime('received_at')->nullable();
            $table->bigInteger('total_amount')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('ordered_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
