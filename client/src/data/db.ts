import Dexie, { type Table } from 'dexie';

export interface NotificationProp {
    id?: number;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error',
    createAt: Date;
    read: boolean;
    userId: string;
}

export interface Recycle {
    key: string,
    name: string,
}

export interface OrderItem {
    product: string,
    quantity: number,
    description: string,
    materials: Recycle[],
}

export interface Orders {
    orderNumber: string;
    vendor: string;
    orderDate: number;
    orderitems: OrderItem[];
    disposalDate: number | null;
    userId: string
}

export class MySubClassedDexie extends Dexie {
    notifications!: Table<NotificationProp, number>;
    orders!: Table<Orders, number>;

    constructor() {
        super('tuktukDB');
        this.version(1).stores({
            notifications: '++id, message, type, createAt, read',
            orders: 'orderNumber, vendor, orderDate, orderitems'
        })
        this.version(2).stores({
            notifications: '++id, message, type, createAt, read',
            orders: 'orderNumber, vendor, orderDate, orderitems, disposalDate'
        })
        this.version(3).stores({
            notifications: '++id, message, type, createAt, read',
            orders: 'orderNumber, vendor, orderDate, orderitems, disposalDate'
        })
        this.version(4).stores({
            notifications: '++id, message, type, createAt, read, userId',
            orders: 'orderNumber, vendor, orderDate, orderitems, disposalDate, userId'
        })
    }
}

export const tuktukDB = new MySubClassedDexie();