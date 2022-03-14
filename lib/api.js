import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import markdownToHtml from "./markdownToHtml";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export async function getPostBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  if (!items.date) {
    const date = items.slug.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g);
    items.date = date[0];
  }

  items.excerpt = await markdownToHtml(content.split("\n")[1] || "");
  console.log(items.excerpt);

  return items;
}

export async function getAllPosts(fields = []) {
  const slugs = getPostSlugs();
  const posts = (
    await Promise.all(slugs.map((slug) => getPostBySlug(slug, fields)))
  )
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
