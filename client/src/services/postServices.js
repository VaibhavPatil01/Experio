import apiClient from './apiClient.js';
import getAuthToken from '../utils/getAuthToken.js';
import getTagsFromString from '../utils/getTagsFromString.js';
import { BASE_API_URL } from './serverConfig.js';

export function getPost(id) {
  const url = `${BASE_API_URL}/posts/${id}`;
  return apiClient.get(url).then((res) => res.data.post);
}

export function getMostViewedPosts(limit) {
  const page = 1;
  const url = new URL(`${BASE_API_URL}/posts`);

  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  url.searchParams.set('sortBy', 'views');

  return apiClient.get(url.href).then((res) => res.data);
}

export function getPostsPaginated(page, limit, filter, signal) {
  const url = new URL(`${BASE_API_URL}/posts`);

  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());

  if (filter.search.length !== 0) {
    url.searchParams.set('search', filter.search);
  }

  if (filter.sortBy.length !== 0) {
    url.searchParams.set('sortBy', filter.sortBy);
  }

  if (filter.articleType.length !== 0) {
    url.searchParams.set('articleType', filter.articleType);
  }

  if (filter.jobRole.length !== 0) {
    url.searchParams.set('jobRole', filter.jobRole);
  }

  if (filter.company.length !== 0) {
    url.searchParams.set('company', filter.company);
  }

  if (filter.rating.length !== 0) {
    url.searchParams.set('rating', filter.rating);
  }

  if (filter.datePosted && filter.datePosted !== 'Anytime') {
    url.searchParams.set('datePosted', filter.datePosted);
  }

  return apiClient.get(url.href, { signal })
    .then((res) => res.data)
    .then((data) => {
      const postQueryData = structuredClone(data);
      if (postQueryData.data.length < limit) {
        postQueryData.page.nextPage = undefined;
      }
      return postQueryData;
    });
}

export function createPost(postData, status) {
  const url = `${BASE_API_URL}/posts`;
  const tags = postData.tags ? getTagsFromString(postData.tags) : [];
  const body = { ...postData, tags, status };

  return apiClient.post(url, body)
    .then((response) => response.data);
}

export function getBookmarkedPostsPaginated(userId, page, limit) {
  const url = new URL(`${BASE_API_URL}/posts/user/bookmarked/${userId}`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());

  return apiClient.get(url.href)
    .then((res) => res.data)
    .then((data) => {
      const postQueryData = structuredClone(data);
      if (postQueryData.data.length < limit) {
        postQueryData.page.nextPage = undefined;
      }
      return postQueryData;
    });
}

export function getRelatedPosts(postId, limit) {
  const url = new URL(`${BASE_API_URL}/posts/related/${postId}`);
  url.searchParams.set('limit', limit.toString());

  return apiClient.get(url.href)
    .then((res) => res.data)
    .then((data) => data.relatedPosts);
}

export function getRecommendedFeedPaginated(page, limit) {
  const url = new URL(`${BASE_API_URL}/recommendations/feed`);
  url.searchParams.set('limit', limit.toString());
  // The backend might not support page for vector search yet, but we pass limit

  return apiClient.get(url.href)
    .then((res) => res.data)
    .then((data) => {
      // Mock page object since recommendation API doesn't paginate yet
      return {
        data: data.data,
        page: { nextPage: undefined }
      };
    });
}

export function getUserPostPaginated(userId, page, limit) {
  const url = new URL(`${BASE_API_URL}/posts/user/all/${userId}`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());

  return apiClient.get(url.href)
    .then((res) => res.data)
    .then((data) => {
      const postQueryData = structuredClone(data);
      if (postQueryData.data.length < limit) {
        postQueryData.page.nextPage = undefined;
      }
      return postQueryData;
    });
}

export function deletePost(postId) {
  const url = `${BASE_API_URL}/posts/${postId}`;

  return apiClient.delete(url)
    .then((response) => response.data);
}

