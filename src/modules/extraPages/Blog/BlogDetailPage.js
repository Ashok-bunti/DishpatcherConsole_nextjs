'use client';
import { useEffect } from 'react';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import AppLoader from '@crema/components/AppLoader';
import BlogDetail from './BlogDetail';
import { isEmptyObject } from '@crema/helpers/ApiHelper';
import { useParams } from 'next/navigation';

const BlogDetailPage = () => {
  const params = useParams();
  const { all } = params;
  const [{ apiData, loading }, { setQueryParams }] = useGetDataApi(
    '/blogs/detail',
    {},
    {},
    false,
  );

  useEffect(() => {
    if (all?.[0]) setQueryParams({ id: all[0] });
    else setQueryParams({});
  }, [all]);

  return loading ? (
    <AppLoader />
  ) : (
    !isEmptyObject(apiData?.blogDetail) && (
      <BlogDetail
        blogSidebar={apiData.blogSidebar}
        blogDetail={apiData.blogDetail}
      />
    )
  );
};
export default BlogDetailPage;
