import { useToast } from "@/components/ui/use-toast";
import { UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./action";
import { postPage } from "@/lib/types";

export function useUpdateProfileMutation() {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ values }: { values: UpdateUserProfileValues }) => {
      return Promise.all([updateUserProfile(values)]);
    },
    onSuccess: async ([updateUser]) => {
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<postPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) {
            return;
          }
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updateUser.id) {
                  return post;
                }
                return post;
              }),
            })),
          };
        }
      );
      router.refresh();
      toast({
        description: "Profile Updated",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Could Not Update Profile",
      });
    },
  });
  return mutation;
}
