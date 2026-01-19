import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MessageCircle, Heart, Send, Users, TrendingUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

function PostWithComments({ 
  post, user, formatTime, getCategoryColor, likePostMutation, 
  expandedComments, toggleComments, commentText, setCommentText, 
  handleAddComment, addCommentMutation 
}) {
  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => base44.entities.Comment.filter({ post_id: post.id }, '-created_date'),
    enabled: !!expandedComments[post.id],
  });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                {post.author_name?.[0] || 'T'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white">{post.author_name}</span>
                <Badge className={`${getCategoryColor(post.category)} border text-xs`}>
                  {post.category}
                </Badge>
                <span className="text-xs text-slate-500">{formatTime(post.created_date)}</span>
              </div>
              <p className="text-slate-300 whitespace-pre-wrap mb-4">{post.content}</p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => likePostMutation.mutate(post)}
                  className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors"
                  disabled={!user}
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{post.likes_count || 0}</span>
                </button>
                <button 
                  className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
                  onClick={() => toggleComments(post.id)}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{post.comments_count || 0}</span>
                </button>
              </div>

              {/* Comments Section */}
              {expandedComments[post.id] && (
                <div className="mt-4 space-y-3 pt-4 border-t border-slate-700">
                  {loadingComments ? (
                    <p className="text-slate-400 text-sm">Loading comments...</p>
                  ) : (
                    <>
                      {comments?.map(comment => (
                        <div key={comment.id} className="flex items-start gap-2 pl-2">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className="bg-slate-700 text-slate-400 text-xs">
                              {comment.author_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-medium text-white text-sm">
                                {comment.author_name || 'Anonymous'}
                              </p>
                              <span className="text-slate-500 text-xs">
                                {formatTime(comment.created_date)}
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                      
                      {user && (
                        <div className="flex gap-2 pl-2 mt-3">
                          <Input
                            placeholder="Write a comment..."
                            value={commentText[post.id] || ''}
                            onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                            className="bg-slate-800 border-slate-700 text-white"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddComment(post.id)}
                            disabled={addCommentMutation.isPending}
                            className="bg-emerald-500 hover:bg-emerald-600"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Community() {
  const [user, setUser] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [category, setCategory] = useState('general');
  const [expandedComments, setExpandedComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {}
  };

  // Fetch posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['community-posts'],
    queryFn: () => base44.entities.CommunityPost.list('-created_date', 20),
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!newPost.trim()) return;
      await base44.entities.CommunityPost.create({
        author_email: user.email,
        author_name: user.full_name || user.email.split('@')[0],
        content: newPost,
        category: category,
        likes_count: 0,
        comments_count: 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['community-posts']);
      setNewPost('');
      toast.success('Post shared!');
    },
    onError: () => {
      toast.error('Failed to post');
    }
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: async (post) => {
      await base44.entities.CommunityPost.update(post.id, {
        likes_count: (post.likes_count || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['community-posts']);
    }
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ postId, content }) => {
      const comment = await base44.entities.Comment.create({
        post_id: postId,
        author_email: user.email,
        author_name: user.full_name || user.email.split('@')[0],
        content
      });
      
      const post = posts.find(p => p.id === postId);
      await base44.entities.CommunityPost.update(postId, {
        comments_count: (post.comments_count || 0) + 1
      });
      
      return comment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['community-posts']);
      queryClient.invalidateQueries(['comments', variables.postId]);
      setCommentText(prev => ({ ...prev, [variables.postId]: '' }));
      toast.success('Comment added');
    }
  });

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'strategy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'analysis': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'question': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diff = Math.floor((now - posted) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleAddComment = (postId) => {
    const content = commentText[postId]?.trim();
    if (!content) {
      toast.error('Please enter a comment');
      return;
    }
    addCommentMutation.mutate({ postId, content });
  };

  // Calculate dynamic stats
  const uniqueMembers = new Set(posts?.map(p => p.author_email) || []).size;
  const totalLikes = posts?.reduce((sum, p) => sum + (p.likes_count || 0), 0) || 0;
  const totalPosts = posts?.length || 0;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-4">
              <Users className="w-4 h-4 text-violet-400" />
              <span className="text-violet-400 text-sm font-medium">Community Zone</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Trader Community</h1>
            <p className="text-slate-400">
              Connect with traders, share strategies, and learn from the community.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{uniqueMembers}</p>
              <p className="text-xs text-slate-400">Active Members</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{totalPosts}</p>
              <p className="text-xs text-slate-400">Total Posts</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{totalLikes}</p>
              <p className="text-xs text-slate-400">Total Likes</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Post */}
        {user && (
          <Card className="bg-slate-900 border-slate-800 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                    {user.full_name?.[0] || user.email?.[0] || 'T'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Share your thoughts, strategies, or questions..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white resize-none"
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="strategy">Strategy</SelectItem>
                        <SelectItem value="analysis">Analysis</SelectItem>
                        <SelectItem value="question">Question</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={() => createPostMutation.mutate()}
                      disabled={!newPost.trim() || createPostMutation.isPending}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      {createPostMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Post
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Feed */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-700 rounded-full" />
                      <div className="h-4 bg-slate-700 rounded w-24" />
                    </div>
                    <div className="h-4 bg-slate-700 rounded w-full" />
                    <div className="h-4 bg-slate-700 rounded w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts?.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400">No posts yet</p>
              <p className="text-sm text-slate-500">Be the first to share!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts?.map((post, index) => (
              <PostWithComments 
                key={post.id}
                post={post}
                user={user}
                formatTime={formatTime}
                getCategoryColor={getCategoryColor}
                likePostMutation={likePostMutation}
                expandedComments={expandedComments}
                toggleComments={toggleComments}
                commentText={commentText}
                setCommentText={setCommentText}
                handleAddComment={handleAddComment}
                addCommentMutation={addCommentMutation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}