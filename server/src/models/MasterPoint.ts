
export interface Points {
    type:     string;
    features: Feature[];
}

export interface Feature {
    type:       FeatureType;
    properties: PropertyType;
    geometry:   Geometry;
}

export interface Geometry {
    type:        GeometryType;
    coordinates: number[];
}

export enum GeometryType {
    Point = "Point",
}

export enum FeatureType {
    Feature = "Feature",
}

export interface PropertyType {
    tcsnumber: string,
    name: string,
    length: number,
    depth: number,
    pdep: number,
    ps: number,
    co_name: string,
    topo_name: string,
    topo_indi: string,
    elev: number,
    ownership: string,
    gear: string,
    ent_type: string,
    field_indi: string,
    map_status: string,
    geology: string,
    geo_age: string,
    phys_prov: string,
    narr?: string
}