import { IEntityQuery } from "@entity-access/entity-access/dist/model/IFilterWithParameter.js";
import Tag from "../entities/Tag.js";
import AuthenticatedEvents from "./AuthenticatedEvents.js";

export default class TagEvents extends AuthenticatedEvents<Tag> {

    filter(query: IEntityQuery<Tag>) {
        return query;
    }
}