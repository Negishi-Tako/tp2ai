export interface Settings {
    id?: string; // id is optional on create
    elasticsearchURL: string;
    BASICAuthUser: string;
    BASICAuthPasswd: string;
    APIServerURL: string;
}

export interface SettingsResponse {
    message: string;
    settings: Settings;
}

