import Link from "next/link";
import { PostCategory } from "../lib/types";

interface HeaderProps {
  categories: PostCategory[];
}

export default function Header({ categories }: HeaderProps) {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
      <Link href="/">
        <a className="hover:underline">{categories.join(", ")}</a>
      </Link>
      .
    </h2>
  );
}
