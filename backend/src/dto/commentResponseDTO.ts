export class CommentResponseDTO {
  id: string;
  content: string;
  createdAt: Date;

  user: {
    id: string;
    name: string;
    email: string;
  };

  replies?: CommentResponseDTO[]; // nested commentars
}
