import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import markdownToHtml from "./markdownToHtml";
import { PostCategory } from "./types";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export interface PostData {
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  author: string;
  title: string;
  categories: PostCategory[];
}

export type BlogPostFields = keyof PostData;

export async function getPostBySlug<TFields extends BlogPostFields>(
  slug: string,
  fields: TFields[]
): Promise<{ [key in TFields]: PostData[key] }> {
  const slugFileLookup = fs
    .readdirSync(postsDirectory)
    .map((f) => ({ fileName: f, slug: getCleanSlug(f) }));

  const realSlug = getCleanSlug(slug);
  const fileName = slugFileLookup.find((f) => f.slug === realSlug)?.fileName;
  const fullPath = join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const post = data as PostData;
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

      return [field, post[field]];
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

function getCleanSlug(slug: string) {
  return slug.replace(/\.md$/, "").replace("#", "");
}
