import PostEditor from "@/components/posts/editor/PostEditor";
import TrendSideBar from "@/components/TrendSideBar";
import ForYouFeed from "./components/ForYouFeed";

export default async function Home() {
  return (
    <main className="w-full flex min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed />
      </div>
      <TrendSideBar />
    </main>
  );
}
