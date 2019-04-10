import React from 'react';
import Helmet from 'react-helmet';
import { formatTitle, formatCanonicalPath } from 'utils/helmetHelper';
import { imgHost, SITE_NAME } from '../../constants/helmetData';

export default ({
  title,
  pathname,
  page,
  companyName,
  dataNum,
  avgWeekWorkTime,
  avgHourWage,
}) => {
  const helmetTitle = `${title} - 第${page}頁`;
  const url = `${formatCanonicalPath(pathname)}?p=${page}`;
  const description = `${companyName} 的薪水平均 ${avgHourWage} 元/小時，平均每週工作 ${avgWeekWorkTime} 小時，總共 ${dataNum} 筆的薪水、加班狀況資料。`;
  const keywords = `${companyName}薪水, ${companyName}薪資, ${companyName}加班狀況, ${companyName}工時`;
  return (
    <Helmet
      title={helmetTitle}
      meta={[
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { property: 'og:title', content: formatTitle(helmetTitle, SITE_NAME) },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        {
          property: 'og:image',
          content: `${imgHost}/og/time-and-salary.jpg`,
        },
      ]}
      link={[{ rel: 'canonical', href: url }]}
    />
  );
};