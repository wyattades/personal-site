import { Layout } from "~/components/layout";
import { BlockText } from "~/components/physics-import";

const ErrorPage = ({
  error,
}: {
  error: Partial<Error> & { code?: number };
}) => (
  <Layout>
    <div className="layers">
      <BlockText text={(error?.code ?? 404).toString()} />
    </div>
  </Layout>
);

export default ErrorPage;
