<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostLike;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CommunityController extends Controller
{
    /**
     * Display the community page with posts
     */
    public function index()
    {
        $posts = Post::with(['user', 'likes'])
            ->active()
            ->latest()
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'author' => [
                        'name' => $post->user->name,
                        'avatarUrl' => 'https://i.pravatar.cc/150?u=' . $post->user->id,
                    ],
                    'timestamp' => $post->created_at->diffForHumans(),
                    'content' => $post->content,
                    'imageUrl' => $post->image_url,
                    'likes' => $post->likes_count,
                    'is_liked' => $post->isLikedBy(auth()->user()),
                    'comments' => $post->comments_count,
                    'category' => $post->category,
                ];
            });

        return Inertia::render('comunidad', [
            'posts' => $posts,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Store a new post
     */
    public function store(Request $request)
    {
        try {
            $this->authorize('create', Post::class);

            $request->validate([
                'content' => 'required|string|max:1000',
                'category' => 'required|in:Campaña,Noticia,Consejo,General',
                'image' => 'nullable|image|max:2048', // 2MB max
            ]);

            $imageUrl = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('posts', 'public');
                $imageUrl = Storage::url($imagePath);
            }

            $post = Post::create([
                'user_id' => Auth::id(),
                'content' => $request->content,
                'category' => $request->category,
                'image_url' => $imageUrl,
            ]);

            // Para requests AJAX, devolver JSON
            if ($request->wantsJson()) {
                $post->load('user');
                return response()->json([
                    'success' => true,
                    'message' => 'Publicación creada exitosamente',
                    'post' => [
                        'id' => $post->id,
                        'author' => [
                            'name' => $post->user->name,
                            'avatarUrl' => 'https://i.pravatar.cc/150?u=' . $post->user->id,
                        ],
                        'timestamp' => $post->created_at->diffForHumans(),
                        'content' => $post->content,
                        'imageUrl' => $post->image_url,
                        'likes' => $post->likes_count,
                        'is_liked' => $post->isLikedBy(auth()->user()),
                        'comments' => $post->comments_count,
                        'category' => $post->category,
                    ]
                ]);
            }

            // Para requests normales, redirigir
            return redirect()->route('comunidad')->with('success', 'Publicación creada exitosamente');
        } catch (\Illuminate\Validation\ValidationException $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Errores de validación',
                    'errors' => $e->errors()
                ], 422);
            }
            throw $e;
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para realizar esta acción'
                ], 403);
            }
            throw $e;
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error interno del servidor'
                ], 500);
            }
            throw $e;
        }
    }

    /**
     * Toggle like on a post
     */
    public function toggleLike(Post $post)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Debes iniciar sesión para dar like'], 401);
        }

        $existingLike = PostLike::where('post_id', $post->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingLike) {
            // Remove like
            $existingLike->delete();
            $liked = false;
        } else {
            // Add like
            PostLike::create([
                'post_id' => $post->id,
                'user_id' => $user->id,
            ]);
            $liked = true;
        }

        $likesCount = $post->likes()->count();

        // Para requests AJAX, devolver JSON
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'liked' => $liked,
                'likes_count' => $likesCount
            ]);
        }

        // Para requests normales, redirigir
        return redirect()->route('comunidad');
    }

    /**
     * Delete a post (only owner can delete)
     */
    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return redirect()->route('comunidad')->with('success', 'Publicación eliminada exitosamente');
    }

    /**
     * Store a comment on a post
     */
    public function storeComment(Request $request, Post $post)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Debes iniciar sesión para comentar'], 401);
        }

        $request->validate([
            'content' => 'required|string|max:500',
        ]);

        $comment = Comment::create([
            'post_id' => $post->id,
            'user_id' => $user->id,
            'content' => $request->content,
        ]);

        $comment->load('user');

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'comment' => [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'created_at' => $comment->created_at->diffForHumans(),
                    'user' => [
                        'name' => $comment->user->name,
                        'avatarUrl' => 'https://i.pravatar.cc/150?u=' . $comment->user->id,
                    ],
                ]
            ]);
        }

        return redirect()->route('comunidad');
    }

    /**
     * Get comments for a post
     */
    public function getComments(Post $post)
    {
        $comments = $post->comments()
            ->with('user')
            ->latest()
            ->get()
            ->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'created_at' => $comment->created_at->diffForHumans(),
                    'user' => [
                        'name' => $comment->user->name,
                        'avatarUrl' => 'https://i.pravatar.cc/150?u=' . $comment->user->id,
                    ],
                ];
            });

        return response()->json(['comments' => $comments]);
    }
}
