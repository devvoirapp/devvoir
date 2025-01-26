import {ComponentType} from "react";

export interface DropdownOption {
    value: string;
    label: string;
    icon?: ComponentType<{ className?: string }>;
    description?: string;
}

export interface GitHubUser {
    id?: string;
    login?: string;
    name?: string;
    email?: string;
    image?: string;
}
