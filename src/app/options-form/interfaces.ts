export interface Mapping {
    dir: string
    route: string
    id: string
    sortOrder: number
    active: boolean
}

export interface BsProxy {
    target: string
    id: string
    sortOrder: number
    active: boolean
}