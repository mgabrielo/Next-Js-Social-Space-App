import { validateRequest } from "@/auth";
import Post from "@/components/posts/Post";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense, cache } from "react";
import UserInfoSidebar from "../../components/UserInfoSideBar";

interface PageProps {
  params: {
    postId: string;
  };
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) notFound();

  return post;
});

export async function generateMetadata({ params: { postId } }: PageProps) {
  const { user } = await validateRequest();

  if (!user) return {};

  const post = await getPost(postId, user.id);

  return {
    title: `${post.user.displayName} : ${post.content.slice(0, 50)}...`,
  };
}

export default async function Page({ params: { postId } }: PageProps) {
  const { user } = await validateRequest();

  if (!user) {
    return (
      <p className="text-destructive">
        {" "}
        You are not Authorized to view this page !!
      </p>
    );
  }

  const post = await getPost(postId, user.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden lg:block w-80 h-fit flex-none">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          {user && <UserInfoSidebar user={post.user} loggedInUser={user} />}
        </Suspense>
      </div>
    </main>
  );
}
