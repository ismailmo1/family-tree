import { PersonMatchResult } from "./person";

export interface NuclearFamily {
  parents: [PersonMatchResult, PersonMatchResult];
  children: PersonMatchResult[];
}
