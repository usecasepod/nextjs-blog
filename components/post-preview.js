import Avatar from "../components/avatar";
import DateFormatter from "../components/date-formatter";
import Link from "next/link";

export default function PostPreview({ title, date, excerpt, author, slug }) {
  return (
    <div>
      <h3 className="text-3xl mb-3 leading-snug">
        <Link href={`/posts/${slug}`}>
          <a className="hover:underline">{title}</a>
        </Link>
      </h3>
      <div className="text-lg mb-4">
        <DateFormatter dateString={date} />
      </div>
      <div
        className="text-lg leading-relaxed mb-4"
        dangerouslySetInnerHTML={{ __html: excerpt }}
      ></div>
      <Avatar name={author} />
    </div>
  );
}
