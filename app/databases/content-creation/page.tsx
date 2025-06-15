import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ContentIdeasTable from "@/components/content_ideas_table";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Creation",
};

const ContentCreationPage = () => {
  return (
    <>
      <Breadcrumb pageName="Content Creation" />

      <div className="space-y-10">
        <ContentIdeasTable />
      </div>
    </>
  );
};

export default ContentCreationPage;
