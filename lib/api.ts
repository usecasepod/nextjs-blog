import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import markdownToHtml from "./markdownToHtml";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export interface RawBlogPostData {
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
  title: string;
}

export type BlogPostFields = keyof RawBlogPostData;

export async function getPostBySlug<TFields extends BlogPostFields>(
  slug: string,
  fields: TFields[]
): Promise<{ [key in TFields]: RawBlogPostData[key] }> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const post = data as RawBlogPostData;
  if (post === null) {
    throw new Error("Post not found");
  }

  // Ensure only the minimal needed data is exposed
  const values = await Promise.all(
    fields.map(async (field) => {
      if (field === "slug") {
        return [field, realSlug];
      }

      if (field === "content") {
        return [field, content];
      }

      if (field === "date") {
        const date = realSlug.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g);
        return [field, date[0]];
      }

      if (field === "excerpt") {
        const excerpt = await markdownToHtml(content.split("\n")[1] || "");
        return [field, excerpt];
      }

      return [field, data[field] ?? ""];
    })
  );

  return Object.fromEntries(values);
}

export async function getAllPosts<TFields extends BlogPostFields>(
  fields: TFields[] = []
) {
  const slugs = getPostSlugs();
  const posts = (
    await Promise.all(
      slugs.map((slug) => getPostBySlug(slug, ["date", ...fields]))
    )
  )
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
