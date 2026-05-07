import { Helmet } from "react-helmet";

const PageTitle = ({ title }) => {
  return (
    <Helmet>
      <title>{title} | MyStore</title>
    </Helmet>
  );
};

export default PageTitle;
