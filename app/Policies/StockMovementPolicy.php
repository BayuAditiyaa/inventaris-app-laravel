<?php

namespace App\Policies;

use App\Models\StockMovement;
use App\Models\User;

class StockMovementPolicy
{
    /**
     * Determine if the user can view any stock movements
     */
    public function viewAny(User $user): bool
    {
        return true; // Everyone can view movements
    }

    /**
     * Determine if the user can view the stock movement
     */
    public function view(User $user, StockMovement $movement): bool
    {
        return true; // Everyone can view individual movement
    }

    /**
     * Determine if the user can create stock movements
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine if the user can update the stock movement
     */
    public function update(User $user, StockMovement $movement): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine if the user can delete the stock movement
     */
    public function delete(User $user, StockMovement $movement): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine if the user can restore the stock movement
     */
    public function restore(User $user, StockMovement $movement): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine if the user can permanently delete the stock movement
     */
    public function forceDelete(User $user, StockMovement $movement): bool
    {
        return $user->role === 'admin';
    }
}