'use client';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import AppLoader from '@crema/components/AppLoader';
import AppAnimate from '@crema/components/AppAnimate';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isEmptyObject } from '@crema/helpers/ApiHelper';
import CreateBlog from '../CreateBlog';

const BlogEditPage = () => {
  const params = useParams();
  const { all } = params;
  const [{ apiData, loading }, { setQueryParams }] = useGetDataApi(
    '/blogs/detail',
    {},
    { id: all[0] },
    false,
  );

  useEffect(() => {
    setQueryParams({ id: all[0] });
  }, [all[0]]);

  return loading ? (
    <AppLoader />
  ) : (
    !isEmptyObject(apiData?.blogDetail) && (
      <AppAnimate animation='transition.slideUpIn' delay={200}>
        <CreateBlog selectedBlog={apiData.blogDetail} />
      </AppAnimate>
    )
  );
};
export default BlogEditPage;
