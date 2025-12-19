<?php

namespace App\Http\Controllers;

use App\Models\UserFavorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserFavoriteController extends Controller
{
    // GET /api/favorites
    public function index()
    {
        $user = Auth::user();

        $favorites = UserFavorite::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($favorites);
    }

    // POST /api/favorites
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'asteroid_id'   => 'required|string|max:255',
            'asteroid_name' => 'required|string|max:255',
            'note'          => 'nullable|string',
            'rating'        => 'nullable|integer|min:1|max:5',
        ]);

        $favorite = UserFavorite::updateOrCreate(
            [
                'user_id'     => $user->id,
                'asteroid_id' => $validated['asteroid_id'],
            ],
            [
                'asteroid_name' => $validated['asteroid_name'],
                'note'          => $validated['note'] ?? null,
                'rating'        => $validated['rating'] ?? null,
            ]
        );

        return response()->json($favorite, 201);
    }

    // PUT /api/favorites/{id}
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        $favorite = UserFavorite::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'note'   => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);

        $favorite->update($validated);

        return response()->json($favorite);
    }

    // DELETE /api/favorites/{id}
    public function destroy($id)
    {
        $user = Auth::user();

        $favorite = UserFavorite::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        $favorite->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
