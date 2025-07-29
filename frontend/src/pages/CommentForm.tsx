import React, { useState } from 'react';

// Harcode author Id vithout authentification and authorization
const HARDCODED_AUTHOR_ID = (document.querySelector('meta[name="user-id"]') as HTMLMetaElement)?.content || 'mock-user-id';

type Props = {
  postId: string;
  parentId?: string;
};

const CommentForm: React.FC<Props> = ({ postId, parentId }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('text', text);
    formData.append('postId', postId);
    formData.append('authorId', HARDCODED_AUTHOR_ID);
    if (parentId) formData.append('parentId', parentId);
    if (file) formData.append('file', file);

    try {
      const res = await fetch('/comments', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to send comment');
      }

      setText('');
      setFile(null);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write a comment..."
        required
        style={{ resize: 'vertical', minHeight: '60px' }}
      />

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp,.txt"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default CommentForm;