export function toggleBookmark(postId, isBookmarked) {
  const url = `${BASE_API_URL}/posts/bookmark/${postId}`;

  // Remove the bookmark if already bookmarked
  if (isBookmarked) {
    return apiClient.delete(url)
      .then((response) => response.data);
  }

  // If not bookmarked then bookmark the post
  return apiClient.post(url, {})
    .then((response) => response.data);
}

export function getCompanyAndRoleList() {
  const url = new URL(`${BASE_API_URL}/posts/data/company-roles`);

  return apiClient.get(url.href).then((res) => res.data);
}

export function getTopCompanies() {
  const url = new URL(`${BASE_API_URL}/posts/data/top-companies`);

  return apiClient.get(url.href).then((res) => res.data);
}

export function editPost(editedPostData, postId, status) {
  const url = `${BASE_API_URL}/posts/edit`;
  const tags = editedPostData.tags ? getTagsFromString(editedPostData.tags) : [];
  const body = {
    ...editedPostData,
    tags,
    status,
    postId
  };

  return apiClient.put(url, body)
    .then((response) => response.data);
}

export function upVotePost(postId) {
  const url = `${BASE_API_URL}/posts/upvote/${postId}`;

  return apiClient.post(url, {})
    .then((response) => response.data);
}

export function downVotePost(postId) {
  const url = `${BASE_API_URL}/posts/downvote/${postId}`;

  return apiClient.post(url, {})
    .then((response) => response.data);
}

export function getPostComments(postId) {
  const url = `${BASE_API_URL}/posts/${postId}/comments`;
  return apiClient.get(url).then((res) => res.data.comments);
}

export function addComment(postId, content) {
  const url = `${BASE_API_URL}/posts/${postId}/comments`;
  return apiClient.post(url, { content }).then((res) => res.data);
}

export function addReply(postId, commentId, content, parentReplyId = null) {
  const url = `${BASE_API_URL}/posts/${postId}/comments/${commentId}/replies`;
  const body = parentReplyId ? { content, parentReplyId } : { content };
  return apiClient.post(url, body).then((res) => res.data);
}

export function editComment(postId, commentId, content) {
  const url = `${BASE_API_URL}/posts/${postId}/comments/${commentId}`;
  return apiClient.put(url, { content }).then((res) => res.data);
}

export function deleteComment(postId, commentId) {
  const url = `${BASE_API_URL}/posts/${postId}/comments/${commentId}`;
  return apiClient.delete(url).then((res) => res.data);
}

export function editReply(postId, commentId, replyId, content) {
  const url = `${BASE_API_URL}/posts/${postId}/comments/${commentId}/replies/${replyId}`;
  return apiClient.put(url, { content }).then((res) => res.data);
}

export function deleteReply(postId, commentId, replyId) {
  const url = `${BASE_API_URL}/posts/${postId}/comments/${commentId}/replies/${replyId}`;
  return apiClient.delete(url).then((res) => res.data);
}

export function toggleCommentUpvote(postId, commentId) {
  const url = `${BASE_API_URL}/posts/${postId}/comments/${commentId}/upvote`;
  return apiClient.post(url, {}).then((res) => res.data);
}

export function toggleReplyUpvote(postId, commentId, replyId) {
  const url = `${BASE_API_URL}/posts/${postId}/comments/${commentId}/replies/${replyId}/upvote`;
  return apiClient.post(url, {}).then((res) => res.data);
}

export function toggleCommentDownvote(postId, commentId) {
  const url = `${BASE_API_URL}/posts/${postId}/comments/${commentId}/downvote`;
  return apiClient.post(url, {}).then((res) => res.data);
}

export function toggleReplyDownvote(postId, commentId, replyId) {
  const url = `${BASE_API_URL}/posts/${postId}/comments/${commentId}/replies/${replyId}/downvote`;
  return apiClient.post(url, {}).then((res) => res.data);
}
