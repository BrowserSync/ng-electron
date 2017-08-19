import {remote} from 'electron';
const {selectDirectory} = remote.require('./main');

export function selectDirectoryEffect(): Promise<string[]> {
    return new Promise((res, rej) => {
        selectDirectory(paths => {
            res(paths);
        })
    })
}