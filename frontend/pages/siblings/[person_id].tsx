import { NextPage } from "next";
import RelatedPeoplePage from "../../components/genericPages/relatedPeople";

const SiblingsPage: NextPage = () => {
  const addSiblingUrl = (id: string, siblingId: string) => {
    return `/family/siblings?person_id=${id}&sibling_to_add_id=${siblingId}`;
  };
  const getSiblingUrl = (id: string) => {
    return `/family/siblings?id=${id}`;
  };

  return (
    <RelatedPeoplePage
      relation="sibling"
      genAddPeopleUrl={addSiblingUrl}
      genGetPeopleUrl={getSiblingUrl}
    />
  );
};

export default SiblingsPage;
