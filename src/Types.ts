export enum loadingStateEnum {
  notStarted,
  loading,
  failed,
  success,
  notFound
}

export enum uploadStateEnum {
  notStarted,
  running,
  paused,
  failed,
  success
}

declare global {
  type storageItem = {
    id: string
    name: string;
    fileType: string;
    loadingState: loadingStateEnum.failed | loadingStateEnum.loading | loadingStateEnum.notStarted;
  } | {
    id: string
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
    views: postView[];
    hiddenTitle: boolean;
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