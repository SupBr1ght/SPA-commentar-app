import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function App() {
  // Стани форми
  const [text, setText] = useState('');
  const [postId, setPostId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Стейт для зберігання капча токена
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  // Вставка BBCode тега
  const insertTag = (tag: string) => {
    const defaultContent = tag === 'a' ? 'link text' : '';
    const tagMarkup = `[${tag}]${defaultContent}[/${tag}]`;
    setText(prev => prev + tagMarkup);
  };

  // Хендлер зміни капчі
  const onCaptchaChange = (value: string | null) => {
    console.log("Captcha value:", value);
    setCaptchaValue(value);
  };

  // Відправка форми
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валідація обов’язкових полів
    if (!postId || !authorId || !text) {
      alert('Please fill all required fields');
      return;
    }

    // Валідація капчі
    if (!captchaValue) {
      alert('Please complete the CAPTCHA');
      return;
    }

    // Формуємо FormData для відправки
    const formData = new FormData();
    formData.append('text', text);
    formData.append('postId', postId);
    formData.append('authorId', authorId);
    if (file) formData.append('file', file);

    // Важливо: додаємо токен капчі, щоб бекенд міг верифікувати
    formData.append('captchaToken', captchaValue);

    try {
      const res = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to submit comment');
      alert('Comment submitted!');

      // Скидаємо стани після успішної відправки
      setText('');
      setFile(null);
      setCaptchaValue(null);
      // Якщо треба, ресетимо капчу
      if (captchaRef.current) captchaRef.current.reset();

    } catch (error) {
      alert(String(error));
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

  // Реф для рекапчі, щоб можна було ресетнути
  const captchaRef = React.useRef<ReCAPTCHA>(null);

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

        {/* Тут вставляємо reCAPTCHA */}
        <div style={{ margin: '20px 0' }}>
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY!} // Передбачає, що ключ лежить в .env
            onChange={onCaptchaChange}
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
    </div>
  );
}
