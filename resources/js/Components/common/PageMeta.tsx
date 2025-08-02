import { HelmetProvider, Helmet } from "react-helmet-async";
const appName = import.meta.env.VITE_APP_NAME ?? "FG";

const PageMeta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Helmet>
    <title>{title} | {appName}</title>
    <meta name="description" content={description} />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
