import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from 'react-query';
import { PostDetail } from "./PostDetail";

const maxPostPage = 10;

async function fetchPosts(pageNumber) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNumber}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(['posts', nextPage], () => fetchPosts(nextPage));
    }
  }, [currentPage, queryClient])

  // reactQuery detects when query key changes and fires request in this case currentPage
  const { data, isError, error, isLoading } = useQuery(
    ['posts', currentPage],
    () => fetchPosts(currentPage),
    { staleTime: 2000, keepPreviousData: true },
  );
  if (isLoading) return <h3>Loading!</h3>;
  if (isError) return (
    <>
      <h3>Something went wrong!</h3>
      <p>{error.toString()}</p>
    </>
  );

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        {/* How does setCurrentPage function know currentPageNumber? */}
        {/* Why is it better to use callback function rather than adding to currentPage? */}
        <button disabled={currentPage <= 1} onClick={() => { setCurrentPage((currentPageNumber) => currentPageNumber - 1) }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage >= maxPostPage} onClick={() => { setCurrentPage((currentPageNumber) => currentPageNumber + 1) }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
