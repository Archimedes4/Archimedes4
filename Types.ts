export enum loadingStateEnum {
  notStarted,
  loading,
  failed,
  success,
}
declare global {
  type storageItem = {
    name: string;
    fileType: string;
    loadingState: loadingStateEnum;
    url?: undefined|string;
  }
  type post = {
    title: string;
    cover: storageItem;
    assests: storageItem[];
    content: string;
    date: string;
    type: string;
  }
}