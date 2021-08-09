import { Photo } from "./photo";

export interface Member {
    id: number;
    username: string;
    photoUrl: string;
    age: number;
    knownAs: string;
    created: Date;
    lastActive: Date;
    gender: string;
    introduction: string;
    lookingFor: string;
    interests: string;
    city: string;
    country: string;
    photos: Photo[];
}

export const defaultMember: Member = {
    id: 0,
    username: "",
    photoUrl: "",
    age: 0,
    knownAs: "",
    created: new Date(),
    lastActive: new Date(),
    gender: "",
    introduction: "",
    lookingFor: "",
    interests: "",
    city: "",
    country: "",
    photos: []
}