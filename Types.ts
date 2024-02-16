export enum loadingStateEnum {
  notStarted,
  loading,
  failed,
  success,
  notFound
}
declare global {
  type storageItem = {
    name: string;
    fileType: string;
    loadingState: loadingStateEnum.failed | loadingStateEnum.loading | loadingStateEnum.notStarted;
  } | {
    name: string;
    fileType: string;
    loadingState: loadingStateEnum.success;
    url: string;
  }
  type postAsset = {
    item: storageItem,
    id: string
  }
  type postView = {
    date: string;
    userId: string;
  }
  type post = {
    title: string;
    cover: storageItem;
    assests: postAsset[];
    content: string;
    updated: string;
    type: string;
    id: string
    url: string;
    technologies: technology[];
    status: string;
    githubUrl: string;
    hidden: boolean;
    views: postView[]
  }
  type message = {
    email: string;
    content: string;
    time: string;
  }
  type technology = {
    content: string;
    name: string;
    firstUsed: string;
    lastUsed: string;
    displayTechnology: string;
    id: string;
  }
}