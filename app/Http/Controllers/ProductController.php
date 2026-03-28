<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function __construct()
    {
        // Authorize with policy
        $this->authorizeResource(Product::class);
    }

    // List products (paginated)
    public function index()
    {
        $products = Product::query()
            ->when(request('search'), function ($query) {
                $search = request('search');
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Products/Index', [
            'products' => $products,
            'search' => request('search'),
        ]);
    }

    // Create form
    public function create()
    {
        return Inertia::render('Products/Create');
    }

    // Store new product
    public function store(StoreProductRequest $request)
    {
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        Product::create([
            'name' => $request->name,
            'sku' => $request->sku,
            'cost' => $request->cost,
            'price' => $request->price,
            'stock_alert' => $request->stock_alert,
            'image_path' => $imagePath,
        ]);

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    // Edit form
    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product,
        ]);
    }

    // Update product
    public function update(UpdateProductRequest $request, Product $product)
    {
        $imagePath = $product->image_path;

        if ($request->hasFile('image')) {
            // Delete old image
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product->update([
            'name' => $request->name,
            'sku' => $request->sku,
            'cost' => $request->cost,
            'price' => $request->price,
            'stock_alert' => $request->stock_alert,
            'image_path' => $imagePath,
        ]);

        return redirect()->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    // Delete product
    public function destroy(Product $product)
    {
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}