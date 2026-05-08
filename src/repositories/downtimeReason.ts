import BaseAPI from './BaseAPI'

export type DowntimeReasonType = {
  id: number | null;
  name: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export default class DowntimeReasonAPI extends BaseAPI<DowntimeReasonType> {
  constructor () {
    super('/downtime-reasons')
    this.defaultObject = {
      id: null,
      name: null,
      description: null,
      created_at: null,
      updated_at: null
    }
  }
}
