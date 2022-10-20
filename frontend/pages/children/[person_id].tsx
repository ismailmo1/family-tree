import { NextPage } from "next";
import RelatedPeoplePage from "../../components/genericPages/relatedPeople";

const ChildrenPage: NextPage = () => {
  const addChildrenUrl = (parentId: string, childId: string) => {
    return `/children?child_id=${childId}&parent_id=${parentId}`;
  };
  const getChildrenUrl = (id: string) => {
    return `/children?parent_id=${id}`;
  };

  return (
    <RelatedPeoplePage
      relation="child"
      genAddPeopleUrl={addChildrenUrl}
      genGetPeopleUrl={getChildrenUrl}
    />
  );
};

export default ChildrenPage;
