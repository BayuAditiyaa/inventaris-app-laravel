<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{

//anyone authenticated can view
public function viewAny(User $user): bool
{
    return true;
}

public function view(User $user, Product $product): bool
{
    return true;
}

// only admin can create
public function create(User $user): bool
{
    return $user->role === 'admin';
}

//only admin can update
public function update(User $user, Product $product): bool
{
    return $user->role === 'admin';
}

//only admin can delete
public function delete(User $user, Product $product): bool
{
    return $user->role === 'admin';
}


}
