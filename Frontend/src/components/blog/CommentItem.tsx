import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import AddComment from './AddComment';
import { Comment } from '@/types/comment.types';
import axios from 'axios';

export default function CommentItem({
  comment,
  articleId,
  fetchComments,
  level = 0,
}: {
  comment: Comment;
  articleId: number;
  fetchComments: () => void;
  level?: number;
}) {
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const REACTIONS = [
    { emoji: '👍', label: "J'aime" },
    { emoji: '❤️', label: 'J’adore' },
    { emoji: '😂', label: 'Drôle' },
    { emoji: '😮', label: 'Surpris' },
    { emoji: '😢', label: 'Triste' },
  ];

  const formatRelativeDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 1000 / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMin < 1) return 'À l’instant';
    if (diffHrs < 1) return `${diffMin} min`;
    if (diffDays < 1) return `${diffHrs} h`;
    if (diffDays < 7) return `${diffDays} j`;

    return date.toLocaleDateString('fr-FR');
  };

  const replies = comment.replies || [];
  const hasMultipleReplies = replies.length > 1;
  const visibleReplies = showAllReplies ? replies : replies.slice(-1);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>(comment.reaction_counts || {});

  const handleReaction = async (emoji: string) => {
    try {
      const isRemoving = selectedReaction === emoji;
  
      await axios.post(`/api/comments/${comment.id}/reaction`, {
        reaction: isRemoving ? null : emoji,
      });
  
      // ✅ Mettre à jour localement le compteur sans fetch
      setSelectedReaction(isRemoving ? null : emoji);
  
      setReactionCounts((prev) => {
        const updated = { ...prev };
  
        if (isRemoving) {
          if (updated[emoji]) {
            updated[emoji]--;
            if (updated[emoji] === 0) {
              delete updated[emoji];
            }
          }
        } else {
          updated[emoji] = (updated[emoji] || 0) + 1;
        }
  
        return updated;
      });
  
      setShowReactions(false);
    } catch (err) {
      console.error('Erreur en ajoutant la réaction :', err);
    }
  };
  
  
  
  return (
    <div style={{ marginLeft: level * 24 }} className="mb-4">
      <Card className="p-4">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback>{comment.first_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <h4 className="font-medium text-sm">
                {comment.first_name} {comment.last_name}
              </h4>
              <span className="text-xs text-gray-500">
                {formatRelativeDate(comment.created_at)}
              </span>
            </div>
            <p className="text-sm mt-1">{comment.content}</p>

            {/* 🔁 Like + Reply */}
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
              {/* 👍 Réaction */}
              <div className="relative">
                <div
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setShowReactions(!showReactions)}
                >
                  <span className="text-lg">{selectedReaction || '👍'}</span>
                  <span className="font-medium">
                    {selectedReaction ? "J'ai aimé" : "J'aime"}
                  </span>
                </div>

                {showReactions && (
                  <div className="absolute z-50 mt-2 left-0 flex bg-white border rounded-md shadow p-2 gap-2">
                   {REACTIONS.map((reaction) => (
  <button
    key={reaction.label}
    onClick={() => handleReaction(reaction.emoji)}
    title={reaction.label}
    className="text-xl hover:scale-125 transition-transform duration-150"
  >
    {reaction.emoji}
  </button>
))}


                  </div>
                )}
              </div>

              {/* 💬 Répondre */}
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              >
                <MessageSquare size={16} />
                <span className="font-medium">Répondre</span>
              </div>
            </div>

            {/* 📝 Formulaire de réponse */}
            {replyTo === comment.id && (
              <div className="mt-4">
                <AddComment
                  articleId={articleId}
                  parentId={comment.id}
                  onCommentAdded={() => {
                    fetchComments();
                    setReplyTo(null);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
{/* Réactions affichées */}
{Object.keys(reactionCounts).length > 0 && (
  <div className="flex items-center gap-2 mt-2">
    {Object.entries(reactionCounts).map(([emoji, count]) => (
      <div key={emoji} className="flex items-center text-sm bg-gray-100 rounded-full px-2 py-1">
        <span className="text-lg">{emoji}</span>
        <span className="ml-1">{count}</span>
      </div>
    ))}
  </div>
)}


      {/* ↪️ Réponses imbriquées */}
      {visibleReplies.length > 0 && (
        <div className="mt-4 space-y-4">
          {visibleReplies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              articleId={articleId}
              fetchComments={fetchComments}
              level={level + 1}
            />
          ))}

          {/* ⬇️ Voir plus / Réduire */}
          {hasMultipleReplies && (
            <button
              className="ml-6 mt-1 text-sm text-gray-500 hover:text-black transition-colors"
              onClick={() => setShowAllReplies(!showAllReplies)}
            >
              {showAllReplies
                ? 'Réduire les réponses'
                : `Voir plus de réponses (${replies.length - 1})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
