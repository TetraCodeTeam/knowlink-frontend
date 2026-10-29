import { httpClient } from "@/shared/lib/httpClient";
import type { CreatePostRequest } from "@/modules/community/interfaces/requests/create-post.interface";
import type { CreateReplyRequest } from "@/modules/community/interfaces/requests/create-reply.interface";
import type { UpdatePostRequest } from "@/modules/community/interfaces/requests/update-post.interface";
import type { UpdateReplyRequest } from "@/modules/community/interfaces/requests/update-reply.interface";
import type { CommunityPost } from "@/modules/community/interfaces/responses/community-post.interface";
import type { CommunityPostDetail } from "@/modules/community/interfaces/responses/community-post-detail.interface";
import type { CommunityReply } from "@/modules/community/interfaces/responses/community-reply.interface";
import type { CommunitySubject } from "@/modules/community/interfaces/responses/community-subject.interface";
import type { HelpfulMark } from "@/modules/community/interfaces/responses/helpful-mark.interface";
import type { MyPodiumPosition } from "@/modules/community/interfaces/responses/my-podium-position.interface";
import type { PagedPosts } from "@/modules/community/interfaces/responses/paged-posts.interface";
import type { TutorPodium } from "@/modules/community/interfaces/responses/tutor-podium.interface";

const BASE = "/api/v1/community";

function buildMultipart(request: object, file: File | null): FormData {
  const formData = new FormData();
  formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
  if (file) {
    formData.append("file", file);
  }
  return formData;
}

export async function getCommunityFeed(page: number, size: number): Promise<PagedPosts> {
  const response = await httpClient.get<PagedPosts>(`${BASE}/posts`, { params: { page, size } });
  return response.data;
}

export async function getMyPosts(page: number, size: number, date?: string): Promise<PagedPosts> {
  const response = await httpClient.get<PagedPosts>(`${BASE}/posts/mine`, {
    params: { page, size, date: date || undefined },
  });
  return response.data;
}

export async function getPostDetail(postId: string): Promise<CommunityPostDetail> {
  const response = await httpClient.get<CommunityPostDetail>(`${BASE}/posts/${postId}`);
  return response.data;
}

export async function createPost(
  request: CreatePostRequest,
  file: File | null
): Promise<CommunityPost> {
  const response = await httpClient.post<CommunityPost>(
    `${BASE}/posts`,
    buildMultipart(request, file)
  );
  return response.data;
}

export async function updatePost(
  postId: string,
  request: UpdatePostRequest,
  file: File | null
): Promise<CommunityPost> {
  const response = await httpClient.put<CommunityPost>(
    `${BASE}/posts/${postId}`,
    buildMultipart(request, file)
  );
  return response.data;
}

export async function deletePost(postId: string): Promise<void> {
  await httpClient.delete(`${BASE}/posts/${postId}`);
}

export async function resolvePost(postId: string): Promise<CommunityPost> {
  const response = await httpClient.post<CommunityPost>(`${BASE}/posts/${postId}/resolve`);
  return response.data;
}

export async function createReply(
  postId: string,
  request: CreateReplyRequest,
  file: File | null
): Promise<CommunityReply> {
  const response = await httpClient.post<CommunityReply>(
    `${BASE}/posts/${postId}/replies`,
    buildMultipart(request, file)
  );
  return response.data;
}

export async function updateReply(
  postId: string,
  replyId: string,
  request: UpdateReplyRequest,
  file: File | null
): Promise<CommunityReply> {
  const response = await httpClient.put<CommunityReply>(
    `${BASE}/posts/${postId}/replies/${replyId}`,
    buildMultipart(request, file)
  );
  return response.data;
}

export async function deleteReply(postId: string, replyId: string): Promise<void> {
  await httpClient.delete(`${BASE}/posts/${postId}/replies/${replyId}`);
}

export async function markReplyHelpful(postId: string, replyId: string): Promise<HelpfulMark> {
  const response = await httpClient.put<HelpfulMark>(
    `${BASE}/posts/${postId}/replies/${replyId}/helpful`
  );
  return response.data;
}

export async function unmarkReplyHelpful(postId: string, replyId: string): Promise<HelpfulMark> {
  const response = await httpClient.delete<HelpfulMark>(
    `${BASE}/posts/${postId}/replies/${replyId}/helpful`
  );
  return response.data;
}

export async function getCommunitySubjects(): Promise<CommunitySubject[]> {
  const response = await httpClient.get<CommunitySubject[]>(`${BASE}/subjects`);
  return response.data;
}

export async function getTutorPodium(): Promise<TutorPodium> {
  const response = await httpClient.get<TutorPodium>(`${BASE}/podium`);
  return response.data;
}

export async function getMyPodiumPosition(): Promise<MyPodiumPosition> {
  const response = await httpClient.get<MyPodiumPosition>(`${BASE}/podium/me`);
  return response.data;
}
