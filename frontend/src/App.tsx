import React, { useState } from 'react';

export default function App() {
  // State for form fields
  const [text, setText] = useState('');
  const [postId, setPostId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Insert BBCode tag into the text
  const insertTag = (tag: string) => {
    const defaultContent = tag === 'a' ? 'link text' : '';
    const tagMarkup = `[${tag}]${defaultContent}[/${tag}]`;
    setText(prev => prev + tagMarkup);
  };

  // Handle form submission (send comment to backend)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!postId || !authorId || !text) {
      alert('Please fill all required fields');
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('text', text);
    formData.append('postId', postId);
    formData.append('authorId', authorId);
    if (file) formData.append('file', file);

    try {
      // Send POST request to the backend
      const res = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to submit comment');
      alert('Comment submitted!');

      // Reset form
      setText('');
      setFile(null);
    } catch (error) {
      alert(String(error));
    }
  };

  // Convert BBCode to HTML for preview
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
        {/* Post ID input */}
        <div>
          <label>Post ID:</label>
          <input
            type="text"
            value={postId}
            onChange={e => setPostId(e.target.value)}
            required
          />
        </div>

        {/* Author ID input */}
        <div>
          <label>Author ID:</label>
          <input
            type="text"
            value={authorId}
            onChange={e => setAuthorId(e.target.value)}
            required
          />
        </div>

        {/* Textarea for comment */}
        <div>
          <label>Text:</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
            required
          />
        </div>

        {/* Buttons to insert BBCode tags */}
        <div>
          <button type="button" onClick={() => insertTag('i')}>[i]</button>
          <button type="button" onClick={() => insertTag('strong')}>[strong]</button>
          <button type="button" onClick={() => insertTag('code')}>[code]</button>
          <button type="button" onClick={() => insertTag('a')}>[a]</button>
        </div>

        {/* File input */}
        <div>
          <label>File:</label>
          <input
            type="file"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Submit and preview buttons */}
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

      {/* Preview block */}
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
    </div>
  );
}
