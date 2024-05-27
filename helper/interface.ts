export interface DeviceType {
    id: number;
    name: string;
    regionId: number;
    registeredBy: number;
    updatedAt: any;
}
  
export interface RegionType {
    id: number;
    name: string;
    zoneId: number;
}
  
export interface ZoneType {
    id: number;
    name: string;
}
  
export interface TechnicianType {
    user_id: number;
    name: string;
}
  
export interface UserType {
    id: number;
    email: string;
    role: string;
}
  
export interface StatusType {
    id: number;
    device_id: number;
    updatedAt: Date;
}
  
export interface DeviceData {
    id: number;
    tid: string;
    name: string;
    zone_name: string | null;
    region_name: string | null;
    register_by: string | null;
    update_at: Date;
}