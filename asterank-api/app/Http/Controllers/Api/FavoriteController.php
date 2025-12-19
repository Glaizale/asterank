<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        $favorites = Favorite::where('user_id', $user->id)
            ->select(['id', 'asteroid_id', 'name', 'type', 'distance', 'value', 'notes', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $favorites,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        $validated = $request->validate([
            'asteroid_id' => 'required|string|max:255',
            'name'        => 'required|string|max:255',
            'type'        => 'nullable|string|max:255',
            'distance'    => 'nullable|string|max:255',
            'value'       => 'nullable|string|max:255',
            'notes'       => 'nullable|string',
        ]);

        $favorite = Favorite::updateOrCreate(
            [
                'user_id'     => $user->id,
                'asteroid_id' => $validated['asteroid_id'],
            ],
            [
                'name'     => $validated['name'],
                'type'     => $validated['type'] ?? null,
                'distance' => $validated['distance'] ?? null,
                'value'    => $validated['value'] ?? null,
                'notes'    => $validated['notes'] ?? null,
            ]
        );

        return response()->json([
            'success' => true,
            'data'    => $favorite,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        $favorite = Favorite::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        $favorite->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $favorite,
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        $favorite = Favorite::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        $favorite->delete();

        return response()->json([
            'success' => true,
            'message' => 'Favorite removed',
        ]);
    }

    // POST /api/favorites/{asteroid_id}/toggle
    public function toggle(Request $request, $asteroid_id)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        try {
            $existing = Favorite::where('user_id', $user->id)
                ->where('asteroid_id', $asteroid_id)
                ->first();

            // If favorite exists, delete (toggle off)
            if ($existing) {
                $existing->delete();

                return response()->json([
                    'success' => true,
                    'removed' => true,
                ]);
            }

            // Otherwise create (toggle on)
            $validated = $request->validate([
                'name'     => 'required|string|max:255',
                'type'     => 'nullable|string|max:255',
                'distance' => 'nullable|string|max:255',
                'value'    => 'nullable|string|max:255',
                'notes'    => 'nullable|string',
            ]);

            $favorite = Favorite::create([
                'user_id'     => $user->id,
                'asteroid_id' => $asteroid_id,
                'name'        => $validated['name'],
                'type'        => $validated['type'] ?? null,
                'distance'    => $validated['distance'] ?? null,
                'value'       => $validated['value'] ?? null,
                'notes'       => $validated['notes'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'removed' => false,
                'data'    => $favorite,
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // GET /api/favorites/{asteroid_id}/check
    public function check($asteroid_id)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        $exists = Favorite::where('user_id', $user->id)
            ->where('asteroid_id', $asteroid_id)
            ->exists();

        return response()->json([
            'success'     => true,
            'is_favorite' => $exists,
        ]);
    }
}
