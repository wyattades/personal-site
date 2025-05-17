import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trackEvent } from "~/lib/tracking";

type Comment = {
  id: number;
  content: string;
  author: string;
  created_at: string;
};

const CommentForm: React.FC<{
  onSubmit: (params: { content: string; author: string }) => Promise<unknown>;
}> = ({ onSubmit }) => {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = !!content.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ content, author });
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          style={{
            display: "block",
            width: "100%",
            padding: "8px 16px",
            boxSizing: "border-box",
            border: "2px solid var(--text-color)",
            background: "var(--bg-color)",
            color: "var(--text-color)",
            fontSize: "14px",
            lineHeight: "24px",
          }}
        />
      </div>
      <div style={{ position: "relative" }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          style={{
            display: "block",
            width: "100%",
            padding: "8px 16px",
            boxSizing: "border-box",
            border: "2px solid var(--text-color)",
            background: "var(--bg-color)",
            color: "var(--text-color)",
            fontSize: "14px",
            lineHeight: "24px",
            minHeight: "80px",
            resize: "vertical",
          }}
        />
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="plain-button"
          style={{
            position: "absolute",
            right: "8px",
            bottom: "8px",
          }}
        >
          <Send size={20} /> Send
        </button>
      </div>
    </form>
  );
};

const fetchComments = async (articleSlug: string) => {
  const response = await fetch(`/api/comments?article_slug=${articleSlug}`);
  const data = (await response.json()) as {
    comments?: Comment[];
    error?: string;
  };
  if (!response.ok || !data.comments)
    throw new Error(data.error || "Failed to load comments");
  return data.comments;
};

const createComment = async (params: {
  article_slug: string;
  content: string;
  author: string;
}) => {
  trackEvent("Create Blog Comment", {
    ...params,
  });

  const response = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = (await response.json()) as Comment;
  if (!response.ok) throw new Error("Failed to create comment");
  return data;
};

export const BlogComments: React.FC<{
  label: React.ReactNode;
  title: React.ReactNode;
}> = ({ label, title }) => {
  const articleSlug = useRouter().pathname.split("/").pop()!;

  const {
    data: comments,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["blogComments", articleSlug],
    queryFn: () => fetchComments(articleSlug),
  });

  const handleSubmitComment = async (params: {
    content: string;
    author: string;
  }) => {
    const comment = await createComment({
      article_slug: articleSlug,
      ...params,
    });
    await refetch();
    return comment;
  };

  return (
    <div style={{ marginTop: "32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <MessageCircle />
        <h2 style={{ margin: 0 }}>{label}</h2>
      </div>
      {title && (
        <p style={{ color: "var(--help-text-color)", marginBottom: "24px" }}>
          {title}
        </p>
      )}

      <CommentForm onSubmit={handleSubmitComment} />

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          Loading comments...
        </div>
      ) : error ? (
        <div style={{ color: "var(--error-color)", padding: "16px 0" }}>
          {error.message}
        </div>
      ) : comments?.length === 0 ? (
        <div
          style={{
            color: "var(--help-text-color)",
            textAlign: "center",
            padding: "16px 0",
          }}
        >
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {comments?.map((comment) => (
            <div
              key={comment.id}
              style={{
                background: "var(--offset-color)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  {comment.author || "Anonymous"}
                </span>
                <span
                  style={{ fontSize: "14px", color: "var(--help-text-color)" }}
                >
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p style={{ margin: 0 }}>{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
