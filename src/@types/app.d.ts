export interface ITelegramUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
}

type Price = {
  single?: number;
  min?: number;
  max?: number;
};

type FormError = {
  field: string;
  message: string;
};

export type Option = { label: string; value: string };

export interface IWebApp {
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user: ITelegramUser;
    auth_date: string;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: string;
  themeParams: {
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
    hint_color: string;
    bg_color: string;
    text_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  isClosingConfirmationEnabled: boolean;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;

    disable: () => void;
    enable: () => void;
    hide: () => void;
    hideProgress: () => void;
    // offClick: ƒ (callback)
    // onClick: ƒ (callback)
    setParams: (params: { [key: string]: string }) => void; //setParams(params)
    setText: (text: string) => void;
    show: () => void;
  };
  close: () => void;
  HapticFeedback: any;
}

export interface ITelegramContext {
  webApp?: IWebApp;
  user?: ITelegramUser;
  unsafeData?: {
    query_id: string;
    user: ITelegramUser;
    auth_date: string;
    hash: string;
  };
}

export interface IDrive {
  id: number;
  from: string;
  to: string;
  datetime: string;
  passengersCount: number;
  bagsCount: number;
  isThereAnimals: boolean;
  isThereKids: boolean;
  description: string;
  price: number;
  createdAt: string;
  driverId: string;
  driver: Driver;
  _count: {
    passsangers: number;
  };
}
export interface Driver {
  userInfo: UserInfo;
}
export interface UserInfo {
  name: string;
}
