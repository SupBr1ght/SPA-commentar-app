import React, { useEffect, useState } from 'react';
import Comment from './Comment';

type SortField = 'name' | 'email' | 'date';
type SortOrder = 'asc' | 'desc';

export type CommentNode = {
  id: string;
  text: string;
  parentId: string | null;
  postId: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
  fileUrl?: string;
  fileType?: 'image' | 'text';
  replies: CommentNode[];
};

type Props = {
  postId: string;
};

const CommentTree: React.FC<Props> = ({ postId }) => {
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(
        `/post/${postId}/comments?sortBy=${sortBy}&order=${order}&page=${page}`
      );
      const data = await res.json();
      setComments(data);
    };
    fetchComments();
  }, [postId, sortBy, order, page]);

  const toggleOrder = () => setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));

  return (
    <div>
      <h2>Comments</h2>

      <table>
        <thead>
          <tr>
            <th>
              <button onClick={() => setSortBy('name')}>User Name</button>
            </th>
            <th>
              <button onClick={() => setSortBy('email')}>E-mail</button>
            </th>
            <th>
              <button onClick={() => setSortBy('date')}>Date</button>
            </th>
            <th>
              <button onClick={toggleOrder}>
                {order === 'asc' ? 'Asc' : ' Desc'}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {comments.map(comment => (
            <tr key={comment.id}>
              <td colSpan={4}>
                <Comment comment={comment} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </button>
        <span style={{ margin: '0 1rem' }}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default CommentTree;
