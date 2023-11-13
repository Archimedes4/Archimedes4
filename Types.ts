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
    updated: string;
    type: string;
    id: string
    url: string;
    technologies: string[];
    status: string;
    githubUrl: string;
  }
  type message = {
    email: string;
    content: string;
    time: string;
  }
}