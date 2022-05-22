import { NextPage } from "next";
import RelatedPeoplePage from "../../components/genericPages/relatedPeople";

const SpousePage: NextPage = () => {
  const addSpouseUrl = (id: string, spouseId: string) => {
    return `http://localhost:8000/family/spouse?person1_id=${id}&person2_id=${spouseId}`;
  };
  const getSpouseUrl = (id: string) => {
    return `http://localhost:8000/family/spouse?id=${id}`;
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
