import PostEditor from "@/components/posts/editor/PostEditor";
import TrendSideBar from "@/components/TrendSideBar";
import ForYouFeed from "./components/ForYouFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./components/FollowingFeed";

export default async function Home() {
  return (
    <main className="w-full flex min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For You</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      {/* @ts-ignore */}
      <TrendSideBar />
    </main>
  );
}
