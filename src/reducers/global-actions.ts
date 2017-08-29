import {AppStatus, FormStatus, GlobalActions, Status} from "./global";
import {OptionsState} from "../app/options-form/reducer";

export function setStatus(status: Status) {
    return {
        type: GlobalActions.SetStatus,
        payload: status
    }
}

export function setFormStatus(formStatus: FormStatus) {
    return {
        type: GlobalActions.SetFormStatus,
        payload: formStatus
    }
}

export function setAppStatus(status: AppStatus) {
    return {
        type: GlobalActions.SetAppStatus,
        payload: status
    }
}

export function initBs(options: OptionsState) {
    return {
        type: GlobalActions.BsInit,
        payload: options
    }
}

export function receivePaths(paths: any[]) {
    return {
        type: GlobalActions.ReceivePaths,
        payload: paths
    }
}