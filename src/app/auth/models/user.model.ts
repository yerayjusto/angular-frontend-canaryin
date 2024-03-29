import { Post } from 'src/app/home/models/post';

export type Role= 'admin' | 'premium' | 'user';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    imagePath?: string;
    posts?: Post[];
}
