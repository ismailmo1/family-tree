import { NextPage } from "next";
import RelatedPeoplePage from "../../components/genericPages/relatedPeople";

const ParentsPage: NextPage = () => {
  const addParentUrl = (id: string, parentId: string) => {
    return `/parents/?child_id=${id}&parent_id=${parentId}`;
  };
  const getParentUrl = (id: string) => {
    return `/parents/?id=${id}`;
  };

  return (
    <RelatedPeoplePage
      relation="parent"
      genAddPeopleUrl={addParentUrl}
      genGetPeopleUrl={getParentUrl}
    />
  );
};

export default ParentsPage;
