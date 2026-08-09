import axios from 'axios';
import getAuthToken from '../utils/getAuthToken.js';
import getTagsFromString from '../utils/getTagsFromString.js';
import { BASE_API_URL } from './serverConfig.js';

export function getPost(id) {
  const url = `${BASE_API_URL}/posts/${id}`;
  const options = {
    headers: { token: getAuthToken() }
  };
  return axios.get(url, options).then((res) => res.data.post);
}

export function getMostViewedPosts(limit) {
  const page = 1;
  const url = new URL(`${BASE_API_URL}/posts`);

  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());
  url.searchParams.set('sortBy', 'views');

  return axios.get(url.href, { headers: { token: getAuthToken() } }).then((res) => res.data);
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

  const options = {
    headers: { token: getAuthToken() },
    signal
  };

  return axios
    .get(url.href, options)
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

  return axios
    .post(url, body, { headers: { token: getAuthToken() } })
    .then((response) => response.data);
}

export function getBookmarkedPostsPaginated(userId, page, limit) {
  const url = new URL(`${BASE_API_URL}/posts/user/bookmarked/${userId}`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', limit.toString());

  return axios
    .get(url.href, { headers: { token: getAuthToken() } })
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

  return axios
    .get(url.href, { headers: { token: getAuthToken() } })
    .then((res) => res.data)
    .then((data) => data.relatedPosts);
}

export function getRecommendedFeedPaginated(page, limit) {
  const url = new URL(`${BASE_API_URL}/recommendations/feed`);
  url.searchParams.set('limit', limit.toString());
  // The backend might not support page for vector search yet, but we pass limit

  return axios
    .get(url.href, { headers: { token: getAuthToken() } })
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

  return axios
    .get(url.href, { headers: { token: getAuthToken() } })
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

  return axios
    .delete(url, { headers: { token: getAuthToken() } })
    .then((response) => response.data);
}

export function toggleBookmark(postId, isBookmarked) {
  const url = `${BASE_API_URL}/posts/bookmark/${postId}`;

  // Remove the bookmark if already bookmarked
  if (isBookmarked) {
    return axios
      .delete(url, { headers: { token: getAuthToken() } })
      .then((response) => response.data);
  }

  // If not bookmarked then bookmark the post
  return axios
    .post(url, {}, { headers: { token: getAuthToken() } })
    .then((response) => response.data);
}

export function getCompanyAndRoleList() {
  const url = new URL(`${BASE_API_URL}/posts/data/company-roles`);

  return axios.get(url.href).then((res) => res.data);
}

export function getTopCompanies() {
  const url = new URL(`${BASE_API_URL}/posts/data/top-companies`);

  return axios.get(url.href).then((res) => res.data);
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

  return axios
    .put(url, body, { headers: { token: getAuthToken() } })
    .then((response) => response.data);
}

export function upVotePost(postId) {
  const url = `${BASE_API_URL}/posts/upvote/${postId}`;

  return axios
    .post(url, {}, { headers: { token: getAuthToken() } })
    .then((response) => response.data);
}

export function downVotePost(postId) {
  const url = `${BASE_API_URL}/posts/downvote/${postId}`;

  return axios
    .post(url, {}, { headers: { token: getAuthToken() } })
    .then((response) => response.data);
}

export function getPostComments(postId) {
  const url = `${BASE_API_URL}/posts/${postId}/comments`;
  return axios.get(url, { headers: { token: getAuthToken() } }).then((res) => res.data.comments);
}

export function addComment(postId, content) {
  const url = `${BASE_API_URL}/posts/${postId}/comments`;
  return axios.post(url, { content }, { headers: { token: getAuthToken() } }).then((res) => res.data);
}

export function addReply(postId, commentId, content, parentReplyId = null) {
  const url = `${BASE_API_URL}/posts/${postId}/comments/${commentId}/replies`;
  const body = parentReplyId ? { content, parentReplyId } : { content };
  return axios.post(url, body, { headers: { token: getAuthToken() } }).then((res) => res.data);
}

export function toggleCommentUpvote(postId, commentId) {
  const url = `${BASE_API_URL}/posts/${postId}/comments/${commentId}/upvote`;
  return axios.post(url, {}, { headers: { token: getAuthToken() } }).then((res) => res.data);
}

export function toggleReplyUpvote(postId, commentId, replyId) {
  const url = `${BASE_API_URL}/posts/${postId}/comments/${commentId}/replies/${replyId}/upvote`;
  return axios.post(url, {}, { headers: { token: getAuthToken() } }).then((res) => res.data);
}

export function toggleCommentDownvote(postId, commentId) {
  const url = `${BASE_API_URL}/posts/${postId}/comments/${commentId}/downvote`;
  return axios.post(url, {}, { headers: { token: getAuthToken() } }).then((res) => res.data);
}

export function toggleReplyDownvote(postId, commentId, replyId) {
  const url = `${BASE_API_URL}/posts/${postId}/comments/${commentId}/replies/${replyId}/downvote`;
  return axios.post(url, {}, { headers: { token: getAuthToken() } }).then((res) => res.data);
}
