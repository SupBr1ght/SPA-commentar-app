import React, { useState } from 'react';
import CommentForm from './CommentForm';
import type { CommentNode } from './CommentTree';

type Props = {
  comment: CommentNode;
};

const Comment: React.FC<Props> = ({ comment }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const toggleReply = () => setShowReplyForm(prev => !prev);

  return (
    <div style={{ marginLeft: comment.parentId ? 20 : 0, padding: '0.5rem 0' }}>
      <div style={{ border: '1px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}>
        <div>
          <strong>{comment.author?.name}</strong> ({comment.author?.email})
        </div>
        <div style={{ margin: '0.5rem 0' }}>{comment.text}</div>
        <div style={{ fontSize: '0.8rem', color: '#777' }}>
          {new Date(comment.createdAt).toLocaleString()}
        </div>

        {/* Optional file preview */}
        {comment.fileUrl && (
          <div style={{ marginTop: '0.5rem' }}>
            {comment.fileType === 'image' ? (
              <img
                src={comment.fileUrl}
                alt="Attached"
                style={{ maxWidth: '200px', borderRadius: '4px' }}
              />
            ) : comment.fileType === 'text' ? (
              <a href={comment.fileUrl} target="_blank" rel="noreferrer">
                View Text File
              </a>
            ) : null}
          </div>
        )}

        <button onClick={toggleReply} style={{ marginTop: '0.5rem' }}>
          {showReplyForm ? 'Cancel' : 'Reply'}
        </button>

        {showReplyForm && (
          <div style={{ marginTop: '0.5rem' }}>
            <CommentForm postId={comment.postId} parentId={comment.id} />
          </div>
        )}
      </div>

      {/* Recursive replies */}
      <div style={{ marginTop: '0.5rem' }}>
        {comment.replies.map(reply => (
          <Comment key={reply.id} comment={reply} />
        ))}
      </div>
    </div>
  );
};

export default Comment;
