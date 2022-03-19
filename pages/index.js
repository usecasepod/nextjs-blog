import Container from "../components/container";
import PostList from "../components/post-list";
import Menu from "../components/menu";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import Head from "next/head";

export default function Index({ allPosts }) {
  return (
    <>
      <Layout>
        <Head>
          <title>Home of the Use Case Podcast with Austin and Clinton</title>
        </Head>
        <Menu />
        <Container>
          <PostList posts={allPosts} />
        </Container>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const allPosts = await getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "excerpt",
  ]);

  return {
    props: { allPosts },
  };
}
