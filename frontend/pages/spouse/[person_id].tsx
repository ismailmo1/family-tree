import { NextPage } from "next";
import RelatedPeoplePage from "../../components/genericPages/relatedPeople";

const SpousePage: NextPage = () => {
  const addSpouseUrl = (id: string, spouseId: string) => {
    return `/family/spouse?person1_id=${id}&person2_id=${spouseId}`;
  };
  const getSpouseUrl = (id: string) => {
    return `/family/spouse?id=${id}`;
  };

  return (
    <RelatedPeoplePage
      relation="spouse"
      genAddPeopleUrl={addSpouseUrl}
      genGetPeopleUrl={getSpouseUrl}
    />
  );
};

export default SpousePage;
