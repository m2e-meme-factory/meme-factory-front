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
        passsangers: number
    }
  }
  export interface Driver {
    userInfo: UserInfo;
  }
  export interface UserInfo {
    name: string;
  }
  