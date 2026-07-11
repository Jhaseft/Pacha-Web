export interface EditProfileFormData {
  firstName?: string;
  lastName?: string;
  username: string;
  bio: string;
  avatarFile?: File;
  coverFile?: File;
}
