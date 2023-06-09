import base64url from 'base64url';
import { prisma } from "$lib/server/prisma.js";
import type { Key } from '@prisma/client';
type AuthenticatorTransport = "ble" | "internal" | "nfc" | "usb";

export type Authenticator = {
    id: number;
    // SQL: Encode to base64url then store as `TEXT`. Index this column
    credentialID: Buffer;
    // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
    credentialPublicKey: Buffer;
    // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
    counter: number;
    // SQL: `VARCHAR(255)` and store string array as a CSV string
    // ['usb' | 'ble' | 'nfc' | 'internal']
    transports?: AuthenticatorTransport[];
    owner: string;
    blacklist: boolean;
    name: string;
};

export type UserModel = {
    id: string;
    username: string;
    currentChallenge: string;
    devices: Array<Authenticator>;
};


export async function getUserFromDB(id: number) {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user) return false;

    let devices = await prisma.key.findMany({ where: { owner: id.toString() } });
    let newDevices: Authenticator[] = [];

    for (let i=0; i<devices.length; i++) {
        //@ts-ignore
        let newAuth = await prisma.keysAuthenticator.findFirst({where : {id: devices[i].authenticator}});
        if (!newAuth) {
            continue
        }
        let newNewAuth: Authenticator = {
            transports: JSON.parse(newAuth.transports),
            id: newAuth.id,
            counter: newAuth.counter,
            owner: newAuth.owner,
            blacklist: newAuth.blacklist,
            name: newAuth.name,
            credentialID: Buffer.from(newAuth.credentialId, "utf-8"),
            credentialPublicKey: Buffer.from(newAuth.credentialPublicKey, "utf-8")
        }
        newDevices.push(newNewAuth);
    }
    const newModel = {id: `${id}`, username: user.userName, currentChallenge: user.currentChallenge, devices: newDevices}
    return newModel as UserModel;
  }
  
export async function setUserCurrentChallenge(user: UserModel, challenge: string) {
    try {
        await prisma.user.update({ where: { id: parseInt(user.id) }, data: { currentChallenge: challenge } });
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function getUserCurrentChallenge(user: UserModel) {
    try {
        const findUser = await prisma.user.findFirst({ where: { id: parseInt(user.id) } });
        if (!findUser) {
            return false;
        }
        return findUser.currentChallenge;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function addNewDevice(device: Authenticator) {
    try {
        console.log(device.transports);
        const addedAuthenticator = await prisma.keysAuthenticator.create({
            data: {
                credentialId: device.credentialID.toString(),
                credentialPublicKey: device.credentialPublicKey.toString(),
                counter: device.counter,
                transports: device.transports ? JSON.stringify(device.transports) : "",
                owner: device.owner,
                blacklist: device.blacklist,
                name: device.name
            }
        });
        await prisma.key.create({
            data: {
                owner: device.owner,
                authenticator: addedAuthenticator.id
            }
        });
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export function getUserAuthenticator(user: UserModel, id: any) {
    for (let i = 0; i<user.devices.length; i++) {
        if (base64url.encode(user.devices[i].credentialID) === id) {
            return user.devices[i] as Authenticator;
        }
    }
    return false;
}

export async function saveUpdatedAuthenticatorCounter(authenticator: Authenticator, newCount: number) {
    try {
        await prisma.keysAuthenticator.update({ where: { id: authenticator.id }, data: { counter: newCount } });
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}