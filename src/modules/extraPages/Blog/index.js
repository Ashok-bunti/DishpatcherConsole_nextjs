'use client';
import BlogContent from './BlogContent';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import AppLoader from '@crema/components/AppLoader';

const Blogs = () => {
  const [{ apiData, loading }] = useGetDataApi('/blogs');

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <BlogContent
          blogSidebar={apiData.blogSidebar}
          blogContent={apiData.blogContent}
        />
      )}
    </>
  );
};
export default Blogs;
