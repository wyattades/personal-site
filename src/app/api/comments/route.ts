import { createClient } from "@libsql/client";
import { NextResponse } from "next/server";

let client: ReturnType<typeof createClient> | null = null;

const getClient = () => {
  if (client) return client;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");

  client = createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  return client;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleSlug = searchParams.get("article_slug");

    if (!articleSlug) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 },
      );
    }

    const result = await getClient().execute({
      sql: "SELECT * FROM comments WHERE article_slug = ? ORDER BY created_at DESC",
      args: [articleSlug],
    });

    return NextResponse.json({ comments: result.rows });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { article_slug, content, author } = body;

    if (!article_slug || !content.trim()) {
      return NextResponse.json(
        { error: "article_slug and content are required" },
        { status: 400 },
      );
    }

    const result = await getClient().execute({
      sql: "INSERT INTO comments (article_slug, content, author) VALUES (?, ?, ?) RETURNING *",
      args: [article_slug, content, author || null],
    });

    return NextResponse.json({ comment: result.rows[0] });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
