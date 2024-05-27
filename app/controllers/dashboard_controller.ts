import type { HttpContext } from '@adonisjs/core/http'
import Device from '#models/device'
import Region from '#models/region'
import Zone from '#models/zone'
import Technician from '#models/technician'
import User from '#models/user'
import Status from '#models/status'
import { getDeviceStatus } from '../../helper/get_device_status.js'
import { responseUtil } from '../../helper/response_util.js'
import type { 
    DeviceData,
    UserType, 
    ZoneType,
    RegionType, 
    DeviceType, 
    TechnicianType, 
    StatusType 
} from '../../helper/interface.js'

interface ResultType {
  all_devices: number;
  problem: {
    count: number;
    devices: DeviceData[];
  };
  issue: {
    count: number;
    devices: DeviceData[];
  };
  active: {
    count: number;
    devices: DeviceData[];
  };
}

export default class DashboardController {
  async index({ response }: HttpContext) {
    try {
      const devices = await Device.all() as DeviceType[];

      let problemCount = 0;
      let issueCount = 0;
      let activeCount = 0;

      const problemDevices: DeviceData[] = [];
      const issueDevices: DeviceData[] = [];
      const activeDevices: DeviceData[] = [];

      await Promise.all(
        devices.map(async (device) => {
          const region = await Region.find(device.regionId) as RegionType | null;
          const zone = region ? await Zone.find(region.zoneId) as ZoneType | null : null;
          const user = await User.find(device.registeredBy) as UserType | null;
          const status = await Status.findBy('device_id', device.id) as StatusType | null;

          let register_by_name: string | null = null;
          if (user && user.role === 'technician') {
            const technician = await Technician.findBy('user_id', device.registeredBy) as TechnicianType | null;
            register_by_name = technician ? technician.name : null;
          }
          const tid = `${zone ? zone.id : ''}${region ? region.id : ''}${device.id}`;

          const isActive = getDeviceStatus(status?.updatedAt);

          const deviceData: DeviceData = {
            id: device.id,
            tid: tid,
            name: device.name,
            zone_name: zone ? zone.name : null,
            region_name: region ? region.name : null,
            register_by: register_by_name || (user ? user.email : null),
            update_at: device.updatedAt,
          };

          switch (isActive) {
            case 'problem':
              problemCount++;
              problemDevices.push(deviceData);
              break;
            case 'issue':
              issueCount++;
              issueDevices.push(deviceData);
              break;
            case 'active':
              activeCount++;
              if (activeDevices.length < 6) {
                activeDevices.push(deviceData);
              }
              break;
          }
        })
      );

      const allDeviceCount = devices.length;

      const result: ResultType = {
        all_devices: allDeviceCount,
        problem: {
          count: problemCount,
          devices: problemDevices,
        },
        issue: {
          count: issueCount,
          devices: issueDevices,
        },
        active: {
          count: activeCount,
          devices: activeDevices,
        },
      };

      return responseUtil.success(response, result, 'Devices retrieved successfully');
    } catch (error) {
      console.error(error);
      return responseUtil.notFound(response, 'Failed to retrieve devices');
    }
  }
}
