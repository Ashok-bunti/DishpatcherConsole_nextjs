import ecommerceData from '@crema/fakedb/ecommerce/ecommerceData';
export const GET = async (request, { params }) => {
  const { page, ...filterData } = Object.fromEntries(
    request.nextUrl.searchParams,
  );
  const multiPropsFilter = (products, filters, stringKey = 'title') => {
    const filterKeys = Object.keys(filters);
    return products.filter((product) => {
      return filterKeys.every((key) => {
        if (filters[key].length === 0) return true;
        // Loops again if product[key] is an array (for material attribute).
        if (Array.isArray(product[key])) {
          return product[key].some((keyEle) => filters[key].includes(keyEle));
        }
        if (filters[key].end) {
          if (key === 'mrp') {
            return (
              product[key] >= filters[key].start &&
              product[key] < filters[key].end
            );
          } else {
            const start = new Date(filters[key].start).getTime();
            const end = new Date(filters[key].end).getTime();
            const productDate = new Date(product[key]).getTime();

            return productDate >= start && productDate <= end;
          }
        }
        if (key === stringKey) {
          return product[key]
            .toLowerCase()
            .includes(filters[key].toLowerCase());
        }
        return filters[key].includes(product[key]);
      });
    });
  };
  try {
    const data = multiPropsFilter(ecommerceData, filterData);

    const index = page * 10;
    const total = data.length;
    const list = data.length > 10 ? data.slice(index, index + 10) : data;
    return new Response(JSON.stringify({ data: list, count: total }), {
      status: 200,
    }); //TODO: change to list
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
