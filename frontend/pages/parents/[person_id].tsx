import { NextPage } from "next";
import RelatedPeoplePage from "../../components/genericPages/relatedPeople";

const ParentsPage: NextPage = () => {
  const addParentUrl = (id: string, parentId: string) => {
    return `http://localhost:8000/parents/?child_id=${id}&parent_id=${parentId}`;
  };
  const getParentUrl = (id: string) => {
    return `http://localhost:8000/parents/?id=${id}`;
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
