import { PersonMatchResult } from "./person";

export interface addSiblingSuccessResponse {
  child: PersonMatchResult;
  parent1: PersonMatchResult;
  parent2: PersonMatchResult;
}
