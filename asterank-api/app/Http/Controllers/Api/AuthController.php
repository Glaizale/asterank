<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\PasswordResetMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'       => 'required|email',
            'password'    => 'required',
            'remember_me' => 'boolean',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Delete old tokens for this user to prevent token bloat
        $user->tokens()->delete();

        // Create token with expiration based on remember_me
        $tokenName = 'auth_token';
        $expiresAt = $request->remember_me ? now()->addDays(30) : now()->addHours(24);
        
        $token = $user->createToken($tokenName, ['*'], $expiresAt)->plainTextToken;

        return response()->json([
            'success'     => true,
            'user'        => $user,
            'token'       => $token,
            'remember_me' => $request->remember_me ?? false,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out',
        ]);
    }

    public function getUser(Request $request)
    {
        return response()->json([
            'success' => true,
            'user'    => $request->user(),
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        // Generate a 6-digit reset code
        $resetCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Store reset code in password_reset_tokens table
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($resetCode),
                'created_at' => now(),
            ]
        );

        // Send reset code via email
        try {
            Mail::to($request->email)->send(new PasswordResetMail($resetCode, $user->name));
            
            return response()->json([
                'success' => true,
                'message' => 'Password reset code sent to your email',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send email. Please try again later.',
                'error' => $e->getMessage(), // Remove in production
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Check if reset code exists and is valid (within 60 minutes)
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid reset code',
            ], 400);
        }

        // Check if code is expired (60 minutes)
        if (now()->diffInMinutes($resetRecord->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'success' => false,
                'message' => 'Reset code has expired',
            ], 400);
        }

        // Verify the reset code
        if (!Hash::check($request->code, $resetRecord->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid reset code',
            ], 400);
        }

        // Update user password
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete the reset token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password has been reset successfully',
        ]);
    }
}
