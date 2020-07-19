// Generated by https://quicktype.io

export interface ParcelResponseInterface {
    id:              number;
    headline:        string;
    fields:          Fields;
    key:             { [key: string]: string };
    has_premium:     boolean;
    reference_links: ReferenceLinks;
    streetview:      string;
    birdseye:        string;
    gmaps_url:       string;
    spec:            Spec;
    path:            string;
    centroid:        number[];
    geometry:        Geometry;
    blexts:          any[];
    blext_key:       BlextKey;
    bookmarked:      null;
    context:         Context[];
    metadata:        Metadata;
    notices:         BlextKey;
    others:          any[];
    status:          string;
    sources:         any[];
}

export interface BlextKey {
}

export interface Context {
    headline:    string;
    name:        string;
    path:        string;
    category?:   string;
    active?:     boolean;
    verse_path?: string;
}

export interface Fields {
    parcelnumb:              string;
    owner:                   string;
    address:                 string;
    scity:                   string;
    szip:                    string;
    usecode:                 string;
    zoning:                  string;
    yearbuilt:               string;
    landval:                 number;
    parval:                  number;

    saleprice:               number;
    saledate:                string;
    owner2:                  string;
    owner3:                  null;
    mailadd:                 string;
    mail_address2:           null;
    mail_unit:               null;
    mail_city:               string;
    mail_state2:             string;
    mail_zip:                string;
    mailingcountry:          null;
    legaldesc:               string;
    book:                    string;
    page:                    string;
    block:                   string;
    lot:                     string;
    neighborhood:            string;
    subdivision:             string;
    gisacre:                 number;
    parcelid:                string;
    camaacct:                string;
    parent_:                 string;
    usedesc:                 string;
    map:                     string;
    cntlmap:                 string;
    parcel:                  string;
    deedacres:               number;
    specint:                 string;
    greenbelt:               string;
    cama:                    string;
    um:                      string;
    umvalue:                 string;
    review:                  string;
    parcelcomments:          string;
    improvedstatus:          string;
    totalarea:               string;
    accounttype:             string;
    marketarea:              string;
    appraisalarea:           string;
    streetcondition:         string;
    topography:              string;
    traffic:                 string;
    salelandusecode:         string;
    grantor:                 null;
    grantee:                 string;
    baths:                   number;
    beds:                    string;
    buildingtypedescription: string;
    condocomplex:            string;
    totalyarditemvalue:      number;
    totallandarea:           number;
    totalfinishedarea:       number;
    business:                string;
    businessname:            string;
    propertystatus:          string;
    totalassessedvalue:      number;
    nalcode:                 string;
    soldasvacant:            string;
    ll_gisacre:              number;
    ll_gissqft:              number;
}

export interface Geometry {
    type:        string;
    coordinates: Array<Array<number[]>>;
}

export interface Metadata {
    headline:      string;
    table_updated: string;
    last_refresh:  string;
}

export interface ReferenceLinks {
    lbcs_activity:  string;
    lbcs_function:  string;
    lbcs_ownership: string;
    lbcs_structure: string;
    lbcs_site:      string;
}

export interface Spec {
    dataset: string;
    geoid:   string;
    city:    string;
    id:      number;
}