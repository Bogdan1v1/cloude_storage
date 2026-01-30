export interface RegisterFormDTO {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginFormDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export const FileType = {
  PHOTOS: 'photos',
  TRASH: 'trash',
} as const;

export type FileType = (typeof FileType)[keyof typeof FileType];

export interface FileDTO {
  id: number;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  isFolder: boolean;
  parentId: number | null;
  deletedAt: string | null;
  path: string; 
}