import PostPreview from "./post-preview";
import Dropdown from "./dropdown";
import { PostData } from "../lib/api";
import { PostCategory } from "../lib/types";
import { useState } from "react";

interface PostListProps {
  posts: PostData[];
}

type PostCategoryOption = PostCategory | "Everything";

const categories: PostCategoryOption[] = [
  "Everything",
  PostCategory.Posts,
  PostCategory.Episodes,
];

export default function PostList({ posts }: PostListProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<PostCategoryOption>("Everything");
  return (
    <section className="py-4">
      <Dropdown
        selected={selectedCategory}
        items={categories}
        onSelected={setSelectedCategory}
        itemNameSelector={(item) => item.toString()}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
        {posts.map(
          (post) =>
            (selectedCategory === "Everything" ||
              post.categories.includes(selectedCategory)) && (
              <PostPreview
                key={post.slug}
                title={post.title}
                date={post.date}
                author={post.author}
                slug={post.slug}
                excerpt={post.excerpt}
              />
            )
        )}
      </div>
    </section>
  );
}
