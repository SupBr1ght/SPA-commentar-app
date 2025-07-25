// src/App.tsx
import React, { useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  const [postId, setPostId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  const insertTag = (tag: string) => {
    let content = '';

    // If insert a tag add default text
    if (tag === 'a') {
      content = 'link text';
    }

    // create tag: наприклад, [strong]текст[/strong]
    const tagText = `[${tag}]${content}[/${tag}]`;

    // add tag to current text
    setText(prevText => prevText + tagText);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId || !authorId || !text) {
      alert('Please fill all required fields');
      return;
    }
    const formData = new FormData();
    formData.append('text', text);
    formData.append('postId', postId);
    formData.append('authorId', authorId);
    if (file) formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to submit comment');
      alert('Comment submitted!');
      setText('');
      setFile(null);
      setPreview('');
    } catch (error) {
      alert(String(error));
    }
  };

  const handlePreview = () => {
    // display text 
    setPreview(text);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Create Comment</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Post ID:</label><br />
          <input type="text" value={postId} onChange={e => setPostId(e.target.value)} required />
        </div>
        <div>
          <label>Author ID:</label><br />
          <input type="text" value={authorId} onChange={e => setAuthorId(e.target.value)} required />
        </div>
        <div>
          <label>Text:</label><br />
          <textarea value={text} onChange={e => setText(e.target.value)} rows={5} required />
        </div>
        <div>
          <button type="button" onClick={() => insertTag('i')}>[i]</button>
          <button type="button" onClick={() => insertTag('strong')}>[strong]</button>
          <button type="button" onClick={() => insertTag('code')}>[code]</button>
          <button type="button" onClick={() => insertTag('a')}>[a]</button>
        </div>
        <div>
          <label>File:</label><br />
          <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="submit">Submit</button>
          <button type="button" onClick={handlePreview} style={{ marginLeft: 10 }}>Preview</button>
        </div>
      </form>

      {preview && (
        <div style={{ marginTop: 20, padding: 10, border: '1px solid #ccc' }}>
          <h3>Preview</h3>
          <pre>{preview}</pre>
        </div>
      )}
    </div>
  );
}
