<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $products = Product::all();

        return Inertia::render("product/index" , [
            "products" => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //

        // dd("k");

        $request->validate([
            "name" => "required",
            "price" => "required",
            "stock" => "required",
        ]);

        Product::create([
            "name" => $request->name,
            "price" => $request->price,
            "stock" => $request->stock,
        ]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //

        
        $request->validate([
            "name" => "required",
            "price" => "required",
            "stock" => "required",
        ]);

        $product->update([
            "name" => $request->name,
            "price" => $request->price,
            "stock" => $request->stock,
        ]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //


        $product->delete();

        return back();
    }
}
