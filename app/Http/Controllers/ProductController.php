<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Services\ActivityLogService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;

class ProductController extends Controller
{
    public function __construct(protected ActivityLogService $activityLogService)
    {
    }


    // List products (paginated)
    public function index()
    {
        Gate::authorize('viewAny', Product::class);
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
        Gate::authorize('create', Product::class);

        return Inertia::render('Products/Create');
    }

    // Store new product
    public function store(StoreProductRequest $request)
    {
        Gate::authorize('create', Product::class);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product = Product::create([
            'name' => $request->name,
            'sku' => $request->sku,
            'cost' => (int)$request->cost,
            'price' => (int)$request->price,
            'stock_alert' => $request->stock_alert,
            'image_path' => $imagePath,
        ]);

        $this->activityLogService->log(
            'product.created',
            "Created product {$product->name}",
            $product,
            ['sku' => $product->sku, 'price' => $product->price]
        );

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    // Edit form
    public function edit(Product $product)
    {
        Gate::authorize('update', $product);
        return Inertia::render('Products/Edit', [
            'product' => $product,
        ]);
    }

    // Update product
    public function update(UpdateProductRequest $request, Product $product)
    {
        Gate::authorize('update', $product);

        $imagePath = $product->image_path;

        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product->update([
            'name' => $request->name,
            'sku' => $request->sku,
            'cost' => (int)$request->cost,
            'price' => (int)$request->price,
            'stock_alert' => $request->stock_alert,
            'image_path' => $imagePath,
        ]);

        $this->activityLogService->log(
            'product.updated',
            "Updated product {$product->name}",
            $product,
            ['sku' => $product->sku, 'price' => $product->price]
        );

        return redirect()->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    // Delete product
    public function destroy(Product $product)
    {
        Gate::authorize('delete', $product);

        $productName = $product->name;
        $productSku = $product->sku;

        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();

        $this->activityLogService->log(
            'product.deleted',
            "Deleted product {$productName}",
            null,
            ['sku' => $productSku, 'product_name' => $productName]
        );

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
