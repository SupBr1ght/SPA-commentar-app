import React, { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import type { CommentNode } from './pages/CommentTree';

export default function App() {
  const [text, setText] = useState('');
  const [postId, setPostId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [comments, setComments] = useState<CommentNode[]>([]);


  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const captchaRef = useRef<ReCAPTCHA>(null);

  // Upload commntars
  useEffect(() => {
    if (!postId) {
      setComments([]);
      return;
    }
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://${process.env.VITE_API_URL}/comments/post/${postId}/comments`);
        if (!res.ok) throw new Error('Failed to fetch comments');
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchComments();
  }, [postId]);

  const insertTag = (tag: string) => {
    const defaultContent = tag === 'a' ? 'link text' : '';
    const tagMarkup = `[${tag}]${defaultContent}[/${tag}]`;
    setText(prev => prev + tagMarkup);
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!postId.trim() || !authorId.trim() || !text.trim()) {
      alert('Please fill all required fields');
      return;
    }

    try {
      // Get free token after sending
      const freshToken = await captchaRef.current?.executeAsync();
      captchaRef.current?.reset();

      if (!freshToken) {
        alert('Please complete the CAPTCHA');
        return;
      }

      const formData = new FormData();
      formData.append('text', text);
      formData.append('postId', postId);
      formData.append('authorId', authorId);
      if (file) formData.append('file', file);
      formData.append('captchaToken', freshToken);

      const res = await fetch(`http://${process.env.VITE_API_URL}/comments`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || 'Failed to submit comment');

      alert('Comment submitted!');
      setText('');
      setFile(null);

      fetchComments(postId);
    } catch (error) {
      alert(String(error));
    }
  };


 
  const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!replyText.trim()) {
      alert('Reply cannot be empty');
      return;
    }

    if (!replyingTo) {
      alert('No comment selected for reply');
      return;
    }

    try {
      const res = await fetch(`http://${process.env.VITE_API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: replyText,
          postId,
          authorId: authorId,
          parentId: replyingTo
        }),
      });

      if (!res.ok) throw new Error('Failed to submit reply');
      alert('Reply submitted!');

      setReplyText('');
      setReplyingTo(null);

      fetchComments(postId);
    } catch (error) {
      alert(String(error));
    }
  };

  // Update comments
  const fetchComments = async (postId: string) => {
    try {
      const res = await fetch(`http://${process.env.VITE_API_URL}/comments/post/${postId}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  // BBCode to HTML
  const renderTextWithTags = (input: string) => {
    return input
      .replace(/\[strong\](.*?)\[\/strong\]/g, '<strong>$1</strong>')
      .replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>')
      .replace(/\[code\](.*?)\[\/code\]/g, '<code>$1</code>')
      .replace(/\[a\](.*?)\[\/a\]/g, '<a href="#">$1</a>');
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Create Comment</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Post ID:</label>
          <input
            type="text"
            value={postId}
            onChange={e => setPostId(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Author ID:</label>
          <input
            type="text"
            value={authorId}
            onChange={e => setAuthorId(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Text:</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
            required
          />
        </div>

        <div>
          <button type="button" onClick={() => insertTag('i')}>[i]</button>
          <button type="button" onClick={() => insertTag('strong')}>[strong]</button>
          <button type="button" onClick={() => insertTag('code')}>[code]</button>
          <button type="button" onClick={() => insertTag('a')}>[a]</button>
        </div>

        <div>
          <label>File:</label>
          <input
            type="file"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div style={{ margin: '20px 0' }}>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
            size="invisible" // to launch executeAsync()
            ref={captchaRef}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <button type="submit">Submit</button>
          <button
            type="button"
            onClick={() => setShowPreview(p => !p)}
            style={{ marginLeft: 10 }}
          >
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
        </div>
      </form>

      {showPreview && (
        <div
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginTop: '10px',
          }}
          dangerouslySetInnerHTML={{ __html: renderTextWithTags(text) }}
        />
      )}

      <hr style={{ margin: '20px 0' }} />

      <h2>Comments</h2>

      {comments.length === 0 && <p>No comments yet</p>}

      {comments.map(comment => (
        <div key={comment.id} style={{ marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
          <p><strong>{comment.author.name}</strong>: {comment.text}</p>
          {comment.fileUrl && comment.fileType?.startsWith('image/') ? (
            <img src={comment.fileUrl} alt="Comment image" style={{ maxWidth: '100%', borderRadius: 8 }} />
          ) : (
            <a href={comment.fileUrl} target="_blank" rel="noopener noreferrer">
              {comment.fileUrl || 'Download file'}
            </a>
          )}

          <button onClick={() => setReplyingTo(comment.id)}>Reply</button>

          {replyingTo === comment.id && (
            <form onSubmit={handleReplySubmit} style={{ marginTop: 10 }}>
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Your reply..."
                style={{ width: '70%', marginRight: 10 }}
              />
              <button type="submit">Send</button>
              <button
                type="button"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText('');
                }}
                style={{ marginLeft: 10 }}
              >
                Cancel
              </button>
            </form>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div style={{ marginLeft: 20, marginTop: 10 }}>
              {comment.replies.map(child => (
                <div key={child.id} style={{ marginBottom: 8 }}>
                  <p><strong>{child.author.name}</strong>: {child.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
