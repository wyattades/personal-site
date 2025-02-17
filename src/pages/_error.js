import Layout from "~/components/Layout";
import { BlockText } from "~/components/physicsImport";

const ErrorPage = ({ error }) => (
  <Layout>
    <div className="layers">
      <BlockText text={(error?.code ?? 404).toString()} />
    </div>
  </Layout>
);

export default ErrorPage;
